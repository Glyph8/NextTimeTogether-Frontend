"use client";

import { useAuthStore } from "@/store/auth.store";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다. 다시 로그인 해주세요.");
  }

  // 자체 Route Handler에만 요청하도록
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: accessToken,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data = await response.json();
  return data.url as string;
}
