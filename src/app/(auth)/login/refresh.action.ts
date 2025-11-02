"use server";

import { cookies } from "next/headers";
import axios from "axios";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 토큰 갱신 액션의 반환 타입
 */
export interface RefreshActionState {
  success: boolean;
  accessToken?: string;
  error?: string;
}

/**
 * httpOnly 쿠키의 RefreshToken을 사용해 새 AccessToken을 발급받는 서버 액션
 */
export async function refreshAccessToken(): Promise<RefreshActionState> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // 1. httpOnly 쿠키에 RefreshToken이 있는지 확인
  if (!refreshToken) {
    return { success: false, error: "No refresh token found." };
  }

  try {
    // 2. 메인 백엔드의 /auth/refresh 엔드포인트로 요청
    const response = await axios.post(
      `${MAIN_BACKEND_URL}/auth/refresh`,
      null,
      {
        headers: {
          // TODO : 서버 측에 리프레쉬 로직 문의
          // "refresh-token": refreshToken,
          "refresh-token": `Bearer ${refreshToken}`,
        },
      }
    );

    const { code, result, message } = response.data; // 4. 백엔드가 성공(code: 0)을 반환하고, 'result' (새 AccessToken)가 있는지 확인

    if (code === 0 && result) {
      console.log("✅ [BFF] AccessToken 갱신 성공."); // 👇 'result' 값을 accessToken으로 매핑하여 클라이언트에 반환
      return { success: true, accessToken: result };
    } else {
      // 백엔드가 갱신을 거부한 경우 (e.g., code !== 0)
      console.warn(`❌ [BFF] 백엔드가 갱신을 거부함: ${message}`);
      return { success: false, error: message || "Backend refresh failed." };
    }

  } catch (err) {
    console.error("❌ [BFF] Refresh token failed:", err);
    // Refresh가 실패하면 (e.g., 만료, 유효하지 않음) 쿠키를 삭제합니다.
    cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });
    return { success: false, error: "Session expired. Please log in again." };
  }
}
