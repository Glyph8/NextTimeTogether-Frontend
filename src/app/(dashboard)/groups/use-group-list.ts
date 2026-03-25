"use client";

import { useQuery } from "@tanstack/react-query";
import { getMasterKey } from "@/utils/client/key-storage";
import {
  getEncGroupsIdAction,
  getEncGroupsKeyAction,
  getGroupsInfoAction,
} from "./action";
import {
  ViewGroupFirstResponseData,
  ViewGroupSecResponseData,
} from "@/api/group-view-create";
import decryptDataClient from "@/utils/client/crypto/decryptClient";
import { base64ToArrayBuffer } from "@/utils/client/helper";

// 타입 정의 유지 (GroupInfoData, DecryptedGroupInfo 등)
export interface GroupInfoData {
  groupId: string;
  groupName: string;
  groupImg: string;
  explanation: string;
  managerId: string;
  encUserId: string[];
}

export interface DecryptedGroupInfo extends Omit<GroupInfoData, "encUserId"> {
  userIds: string[];
}

/**
 * E2EE 그룹 목록 조회를 위한 Dependent Query Hook
 * useEffect 제거 및 queryFn 내부 복호화 적용
 */
export const useDecryptedGroupList = () => {
  // --- 1단계: 암호화된 ID 조회 및 복호화 ---
  const step1Query = useQuery({
    queryKey: ["groupList", "step1", "decryptedIds"],
    queryFn: async () => {
      // 1. 데이터 가져오기
      const result = await getEncGroupsIdAction();

      if (result.error) throw new Error(result.error);
      if (!result.data || result.data.length === 0) return []; // 빈 배열 즉시 반환

      const encData = result.data as ViewGroupFirstResponseData[];
      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      // 2. 즉시 복호화 수행 (병렬 처리)
      const decryptedPromises = encData.map(async (item) => {
        const [groupId, encGroupMemberId] = await Promise.all([
          decryptDataClient(item.encGroupId, masterKey, "group_proxy_user"),
          decryptDataClient(item.encencGroupMemberId, masterKey, "group_proxy_user")
        ]);

        return { groupId, encGroupMemberId };
      });

      return Promise.all(decryptedPromises);
    },
    staleTime: 1000 * 60 * 5,
  });

  const decryptedGroupObjects = step1Query.data;
  const isStep1Empty = decryptedGroupObjects?.length === 0;

  // --- 2단계: 그룹 키 조회 및 복호화 ---
  const step2Query = useQuery({
    queryKey: ["groupList", "step2", "decryptedKeys", decryptedGroupObjects],
    queryFn: async () => {
      // 상위 데이터가 없으면 실행되지 않지만, 타입 안전성을 위해 체크
      if (!decryptedGroupObjects || decryptedGroupObjects.length === 0) return [];

      const result = await getEncGroupsKeyAction(decryptedGroupObjects);
      if (result.error) throw new Error(result.error);

      const encKeys = result.data as ViewGroupSecResponseData[];
      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      // 키 복호화 및 importKey 수행
      const keyPromises = encKeys.map(async (item) => {
        const groupKeyString = await decryptDataClient(
          item.encGroupKey,
          masterKey,
          "group_sharekey"
        );
        const groupKeyArrayBuffer = base64ToArrayBuffer(groupKeyString);
        return await crypto.subtle.importKey(
          "raw",
          groupKeyArrayBuffer,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
      });

      return Promise.all(keyPromises);
    },
    // 1단계가 성공했고, 데이터가 있을 때만 실행
    enabled: !!decryptedGroupObjects && !isStep1Empty,
    staleTime: 1000 * 60 * 5,
  });

  const decryptedGroupKeys = step2Query.data;

  // --- 3단계: 그룹 정보 조회 및 최종 복호화 ---
  const step3Query = useQuery({
    queryKey: ["groupList", "step3", "finalData", decryptedGroupObjects],
    queryFn: async () => {
      if (!decryptedGroupObjects || !decryptedGroupKeys) return [];

      const groupIdObjects = decryptedGroupObjects.map((item) => ({
        groupId: item.groupId,
      }));

      const result = await getGroupsInfoAction(groupIdObjects);
      if (result.error) throw new Error(result.error);

      const finalEncData = result.data;
      if (!finalEncData) throw new Error("3단계 데이터 없음");

      // 최종 데이터 복호화
      const finalPromises = finalEncData.map(async (groupData, index) => {
        const groupCryptoKey = decryptedGroupKeys[index];

        // 유저 ID 목록 복호화
        const userDecryptionPromises = groupData.encUserId.map((encId) =>
          decryptDataClient(encId, groupCryptoKey, "group_sharekey")
        );
        const decryptedMemberIds = await Promise.all(userDecryptionPromises);

        return {
          ...groupData,
          userIds: decryptedMemberIds, // 복호화된 ID 교체
        } as DecryptedGroupInfo;
      });

      return Promise.all(finalPromises);
    },
    // 1, 2단계 데이터가 모두 존재해야 실행
    enabled: !!decryptedGroupObjects && !!decryptedGroupKeys && !isStep1Empty,
    staleTime: 1000 * 60 * 5,
  });

  // --- 최종 반환 ---

  // 1단계에서 빈 배열이면 로딩 끝난 것으로 간주하고 빈 배열 반환
  if (step1Query.isSuccess && isStep1Empty) {
    return {
      data: [],
      isPending: false,
      error: null,
    };
  }

  return {
    data: step3Query.data ?? [], // 아직 로딩 중이거나 에러면 빈 배열(혹은 undefined)
    isPending: step1Query.isPending || step2Query.isPending || step3Query.isPending,
    error: step1Query.error?.message || step2Query.error?.message || step3Query.error?.message,
  };
};