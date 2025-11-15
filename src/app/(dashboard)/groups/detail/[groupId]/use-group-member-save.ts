"use client";
// TODO : 초대로직 설명 듣고 고치기
import { useMutation } from "@tanstack/react-query";
import { getMasterKey } from "@/utils/client/key-storage";
import decryptDataClient from "@/utils/client/crypto/decryptClient";
import { useAuthStore } from "@/store/auth.store";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { saveGroupMemberAction } from "./action";

/**
 * (가정) 비공개 링크의 토큰을 복호화한 후의 데이터 구조
 */
interface DecryptedJoinToken {
  groupKey: string; // 초대자가 보낸 "평문 그룹 키"
  encencGroupMemberId: string; // 초대자가 /invite1에서 받은 "암호화된 멤버 ID"
}

/**
 * (가정) 토큰을 복호화하는 유틸리티 함수
 * @param token URL 쿼리 스트링의 토큰
 * @param masterKey 손님 본인의 마스터키
 */
async function decryptJoinToken(
  token: string,
  masterKey: CryptoKey
): Promise<DecryptedJoinToken> {
  // 이 함수는 초대자가 "손님의 공개키"로 암호화한 토큰을
  // "손님의 마스터키"로 복호화하는 로직을 구현해야 합니다.
  // (예시: JSON.parse(await decryptDataClient(token, masterKey, "...")))
  
  // --- 임시 하드코딩 (실제 구현 필요) ---
  if (!token) throw new Error("토큰이 없습니다.");
  console.log("🟡 [손님 3단계] 토큰 복호화 시도...", token);
  // 실제로는 토큰을 masterKey로 복호화해야 합니다.
  // 이 예시에서는 토큰이 "groupKey,encencId" 형태라고 가정합니다.
  const parts = token.split(","); 
  if (parts.length < 2) throw new Error("유효하지 않은 토큰 포맷");
  
  return {
    groupKey: parts[0], // 실제로는 복호화된 평문 그룹 키
    encencGroupMemberId: parts[1], // 실제로는 복호화된 encencGroupMemberId
  };
  // --- 실제 구현은 위 주석 로직을 따라야 합니다 ---
}


/**
 * [손님용 3단계] 그룹 최종 가입 (E2EE 정보 제출) 훅
 * - Swagger (image_a54f0b.png)의 API를 호출합니다.
 * - 손님의 E2EE 암호화 로직이 모두 포함됩니다.
 */
export const useGroupMemberSave = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      joinToken,
    }: {
      groupId: string;
      joinToken: string;
    }) => {
      try {
        console.log("🔵 [손님 3단계] 그룹 최종 가입 시작");
        
        // 1. 손님 본인의 마스터키와 유저 ID 로드
        const masterKey = await getMasterKey();
        if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");
        
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error("유저 ID를 찾을 수 없습니다.");

        // 2. 초대 토큰(비공개 링크) 복호화 -> "그룹 키" 획득
        const { groupKey, encencGroupMemberId } = await decryptJoinToken(
          joinToken,
          masterKey
        );
        if (!groupKey || !encencGroupMemberId) {
          throw new Error("초대 토큰 정보가 유효하지 않습니다.");
        }

        console.log("🟡 [손님 3단계] 그룹 키 획득 완료, 등록 패킷 암호화 시작...");
        
        // 3. POST /member/save API 명세에 맞춰 "등록 패킷" 암호화
        const [encGroupKey, encUserId, encGroupId] = await Promise.all([
          // (a) groupKey를 내 마스터키로 암호화 (내가 나중에 쓸 용도)
          encryptDataClient(groupKey, masterKey, "group_sharekey"),
          // (b) 내 userId를 groupKey로 암호화 (다른 그룹원들이 볼 용도)
          encryptDataClient(userId, groupKey, "group_sharekey"),
          // (c) groupId를 내 마스터키로 암호화
          encryptDataClient(groupId, masterKey, "group_proxy_user"),
        ]);

        if (!encGroupKey || !encUserId || !encGroupId) {
          throw new Error("E2EE 패킷 암호화 중 오류가 발생했습니다.");
        }

        const payload = {
          groupId,
          encGroupKey,
          encUserId,
          encGroupId,
          encencGroupMemberId, // 2번에서 복호화한 값
        };
        
        console.log("🔵 [손님 3단계] 서버로 암호화된 등록 패킷 전송", payload);
        
        // 4. 서버 액션 호출 (암호화된 패킷 제출)
        const result = await saveGroupMemberAction(payload);
        if (!result.success) throw new Error(result.error);

        console.log("✅ [손님 3단계] 그룹 가입 성공!", result.data);
        return result.data; // 성공 메시지 반환
        
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "그룹 가입 중 알 수 없는 오류";
        console.error("🔴 [손님 3단계] 실패:", errorMessage);
        throw new Error(errorMessage);
      }
    },
  });
};