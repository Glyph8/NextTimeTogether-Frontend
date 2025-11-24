"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/store/signupStore"; // Zustand 스토어
import { registerAction } from "../action"; // 수정될 Server Action
import { UserSignUpDTO } from "@/apis/generated/Api"; // API DTO

// --- 클라이언트 암호화 유틸 임포트 ---
// (이 함수들은 서버 코드가 아닌, 클라이언트 전용 유틸이어야 합니다)
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/client/crypto/encrypt-password";
import { encryptEmailPhone } from "@/utils/crypto/auth/encrypt-email-number"; // IV 반환 함수

export const useRegister = () => {
  const router = useRouter();
  // 1. Zustand 스토어에서 이전 단계 폼 데이터 가져오기
  const { formData, reset } = useSignupStore();

  // 2. 현재 페이지(휴대폰 번호) 상태
  const [phoneNumber, setPhoneNumber] = useState("");

  // 3. 로딩 및 에러 상태
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /**
   * 폼 제출 핸들러 (모든 E2EE 암호화 로직 수행)
   * @param isSkipping '지금 입력 안할래요' 버튼 클릭 여부
   */
  const handleSubmit = async (isSkipping: boolean = false) => {
    setError(null);

    // 4. 스토어에 필수 데이터(ID/PW)가 없으면 중단
    const { userId, password, email } = formData;
    if (!userId || !password || !email) {
      setError("필수 정보(ID/PW)가 없습니다. 회원가입을 다시 시도해주세요.");
      return;
    }

    startTransition(async () => {
      try {
        // 5. (클라이언트) E2EE 암호화/해시 작업 시작
        const masterKey = await deriveMasterKeyPBKDF2(userId, password);

        // 6. 로그인과 동일한 '증명 값' 생성
        const hashedUserId = await hmacSha256Truncated(masterKey, userId, 256);
        const hashedPassword = await hashPassword(password, masterKey);
        
        // 7. 암호화가 필요한 PII 데이터 처리 (Email, Phone)
        // (주의: 이 함수들은 매번 랜덤 IV를 생성해야 합니다)
        const hashedEmail = await encryptEmailPhone(masterKey, email);
        const hashedTelephone = await encryptEmailPhone(
          masterKey,
          isSkipping ? "" : phoneNumber
        );
        const randomIv = crypto.getRandomValues(new Uint8Array(12));
        // 8. 메인 백엔드로 보낼 DTO 생성
        const userDto: UserSignUpDTO = {
          userId: hashedUserId,          // 로그인 시 '증명 값'으로 사용될 ID
          password: hashedPassword,      // 로그인 시 '증명 값'으로 사용될 PW
          email: hashedEmail.ciphertext, // 암호화된 이메일
          emailIv: hashedEmail.iv,       // 이메일 복호화용 IV
          telephone: hashedTelephone.ciphertext,
          phoneIv: hashedTelephone.iv,
          nickname: formData.nickname || "", 
          age: formData.age || "",
          gender: formData.gender || undefined,
          imgIv: btoa(String.fromCharCode(...randomIv)), // 'hashedUserId'가 HMAC이므로 IV 불필요. DTO 수정 필요?
        };

        // 9. (클라이언트 -> BFF) '암호화된 DTO'를 서버 액션으로 전송
        const result = await registerAction(userDto);

        if (result.success) {
          // 10. 성공 시
          reset();
        //   clearFormData(); // Zustand 스토어 비우기
          router.push("/complete-signup");
        } else {
          setError(result.error || "알 수 없는 오류가 발생했습니다.");
        }
      } catch (err) {
        console.error("클라이언트 회원가입 처리 실패:", err);
        setError("암호화 또는 서버 요청 중 오류가 발생했습니다.");
      }
    });
  };

  return {
    phoneNumber,
    setPhoneNumber,
    handleSubmit,
    isPending,
    error,
  };
};
