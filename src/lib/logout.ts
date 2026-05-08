"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthTokenCookies } from "@/lib/server/clearAuthTokenCookies";

export async function logout() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await clearAuthTokenCookies();
  }

  redirect("/login");
}
