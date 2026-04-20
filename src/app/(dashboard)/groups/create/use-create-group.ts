"use client";

import { useMutation } from "@tanstack/react-query";
import { createGroupInfoAction, createGroupMetadataAction } from "./action";
import { getMasterKey } from "@/utils/client/key-storage";
import { arrayBufferToBase64 } from "@/utils/client/helper";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { resolveGroupLookupContext } from "@/utils/client/group-lookup";

interface CreateGroupParams {
  groupName: string;
  groupExplain: string;
  groupImg: string;
}

export const useCreateGroup = () => {
  return useMutation<void, Error, CreateGroupParams>({
    mutationFn: async (groupData) => {
      // const userId = useAuthStore.getState().userId;
      const userId = localStorage.getItem("hashed_user_id_for_manager");

      if (!userId) throw new Error("유저 ID를 찾을 수 없습니다.");
      console.log("🔵 [E2EE 그룹 생성 1단계] 그룹 '정보' 전송 시작");

      // 1. (API 1) E2EE가 아닌 정보(그룹명 등)로 그룹 생성 요청
      const firstApiResponse = await createGroupInfoAction(groupData);

      if (!firstApiResponse.success || !firstApiResponse.groupId) {
        throw new Error(firstApiResponse.error || "1단계 그룹 정보 생성 실패");
      }

      const { groupId } = firstApiResponse;

      const lookupContext = await resolveGroupLookupContext(groupId);
      console.log(`✅ [E2EE 1단계] 성공, groupId: ${groupId}`);
      console.log("🟡 [E2EE 2단계] 클라이언트 암호화 시작");

      // 2. (Client Crypto) 클라이언트에서 키/데이터 암호화
      const [masterKey, newGroupKey] = await Promise.all([
        getMasterKey(),
        // 새 그룹 키(AES-GCM)를 클라이언트에서 직접 생성
        crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
          "encrypt",
          "decrypt",
        ]),
      ]);

      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");
      if (!userId) throw new Error("유저 ID를 찾을 수 없습니다.");

      console.log("🟡 [E2EE 2단계] 키 로드 및 생성 완료, 암호화 진행");

      // 3. (Client Crypto) 기존 action.ts에 있던 모든 암호화 로직을 클라이언트에서 수행
      const [encGroupId, encUserId, exportedGroupKeyBuffer] = await Promise.all(
        [
          encryptDataClient(groupId, masterKey, "group_proxy_user"),
          encryptDataClient(userId, newGroupKey, "group_sharekey"),
          crypto.subtle.exportKey("raw", newGroupKey), // CryptoKey를 전송 가능한 형식으로 변환
        ]
      );

      // ArrayBuffer를 base64 문자열로 변환 (서버 전송용)
      const groupKeyString = arrayBufferToBase64(exportedGroupKeyBuffer);

      const [encencGroupMemberId, encGroupKey] = await Promise.all([
        encryptDataClient(encUserId, masterKey, "group_proxy_user"),
        encryptDataClient(groupKeyString, masterKey, "group_sharekey"), // 문자열이 된 그룹키를 마스터키로 암호화
      ]);

      console.log("✅ [E2EE 2단계] 클라이언트 암호화 완료");

      // 4. (API 2) 암호화된 메타데이터를 서버 액션으로 전송
      console.log("🔵 [E2EE 3단계] 암호화된 메타데이터 전송");
      const secondApiResponse = await createGroupMetadataAction({
        groupId: groupId,
        lookupId: lookupContext.lookupId,
        lookupVersion: lookupContext.lookupVersion,
        encGroupId: encGroupId,
        encencGroupMemberId: encencGroupMemberId,
        encUserId: encUserId,
        encGroupKey: encGroupKey,
      });

      if (!secondApiResponse.success) {
        // TODO: 1단계 롤백(Rollback) API 호출이 필요할 수 있음
        throw new Error(
          secondApiResponse.error || "2단계 메타데이터 전송 실패"
        );
      }

      console.log("✅ [E2EE 3단계] 그룹 생성 최종 완료!");
    },
  });
};
