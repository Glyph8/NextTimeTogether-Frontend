import { cookies } from "next/headers";
import { redis } from "./redis";

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
    sameSite: "lax",
  });
}

const SESSION_DURATION = 3600; // 1시간

export async function refreshSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  
  if (!sessionToken) return false;
  
  // Redis 세션 존재 확인
  const exists = await redis.exists(`session:${sessionToken}`);
  if (!exists) return false;
  
  // 세션 연장
  await redis.expire(`session:${sessionToken}`, SESSION_DURATION);
  
  // 쿠키도 갱신 (선택사항)
  cookieStore.set("session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION,
    path: "/",
    sameSite: "lax",
  });
  
  return true;
}