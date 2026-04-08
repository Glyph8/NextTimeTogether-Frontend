import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import type { ReadableStream as NodeWebReadableStream } from "stream/web";

// 최대 파일 크기: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 필수 환경변수 존재 여부를 모듈 로드 시점에 검증
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// 환경변수가 모두 존재할 때만 Cloudinary SDK를 모듈 수준에서 설정
if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  // 환경변수 누락 시 503 반환 (모호한 500 대신 명확한 에러)
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error(
      "Cloudinary 환경변수가 설정되지 않았습니다. " +
        "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET 을 확인하세요."
    );
    return NextResponse.json(
      { error: "서버 설정 오류: 업로드 서비스를 사용할 수 없습니다." },
      { status: 503 }
    );
  }

  // Content-Length 헤더로 사전 차단 (파싱 비용 없이 조기 거절)
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null && Number(contentLength) > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "파일 크기가 5MB를 초과합니다." },
      { status: 413 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 파싱할 수 없습니다." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "file 필드가 없거나 올바른 파일이 아닙니다." },
      { status: 400 }
    );
  }

  // 파싱 후 파일 크기 재확인 (Content-Length 우회 방어)
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "파일 크기가 5MB를 초과합니다." },
      { status: 413 }
    );
  }

  try {
    const secureUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary 업로드 실패"));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      // Web ReadableStream → Node.js Readable 변환 후 파이핑
      // 전체 파일을 한 번에 메모리에 올리지 않는 스트리밍 방식
      Readable.fromWeb(file.stream() as NodeWebReadableStream).pipe(
        uploadStream
      );
    });

    return NextResponse.json({ url: secureUrl });
  } catch (error) {
    console.error("Cloudinary 업로드 오류:", error);
    return NextResponse.json(
      { error: "이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
