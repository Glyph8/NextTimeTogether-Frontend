"use server";

import { cookies } from "next/headers";
import axios from "axios"; // 메인 백엔드 통신용

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginActionState {
  error?: string | null;
  success?: string | boolean;
  accessToken?: string | null;
}

export async function login(formData: FormData): Promise<LoginActionState> {
  const hashedUserId = formData.get("hashedUserId") as string;
  const hashedPassword = formData.get("hashedPassword") as string;

  if (!hashedUserId || !hashedPassword) {
    return { error: "잘못된 요청입니다." };
  }

  try {
    // 1. (BFF -> 백엔드) E2EE '증명 값'을 메인 백엔드로 전달
    const response = await axios.post(
      `${MAIN_BACKEND_URL}/auth/login`, // 메인 백엔드의 로그인 엔드포인트
      {
        // 클라이언트에서 생성한 E2EE 증명 값
        userId:hashedUserId,
        password:hashedPassword,
      }
    ); // 2. (백엔드 -> BFF) 메인 백엔드가 토큰 발급

    const accessToken = response.headers["authorization"];
    const setCookieHeader = response.headers["set-cookie"];
    if (!accessToken || !setCookieHeader) {
      return { error: "메인 백엔드에서 토큰을 받지 못했습니다." };
    }
    const refreshToken = setCookieHeader[0].split(";")[0].split("=")[1];

    console.log(`✅ [BFF] 메인 백엔드 인증 성공. 토큰 프록시 시작.`);

    const cookieStore = await cookies(); // 3. (BFF -> Client) RefreshToken은 httpOnly 쿠키에 저장 //    (이 쿠키는 오직 /api/auth/refresh 같은 BFF 엔드포인트에서만 사용됨)
    
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일 (백엔드 설정과 일치시킬 것)
      path: "/", // /api/auth/refresh 경로로 제한하는 것이 더 안전할 수 있음
      sameSite: "lax",
    }); // 4. (BFF -> Client) AccessToken은 JSON 응답으로 클라이언트에 반환

    // TODO: 리프레쉬 로직 안정될 때 까지 임시사용
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/", 
      sameSite: "lax",
    }); 

    return { success: true, accessToken: accessToken };
  } catch (err) {
    // 메인 백엔드 통신 실패 (e.g., 401 Unauthenticated)
    console.error("BFF: 메인 백엔드 인증 실패:", err); // axios 에러 응답이 있다면, 해당 메시지를 반환
    if (axios.isAxiosError(err) && err.response) {
      return {
        error:
          err.response.data.message || "아이디 또는 비밀번호가 잘못되었습니다.",
      };
    }
    return { error: "로그인 중 서버 오류가 발생했습니다." };
  }
}

/**
 * [메인 백엔드 API 호출]
 * 신원 확인을 메인 백엔드에 위임합니다.
 */
// async function verifyCredentialsWithBackend(
//   hashedUserId: string,
//   hashedPassword: string
// ): Promise<{ success: boolean; userId?: string; message: string }> {
//   try {
//     // 1. BFF가 메인 백엔드(/auth/verify)로 인증 해시 값을 전송
//     const response = await axios.post(`${MAIN_BACKEND_URL}/auth/verify`, {
//       hashedUserId,
//       hashedPassword,
//     });

//     // 2. 메인 백엔드가 DB와 비교 후, 성공하면 '실제 user_id'를 반환
//     if (response.data.success) {
//       return { success: true, userId: response.data.userId, message: "OK" };
//     }
//     return { success: false, message: response.data.message };
//   } catch (error) {
//     // 메인 백엔드 통신 실패 또는 401 (Unauthenticated) 응답
//     console.error("메인 백엔드 인증 실패:", error);
//     return {
//       success: false,
//       message: "아이디 또는 비밀번호가 잘못되었습니다.",
//     };
//   }
// }

// export async function login(formData: FormData): Promise<LoginActionState> {
//   const hashedUserId = formData.get("hashedUserId") as string;
//   const hashedPassword = formData.get("hashedPassword") as string;

//   if (!hashedUserId || !hashedPassword) {
//     return { error: "잘못된 요청입니다." };
//   }

//   try {
//     // 1. (BFF -> 백엔드) 실제 신원 검증은 '메인 백엔드'에 위임
//     const verificationResult = await verifyCredentialsWithBackend(
//       hashedUserId,
//       hashedPassword
//     );

//     if (!verificationResult.success || !verificationResult.userId) {
//       return { error: verificationResult.message };
//     }
//     const userId = verificationResult.userId;

//     //   if (!verificationResult.success || !verificationResult.userId) {
//     //   return { error: verificationResult.message };
//     // }

//     console.log(`✅ [BFF] 메인 백엔드 신원 확인 완료: ${userId}`);

//     // 2. (BFF) 신원 확인 성공! 이제 BFF가 '세션'을 발급
//     const sessionToken = randomUUID();
//     const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7일

//     // 3. (BFF -> Redis) BFF의 Redis에 세션 저장 (토큰 -> 유저 ID)
//     await redis.set(`session:${sessionToken}`, userId, {
//       ex: SESSION_EXPIRATION_SECONDS,
//     });
//     console.log(`(BFF-Redis) 세션 저장: ${sessionToken} -> ${userId}`);

//     const cookieStore = await cookies();

//     // 4. (BFF -> Client) 클라이언트에 httpOnly 세션 쿠키 발급
//     cookieStore.set("session_token", sessionToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: SESSION_EXPIRATION_SECONDS,
//       path: "/",
//       sameSite: "lax",
//     });

//     return { success: "로그인에 성공했습니다." };
//   } catch (err) {
//     console.error("BFF 로그인 액션 처리 중 에러:", err);
//     return { error: "서버 오류가 발생했습니다." };
//   }
// }
