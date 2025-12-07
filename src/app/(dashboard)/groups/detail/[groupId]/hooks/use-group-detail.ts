"use client";

import { useQuery } from "@tanstack/react-query";
import { getMasterKey } from "@/utils/client/key-storage";
import {
  ViewGroupFirstResponseData,
  ViewGroupSecResponseData,
  ViewGroupThirdResponseData,
} from "@/api/group-view-create";
import decryptDataClient from "@/utils/client/crypto/decryptClient";
import { base64ToArrayBuffer } from "@/utils/client/helper";
import {
  getEncGroupsIdAction,
  getEncGroupsKeyAction,
  getGroupsInfoAction,
} from "../../../action";
import { DecryptedGroupInfo } from "../../../use-group-list";

/**
 * 특정 그룹(targetGroupId) 하나의 정보를 3단계 E2EE 과정을 거쳐 조회하는 훅
 */
export const useGroupDetail = (targetGroupId: string | null) => {
  // --- 1단계: 전체 암호화 그룹 ID 목록 조회 후 Target 찾기 & 복호화 ---
  const {
    data: groupMetadata,
    isPending: isStep1Pending,
    error: errorStep1,
  } = useQuery({
    queryKey: ["groupDetail", "step1", targetGroupId],
    queryFn: async () => {
      if (!targetGroupId) throw new Error("GroupId가 필요합니다.");

      const result = await getEncGroupsIdAction();
      if (result.error) throw new Error(result.error);
      if (!result.data || result.data.length === 0) return null;

      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      const list = result.data as ViewGroupFirstResponseData[];

      for (const item of list) {
        const decryptedGroupId = await decryptDataClient(
          item.encGroupId,
          masterKey,
          "group_proxy_user"
        );

        if (decryptedGroupId === targetGroupId) {
          const decryptedGroupMemberId = await decryptDataClient(
            item.encencGroupMemberId,
            masterKey,
            "group_proxy_user"
          );

          // 찾은 그룹의 메타데이터 반환
          return {
            groupId: decryptedGroupId,
            encGroupMemberId: decryptedGroupMemberId,
          };
        }
      }

      throw new Error("해당 그룹을 찾을 수 없거나 접근 권한이 없습니다.");
    },
    enabled: !!targetGroupId, // groupId가 있을 때만 실행
    staleTime: 1000 * 60 * 5,
  });

  // --- 2단계: 해당 그룹의 암호화 키(Group Key) 조회 & 복호화 ---
  const {
    data: groupKey,
    isPending: isStep2Pending,
    error: errorStep2,
  } = useQuery({
    queryKey: ["groupDetail", "step2", targetGroupId],
    queryFn: async () => {
      // API가 배열을 요구하므로 배열로 감싸서 전달
      const result = await getEncGroupsKeyAction([groupMetadata!]);

      if (result.error) throw new Error(result.error);
      const data = result.data as ViewGroupSecResponseData[];
      if (!data || data.length === 0)
        throw new Error("그룹 키를 찾을 수 없습니다.");

      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키 에러");

      // 키 복호화
      const groupKeyString = await decryptDataClient(
        data[0].encGroupKey,
        masterKey,
        "group_sharekey"
      );

      const groupKeyArrayBuffer = base64ToArrayBuffer(groupKeyString);

      // CryptoKey 객체 생성 및 반환
      return await crypto.subtle.importKey(
        "raw",
        groupKeyArrayBuffer,
        { name: "AES-GCM" },
        false,
        ["decrypt", "encrypt"]
      );
    },
    // 1단계 데이터(groupMetadata)가 준비되어야 실행
    enabled: !!groupMetadata,
    staleTime: 1000 * 60 * 5,
  });

  // --- 3단계: 그룹 정보(멤버 포함) 조회 & 멤버 목록 복호화 ---
  const {
    data: finalGroupData,
    isPending: isStep3Pending,
    error: errorStep3,
  } = useQuery<DecryptedGroupInfo | null>({
    queryKey: ["groupDetail", "step3", targetGroupId],
    queryFn: async () => {
      // API가 배열 형태를 요구하므로 형식 맞춰줌
      const payload = [{ groupId: groupMetadata!.groupId }];

      const result = await getGroupsInfoAction(payload);
      if (result.error) throw new Error(result.error);

      const dataList = result.data as ViewGroupThirdResponseData[];
      if (!dataList || dataList.length === 0) return null;

      const targetGroup = dataList[0];

      // 멤버 ID들 복호화 (Promise.all 사용)
      const decryptedMemberIds = await Promise.all(
        targetGroup.encUserId.map((encId) =>
          decryptDataClient(encId, groupKey!, "group_sharekey")
        )
      );

      return {
        groupId: targetGroup.groupId,
        groupName: targetGroup.groupName,
        groupImg: targetGroup.groupImg,
        explanation: targetGroup.explanation || "", // Add explanation property
        // TODO : 매니저 ID는 평문이 아닌가?
        managerId: targetGroup.managerId,
        userIds: decryptedMemberIds,
      };
    },
    // 1단계(메타데이터)와 2단계(키)가 모두 준비되어야 실행
    enabled: !!groupMetadata && !!groupKey,
    staleTime: 1000 * 60 * 5,
  });

  // [성장 포인트] 로딩 및 에러 상태를 통합하여 사용하는 쪽에서 편하게 만듦
  const isPending = isStep1Pending || isStep2Pending || isStep3Pending;
  const error = errorStep1 || errorStep2 || errorStep3;

  return {
    data: finalGroupData,
    groupKey: groupKey,
    isPending,
    error: error
      ? error instanceof Error
        ? error.message
        : "그룹 정보를 불러오는데 실패했습니다."
      : null,
  };
};
