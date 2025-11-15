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
    console.error("❌ [BFF] refresh_token 쿠키가 없습니다.");
    return { success: false, error: "No refresh token found." };
  }

  try {
    // 2. 메인 백엔드의 /auth/refresh 엔드포인트로 요청
    console.log("📤 [BFF] 요청 URL:", `${MAIN_BACKEND_URL}/auth/refresh`);
    console.log("📤 [BFF] 요청 헤더:", {
      "refresh-token": refreshToken.substring(0, 50) + "...",
    });

    const response = await axios.post(
      `${MAIN_BACKEND_URL}/auth/refresh`,
      null,
      {
        headers: {
          "Refresh-token": refreshToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const { code, message } = response.data; // 4. 백엔드가 성공(code: 0)을 반환하고, 'result' (새 AccessToken)가 있는지 확인

    if (code === 200 && response.headers["authorization"]) {
      console.log("✅ [BFF] AccessToken 갱신 성공.", message); // 👇 'result' 값을 accessToken으로 매핑하여 클라이언트에 반환
      return { success: true, accessToken: response.headers["authorization"] };
    } else {
      // 백엔드가 갱신을 거부한 경우 (e.g., code !== 0)
      console.warn(`❌ [BFF] 백엔드가 갱신을 거부함: ${message}`);
      return { success: false, error: message || "Backend refresh failed." };
    }
  } catch (err) {
    console.error("❌ [BFF] Refresh token failed:", err);
    // axios 에러인지 확인하고 안전하게 처리
    if (axios.isAxiosError(err)) {
      // 에러 응답 상세 로깅
      if (err.response) {
        console.error("응답 상태:", err.response.status);
        console.error("응답 데이터:", err.response.data);
        console.error("응답 헤더:", err.response.headers);
      }

      // 400/401 에러 상세 분석
      if (err.response?.status === 400) {
        console.error(
          "⚠️ 400 에러: 백엔드가 토큰으로 사용자를 찾지 못했습니다."
        );
        console.error("⚠️ 확인사항:");
        console.error("   1. 토큰이 올바른 환경(dev/prod)에서 발급되었는지");
        console.error("   2. 로그인 시 받은 토큰과 동일한지");
        console.error("   3. 쿠키 도메인이 올바른지");
      } else if (err.response?.status === 401) {
        console.error("⚠️ 401 에러: 토큰 형식이나 서명이 유효하지 않습니다.");
        console.error("⚠️ Bearer 접두사를 제거하고 다시 시도하세요.");
      }

      // Refresh가 실패하면 쿠키를 삭제합니다.
      cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "Session expired. Please log in again.",
      };
    }
    // Refresh가 실패하면 (e.g., 만료, 유효하지 않음) 쿠키를 삭제합니다.
    cookieStore.set("refresh_token", "", { maxAge: 0, path: "/" });
    return { success: false, error: "Session expired. Please log in again." };
  }
}
