"use server"; // 이 파일의 모든 함수는 서버에서만 실행되도록 명시

import { loginRequest } from "@/api/auth";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/crypto/auth/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { redirect } from "next/navigation";

// --- 로그인 처리를 위한 메인 Server Action 함수 ---
export interface LoginActionState {
  error?: string | null; // 에러 메시지 (옵셔널 또는 null 가능)
  success?: string | null; // 성공 메시지 (옵셔널 또는 null 가능)
  // 필요하다면 다른 필드도 추가할 수 있습니다. ex) isLoading: boolean
}

export async function login(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  // 1. 기본적인 입력값 유효성 검사
  if (!userId || !password) {
    return { error: "아이디와 비밀번호를 모두 입력해주세요." };
  }

  try {
    // 💡 **핵심 로직**
    // 이 모든 과정은 'use server' 덕분에 서버에서 안전하게 실행됩니다.
    // 클라이언트(브라우저)에는 이 로직 코드가 절대 전송되지 않습니다.

    // --- 로그인 시 검증 프로세스 ---
    // STEP 1: 사용자가 입력한 아이디와 비밀번호로 마스터 키를 생성합니다.
    // 가입(회원가입) 시 사용했던 로직과 동일해야 합니다.
    const masterKey = await deriveMasterKeyPBKDF2(userId, password);
    // STEP 2: 생성된 마스터 키와 입력한 아이디로 아이디 해시를 생성합니다.
    const hashedUserId = await hmacSha256Truncated(masterKey, userId, 256);
    const hashedPassword = await hashPassword(masterKey, password);

    // STEP 4: 생성된 마스터 키와 입력한 비밀번호로 최종 비밀번호 해시를 생성합니다.
    // 이 때, DB에 저장된 해시값과 비교하기 위해 argon2.verify 함수를 사용합니다??
    // hashPassword 함수는 해시 '생성'용이므로, '검증'에는 verify를 사용해야 합니다??

    const loginResult = await loginRequest(hashedUserId, hashedPassword);
    if (!loginResult || loginResult.code !== 200) {
      console.log("로그인 요청 응답에 문제 발생");
      return { error: "아이디 또는 비밀번호가 잘못되었습니다." };
    }

    console.log("✅ 로그인 성공!");

    // 6. 모든 검증 통과! 로그인 성공 처리
  } catch (err) {
    console.error("로그인 처리 중 에러 발생:", err);
    console.log("!!!", err);
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
  redirect("/main/calendar"); // 성공 시 메인 페이지로 이동
}
