import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAuthorizedRequest } from "@/lib/server/validateAccessToken";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

let cloudinaryConfigured = false;

/**
 * Cloudinary SDK 를 lazy 로 1회만 초기화한다.
 * 환경변수가 비어있으면 명시적으로 실패시켜 디버깅을 쉽게 한다.
 * (module-level 에서 config 를 호출하면 환경변수 누락이 silent 로 통과되어
 *  실제 업로드 시점에야 cryptic 에러로 드러나는 문제가 있었음)
 */
const ensureCloudinaryConfigured = (): boolean => {
  if (cloudinaryConfigured) return true;
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error(
      "[/api/upload] Cloudinary 환경변수 누락:",
      "CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET"
    );
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
  cloudinaryConfigured = true;
  return true;
};

export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { error: "Unauthorized or invalid token" },
      { status: 401 }
    );
  }

  if (!ensureCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Unsupported media type. Only images are allowed." },
      { status: 415 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Payload too large. Maximum size is 5MB." },
      { status: 413 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "next-time-together" }, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result as { secure_url: string });
        })
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (uploadError) {
    console.error("[/api/upload] Cloudinary 업로드 실패:", uploadError);
    return NextResponse.json(
      { error: "Internal Server Error during upload" },
      { status: 500 }
    );
  }
}
