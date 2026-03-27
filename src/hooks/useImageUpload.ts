"use client";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  // 자체 Route Handler에만 요청하도록
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data = await response.json();
  return data.url as string;
}