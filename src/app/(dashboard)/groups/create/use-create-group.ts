"use client";

import { useMutation } from "@tanstack/react-query";
import { createGroupInfoAction, createGroupMetadataAction } from "./action";
import { getMasterKey } from "@/utils/client/key-storage";
import { arrayBufferToBase64 } from "@/utils/client/helper";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { resolveGroupLookupContext } from "@/utils/client/group-lookup";
import { useAuthStore } from "@/store/auth.store";

interface CreateGroupParams {
  groupName: string;
  groupExplain: string;
  groupImg: string;
}

export const useCreateGroup = () => {
  return useMutation<void, Error, CreateGroupParams>({
    mutationFn: async (groupData) => {
      const userId = localStorage.getItem("hashed_user_id_for_manager");
      const accessToken = useAuthStore.getState().accessToken;

      if (!userId) throw new Error("유저 ID를 찾을 수 없습니다.");
      if (!accessToken) throw new Error("AccessToken이 없습니다. 다시 로그인 해주세요.");

      // 1단계: E2EE 가 아닌 그룹 정보(이름·설명·이미지)로 그룹 생성 요청
      const firstApiResponse = await createGroupInfoAction(accessToken, groupData);

      if (!firstApiResponse.success || !firstApiResponse.groupId) {
        throw new Error(firstApiResponse.error || "1단계 그룹 정보 생성 실패");
      }

      const { groupId } = firstApiResponse;
      const lookupContext = await resolveGroupLookupContext(groupId);

      // 2단계: 클라이언트에서 그룹키 생성·암호화
      const [masterKey, newGroupKey] = await Promise.all([
        getMasterKey(),
        crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
          "encrypt",
          "decrypt",
        ]),
      ]);

      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      const [encGroupId, encUserId, exportedGroupKeyBuffer] = await Promise.all(
        [
          encryptDataClient(groupId, masterKey, "group_proxy_user"),
          encryptDataClient(userId, newGroupKey, "group_sharekey"),
          crypto.subtle.exportKey("raw", newGroupKey),
        ]
      );

      const groupKeyString = arrayBufferToBase64(exportedGroupKeyBuffer);

      const [encencGroupMemberId, encGroupKey] = await Promise.all([
        encryptDataClient(encUserId, masterKey, "group_proxy_user"),
        encryptDataClient(groupKeyString, masterKey, "group_sharekey"),
      ]);

      // 3단계: 암호화된 메타데이터 전송
      const secondApiResponse = await createGroupMetadataAction(accessToken, {
        groupId: groupId,
        lookupId: lookupContext.lookupId,
        lookupVersion: lookupContext.lookupVersion,
        encGroupId: encGroupId,
        encencGroupMemberId: encencGroupMemberId,
        encUserId: encUserId,
        encGroupKey: encGroupKey,
      });

      if (!secondApiResponse.success) {
        // 1단계는 성공했지만 메타데이터 전송이 실패한 경우.
        // 백엔드에 1단계 롤백 API 가 추가되면 여기서 호출해 정합성을 맞춰야 함.
        throw new Error(
          secondApiResponse.error || "2단계 메타데이터 전송 실패"
        );
      }
    },
  });
};
