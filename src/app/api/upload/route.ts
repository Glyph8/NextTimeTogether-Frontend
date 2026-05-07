import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 제한

const isValidAccessToken = (token?: string): boolean => {
  if (!token) {
    console.warn("[/api/upload] Missing access token");
    return false;
  }

  try {
    const normalizedToken = token.replace(/^Bearer\s+/i, "");
    const parts = normalizedToken.split(".");
    if (parts.length !== 3) {
      console.warn("[/api/upload] Invalid token structure");
      return false;
    }

    const payloadPart = parts[1];
    if (!payloadPart) {
      console.warn("[/api/upload] Missing token payload");
      return false;
    }

    let payloadJson = "";
    try {
      payloadJson = Buffer.from(payloadPart, "base64url").toString("utf-8");
    } catch {
      console.warn("[/api/upload] Invalid token payload encoding");
      return false;
    }

    let payload: { exp?: number };
    try {
      payload = JSON.parse(payloadJson) as { exp?: number };
    } catch {
      console.warn("[/api/upload] Invalid token payload JSON");
      return false;
    }
    if (!payload.exp) {
      console.warn("[/api/upload] Missing token expiration");
      return false;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    console.warn("[/api/upload] Failed to parse token payload");
    return false;
  }
};

/**
 * 클라이언트(Zustand 메모리)가 Authorization 헤더로 전달한 AccessToken을 기준으로 인증을 검증한다.
 * AccessToken이 만료되었거나 형식이 잘못되었으면 401. 갱신은 클라이언트가 별도로 수행한다.
 */
const ensureAuthenticated = (request: NextRequest): boolean => {
  const headerToken = request.headers.get("authorization") ?? undefined;
  return isValidAccessToken(headerToken);
};

export async function POST(request: NextRequest) {
  if (!ensureAuthenticated(request)) {
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
