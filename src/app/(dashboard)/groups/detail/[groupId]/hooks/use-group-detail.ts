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
import { useMemo } from "react";

interface UseGroupDetailOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/** 재시도(Retry)가 의미 없는 에러인지 판별하는 함수 */
const shouldRetry = (failureCount: number, error: Error) => {
  // 복호화 관련 에러나 권한 에러는 재시도하지 않음
  if (error.message.includes("찾을 수 없거나") ||
    error.message.includes("접근 권한") ||
    error.message.includes("Decryption failed")) { // Web Crypto API 에러 메시지
    return false;
  }
  // 그 외 네트워크 에러 등은 최대 2번 재시도
  return failureCount < 2;
};

/**
 * 특정 그룹(targetGroupId) 하나의 정보를 3단계 E2EE 과정을 거쳐 조회하는 훅
 */
export const useGroupDetail = (
  targetGroupId: string | null,
  options?: UseGroupDetailOptions
) => {
  // --- 1단계: 전체 암호화 그룹 ID 목록 조회 후 Target 찾기 & 복호화 ---
  const {
    data: groupMetadata,
    isPending: isStep1Pending,
    error: errorStep1,
    isError: isStep1Error,
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

          return {
            groupId: decryptedGroupId,
            encGroupMemberId: decryptedGroupMemberId,
          };
        }
      }

      throw new Error("해당 그룹을 찾을 수 없거나 접근 권한이 없습니다.");
    },
    enabled: !!targetGroupId && (options?.enabled ?? true),
    refetchInterval: (query) => {
      // 에러 상태에서는 refetch 중지
      if (query.state.status === "error") return false;
      return options?.refetchInterval || false;
    },
    refetchIntervalInBackground: false,
    staleTime: 5 * 60 * 1000, // 5분으로 증가 (너무 자주 재조회 방지)
    gcTime: 10 * 60 * 1000, // 10분
    retry: shouldRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // --- 2단계: 해당 그룹의 암호화 키(Group Key) 조회 & 복호화 ---
  const {
    data: groupKey,
    isPending: isStep2Pending,
    error: errorStep2,
    isError: isStep2Error,
  } = useQuery({
    queryKey: ["groupDetail", "step2", targetGroupId],
    queryFn: async () => {
      if (!groupMetadata) {
        throw new Error("그룹 메타데이터가 없습니다.");
      }

      const result = await getEncGroupsKeyAction([groupMetadata]);

      if (result.error) throw new Error(result.error);
      const data = result.data as ViewGroupSecResponseData[];
      if (!data || data.length === 0)
        throw new Error("그룹 키를 찾을 수 없습니다.");

      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키 에러");

      const groupKeyString = await decryptDataClient(
        data[0].encGroupKey,
        masterKey,
        "group_sharekey"
      );

      const groupKeyArrayBuffer = base64ToArrayBuffer(groupKeyString);

      return await crypto.subtle.importKey(
        "raw",
        groupKeyArrayBuffer,
        { name: "AES-GCM" },
        false,
        ["decrypt", "encrypt"]
      );
    },
    // Step 1이 성공했고 에러가 없을 때만 실행
    enabled: !!groupMetadata && !isStep1Error,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: shouldRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // --- 3단계: 그룹 정보(멤버 포함) 조회 & 멤버 목록 복호화 ---
  const {
    data: finalGroupData,
    isPending: isStep3Pending,
    error: errorStep3,
    isError: isStep3Error,
  } = useQuery<DecryptedGroupInfo | null>({
    queryKey: ["groupDetail", "step3", targetGroupId],
    queryFn: async () => {
      if (!groupMetadata || !groupKey) {
        throw new Error("필수 데이터가 준비되지 않았습니다.");
      }

      const payload = [{ groupId: groupMetadata.groupId }];

      const result = await getGroupsInfoAction(payload);
      if (result.error) throw new Error(result.error);

      const dataList = result.data as ViewGroupThirdResponseData[];
      if (!dataList || dataList.length === 0) return null;

      const targetGroup = dataList[0];

      const decryptedMemberIds = await Promise.all(
        targetGroup.encUserId.map((encId) =>
          decryptDataClient(encId, groupKey, "group_sharekey")
        )
      );

      return {
        groupId: targetGroup.groupId,
        groupName: targetGroup.groupName,
        groupImg: targetGroup.groupImg,
        explanation: targetGroup.explanation || "",
        managerId: targetGroup.managerId,
        userIds: decryptedMemberIds,
      };
    },
    // Step 1, 2가 모두 성공했고 에러가 없을 때만 실행
    enabled: !!groupMetadata && !!groupKey && !isStep1Error && !isStep2Error,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: shouldRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 로딩 상태 통합
  const isPending =
    isStep1Pending ||
    (!isStep1Error && !!groupMetadata && isStep2Pending) ||
    (!isStep1Error && !isStep2Error && !!groupKey && isStep3Pending);

  const error = errorStep1 || errorStep2 || errorStep3;
  const errorMessage = error instanceof Error ? error.message : "정보 로드 실패";
  const isError = isStep1Error || isStep2Error || isStep3Error;
  // 반환값 메모이제이션 (UseMemo)
  // 이 훅을 사용하는 컴포넌트의 불필요한 리렌더링을 막기 위해 필수
  return useMemo(() => ({
    data: finalGroupData,
    groupKey: groupKey,
    isPending,
    error: isError ? errorMessage : null,
    isError,
  }), [finalGroupData, groupKey, isPending, isError, errorMessage]);
  // return {
  //   data: finalGroupData,
  //   groupKey: groupKey,
  //   isPending,
  //   error: error
  //     ? error instanceof Error
  //       ? error.message
  //       : "그룹 정보를 불러오는데 실패했습니다."
  //     : null,
  //   // 디버깅 및 세밀한 제어를 위한 추가 정보
  //   isError: isStep1Error || isStep2Error || isStep3Error,
  // };
};