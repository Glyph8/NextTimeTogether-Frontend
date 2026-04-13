import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/app/(auth)/login/refresh.action";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 제한

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    const refreshResult = await refreshAccessToken();
    if (!refreshResult.success || !refreshResult.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized or invalid token" },
        { status: 401 }
      );
    }
    accessToken = refreshResult.accessToken;
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized or invalid token" },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // 1. 파일 MIME 타입 검증
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Unsupported media type. Only images are allowed." }, { status: 415 });
  }

  // 2. 파일 사이즈 제한 검증
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Payload too large. Maximum size is 5MB." }, { status: 413 });
  }

  // File → ArrayBuffer → Buffer 변환 (제한된 사이즈 내에서의 버퍼링)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
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
  } catch (uploadError) {
    console.error("Cloudinary upload failed:", uploadError);
    return NextResponse.json({ error: "Internal Server Error during upload" }, { status: 500 });
  }
}
