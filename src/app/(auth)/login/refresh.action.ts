"use server";

import { cookies } from "next/headers";
import axios from "axios";
import {
  getRefreshTokenFromSetCookie,
  IS_PRODUCTION,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/tokenCookie";
import { clearAuthTokenCookies } from "@/lib/server/clearAuthTokenCookies";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface RefreshActionState {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export async function clearAuthCookies(): Promise<void> {
  await clearAuthTokenCookies();
}

/**
 * httpOnly 쿠키의 RefreshToken 을 사용해 새 AccessToken 을 발급받는다.
 * - 성공 시 새 AT 를 응답으로 반환 (쿠키에는 저장하지 않음 — 클라이언트 Zustand 단일 소스)
 * - RT 회전(rotation) 응답이 오면 쿠키 갱신
 * - 실패 시 RT 쿠키를 정리
 */
export async function refreshAccessToken(): Promise<RefreshActionState> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return { success: false, error: "No refresh token found." };
  }

  try {
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

    const { code, message } = response.data;
    const newAccessToken = response.headers["authorization"];
    const rotatedRefreshToken = getRefreshTokenFromSetCookie(
      response.headers["set-cookie"]
    );

    if (code === 200 && newAccessToken) {
      if (rotatedRefreshToken) {
        cookieStore.set("refresh_token", rotatedRefreshToken, {
          httpOnly: true,
          secure: IS_PRODUCTION,
          maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
          path: "/",
          sameSite: "lax",
        });
      }
      return { success: true, accessToken: newAccessToken };
    }

    console.warn(`[refreshAccessToken] 백엔드 갱신 거부: ${message}`);
    await clearAuthTokenCookies();
    return { success: false, error: message || "Backend refresh failed." };
  } catch (err) {
    console.error("[refreshAccessToken] 실패:", err);
    await clearAuthTokenCookies();

    const fallbackMessage = "Session expired. Please log in again.";
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error: err.response?.data?.message || fallbackMessage,
      };
    }
    return { success: false, error: fallbackMessage };
  }
}
