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
      { 
        refreshToken: refreshToken 
        // 백엔드 구현에 따라 body가 아닌 cookie를 직접 읽을 수도 있음
      } 
    );

    // 3. 새 AccessToken 수신
    const { accessToken } = response.data;
    if (!accessToken) {
      return { success: false, error: "Invalid refresh response from backend." };
    }
    
    console.log("✅ [BFF] AccessToken 갱신 성공.");
    return { success: true, accessToken: accessToken };

  } catch (err) {
    console.error("❌ [BFF] Refresh token failed:", err);
    // Refresh가 실패하면 (e.g., 만료, 유효하지 않음) 쿠키를 삭제합니다.
    cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });
    return { success: false, error: "Session expired. Please log in again." };
  }
}
