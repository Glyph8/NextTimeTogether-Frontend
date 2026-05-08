"use server";

import { signupRequest } from "@/api/auth";
import { UserSignUpDTO } from "@/apis/generated/Api";
import { redirect } from "next/navigation";
import axios from "axios";

export interface RegisterActionState {
  success?: boolean;
  error?: string | null;
}

/**
 * (수정됨) E2EE 회원가입 서버 액션
 * 이 함수는 이제 '암호화된' DTO를 클라이언트로부터 전달받아
 * 메인 백엔드로 그대로 전달(Passthrough)하는 역할만 합니다.
 * * @param userDto 클라이언트에서 *이미* 암호화/해시된 UserSignUpDTO
 */
export async function registerAction(
  userDto: UserSignUpDTO 
): Promise<RegisterActionState> {

  // 1. (BFF -> 백엔드) BFF는 DTO의 내용을 모른 채 메인 백엔드로 전달
  try {
    const signupResult = await signupRequest(userDto);

    if (!signupResult || signupResult.code !== 200) {
      console.warn("[register] 회원가입 요청 실패:", signupResult?.message);
      return { success: false, error: signupResult?.message || "회원가입에 실패했습니다." };
    }
  } catch (err) {
    console.error("[register] 회원가입 처리 중 에러:", err);

    let errorMessage = "서버 오류가 발생했습니다.";
    if (axios.isAxiosError(err) && err.response) {
      // 메인 백엔드가 보낸 에러 메시지 (e.g., "이미 존재하는 ID입니다.")
      errorMessage = err.response.data?.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }

  // 2. 성공 시
  // (참고: Server Action에서 redirect()는 try-catch 블록 *바깥*에서 호출되어야 함)
  redirect("/complete-signup"); 
  
  // redirect()가 호출되면 이 부분은 실행되지 않지만, 타입 일관성을 위해 추가
  return { success: true };
}

