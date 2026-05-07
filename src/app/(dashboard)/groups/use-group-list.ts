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
import { useAuthStore } from "@/store/auth.store";

const requireAccessToken = (): string => {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("AccessToken이 없습니다. 다시 로그인 해주세요.");
  return token;
};

// 타입 정의 유지 (GroupInfoData, DecryptedGroupInfo 등)
export interface GroupInfoData {
  groupId: string;
  groupName: string;
  groupImg: string;
  explanation: string;
  managerId: string;
  /** groupKey("group_sharekey")로 암호화된 userId 리스트 */
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
      const result = await getEncGroupsIdAction(requireAccessToken());

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
  const stableGroupIdsKey = decryptedGroupObjects
    ? decryptedGroupObjects.map((g) => g.groupId).sort().join(",")
    : "";

  // --- 2단계: 그룹별 키 조회/복호화 (개별 실패 격리) ---
  const step2Query = useQuery({
    queryKey: ["groupList", "step2", stableGroupIdsKey],
    queryFn: async () => {
      if (!decryptedGroupObjects || decryptedGroupObjects.length === 0) return [];

      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      const settled = await Promise.allSettled(
        decryptedGroupObjects.map(async (obj) => {
          const result = await getEncGroupsKeyAction(requireAccessToken(), [obj]);
          if (result.error) throw new Error(result.error);
          const encKeys = result.data as ViewGroupSecResponseData[];
          if (!encKeys || encKeys.length === 0) {
            throw new Error(`그룹 키 없음: ${obj.groupId}`);
          }
          const groupKeyString = await decryptDataClient(
            encKeys[0].encGroupKey,
            masterKey,
            "group_sharekey"
          );
          const groupKeyArrayBuffer = base64ToArrayBuffer(groupKeyString);
          const cryptoKey = await crypto.subtle.importKey(
            "raw",
            groupKeyArrayBuffer,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
          );
          return { groupId: obj.groupId, cryptoKey };
        })
      );

      return settled.map((r, i) => {
        if (r.status === "fulfilled") return r.value;
        console.error(
          `[groupList step2] 그룹 키 복호화 실패 groupId=${decryptedGroupObjects[i].groupId}`,
          r.reason
        );
        return null;
      });
    },
    enabled: !!decryptedGroupObjects && !isStep1Empty,
    staleTime: 1000 * 60 * 5,
  });

  const decryptedGroupKeys = step2Query.data;

  // --- 3단계: 그룹별 정보 조회 및 멤버 복호화 (개별 실패 격리) ---
  const step3Query = useQuery({
    queryKey: ["groupList", "step3", stableGroupIdsKey],
    queryFn: async () => {
      if (!decryptedGroupObjects || !decryptedGroupKeys) return [];

      const validEntries = decryptedGroupKeys.filter(
        (e): e is { groupId: string; cryptoKey: CryptoKey } => e !== null
      );
      if (validEntries.length === 0) return [];

      const settled = await Promise.allSettled(
        validEntries.map(async ({ groupId, cryptoKey }) => {
          const result = await getGroupsInfoAction(requireAccessToken(), [{ groupId }]);
          if (result.error) throw new Error(result.error);
          const dataList = result.data;
          if (!dataList || dataList.length === 0) {
            throw new Error(`그룹 정보 없음: ${groupId}`);
          }
          const groupData = dataList[0];
          const decryptedMemberIds = await Promise.all(
            groupData.encUserId.map((encId) =>
              decryptDataClient(encId, cryptoKey, "group_sharekey")
            )
          );
          return {
            ...groupData,
            userIds: decryptedMemberIds,
          } as DecryptedGroupInfo;
        })
      );

      return settled.flatMap((r, i) => {
        if (r.status === "fulfilled") return [r.value];
        console.error(
          `[groupList step3] 그룹 정보/멤버 복호화 실패 groupId=${validEntries[i].groupId}`,
          r.reason
        );
        return [];
      });
    },
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