"use server";

import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  
  if (sessionToken) {
    // Redis에서 세션 삭제
    await redis.del(`session:${sessionToken}`);
    
    // 쿠키 삭제
    cookieStore.delete("session-token");
  }
  
  redirect("/login");
}