"use server";

import { cookies } from "next/headers";
import axios from "axios"; // 메인 백엔드 통신용
import {
  getRefreshTokenFromSetCookie,
  IS_PRODUCTION,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/tokenCookie";

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
    const refreshToken = getRefreshTokenFromSetCookie(setCookieHeader);
    if (!refreshToken) {
      return { error: "메인 백엔드에서 RefreshToken을 받지 못했습니다." };
    }

    const cookieStore = await cookies();
    // RefreshToken만 httpOnly 쿠키에 저장. AccessToken은 메모리(Zustand)로만 전달.
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
    });

    return { success: true, accessToken: accessToken };
  } catch (err) {
    console.error("[login] 백엔드 인증 실패:", err);
    if (axios.isAxiosError(err) && err.response) {
      return {
        error:
          err.response.data.message || "아이디 또는 비밀번호가 잘못되었습니다.",
      };
    }
    return { error: "로그인 중 서버 오류가 발생했습니다." };
  }
}
