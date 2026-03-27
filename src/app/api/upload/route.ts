// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// 서버 사이드에서만 실행 — API 키가 클라이언트 번들에 포함되지 않음
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  // 인증 확인 (access_token 쿠키 사용)
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // File → ArrayBuffer → Buffer 변환
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Cloudinary에 업로드 (서버 사이드)
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "next-time-together" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result as { secure_url: string });
      }
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}