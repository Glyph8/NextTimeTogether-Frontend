"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthTokenCookies } from "@/lib/server/clearAuthTokenCookies";

export async function logout() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken || refreshToken) {
    await clearAuthTokenCookies();

    // TODO : 추후 localStorage의 access_token 제거 필요. 이건 로그아웃 버튼 클라이언트 컴포넌트에서 진행.
  }
  
  redirect("/login");
}
