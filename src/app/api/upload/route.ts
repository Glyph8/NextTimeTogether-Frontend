import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createServerApi } from "@/api/server-index";
import { refreshAccessToken } from "@/app/(auth)/login/refresh.action";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 제한

/**
 * 업로드 요청 인증을 확인하고, access token 만료 시 refresh 후 1회 재시도한다.
 * - true: 인증 확인 성공
 * - false: 인증 실패
 */
const verifyUploadAuthWithRefreshRetry = async () => {
  try {
    const api = await createServerApi();
    await api.auth.reissueToken1();
    return true;
  } catch {
    const refreshResult = await refreshAccessToken();
    if (!refreshResult.success || !refreshResult.accessToken) {
      return false;
    }

    try {
      const api = await createServerApi();
      await api.auth.reissueToken1();
      return true;
    } catch {
      return false;
    }
  }
};

export async function POST(request: NextRequest) {
  const isAuthorized = await verifyUploadAuthWithRefreshRetry();
  if (!isAuthorized) {
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
