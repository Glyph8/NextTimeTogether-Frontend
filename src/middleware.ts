import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 매 요청마다 고유한 nonce 값 생성
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // 개발 중에 HMR 등 허용을 위한 예외처리
  const isDevelopment = process.env.NODE_ENV === "development";

  const scriptSrcPolicy = isDevelopment
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  // ✅ 개발 환경에서는 nonce 없이 unsafe-inline만 사용
  const styleSrcPolicy = `'self' 'unsafe-inline'`;

  // 통신 예외가 될 API URL, 추후 웹소켓 사용할 경우 추가 필요.
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const connectSrcPolicy = `'self' ${apiBaseUrl || ""}`.trim();

  // CSP 정책 모음
  const cspHeader = `
    default-src 'self';
    connect-src ${connectSrcPolicy};
   script-src ${scriptSrcPolicy};
    style-src ${styleSrcPolicy};
    img-src 'self' blob: data:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    upgrade-insecure-requests;
  `;

  // 요청 헤더에 CSP 및 nonce 설정 (Next.js가 읽을 수 있도록)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim()
  );

  // 응답 헤더에 CSP 적용
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 실제 브라우저로 헤더가 전송
  response.headers.set(
    "Content-Security-Policy",
    requestHeaders.get("Content-Security-Policy") || ""
  );
  response.headers.set("x-nonce", requestHeaders.get("x-nonce") || "");

  // 1. X-Content-Type-Options: MIME 스니핑 방지
  response.headers.set("X-Content-Type-Options", "nosniff");

  // 2. Referrer-Policy: Referer 정보 전송 제어 (민감 정보 유출 방지)
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 3. Permissions-Policy: 브라우저 기능(API) 접근 제어 (최소 권한 원칙)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  return response;
}

// 미들웨어 실행 경로 설정 - 매 요청마다 간섭하므로 최적화를 위해 검사 필요없는 경로는 생략.
export const config = {
  matcher: [
    /*
     * 모든 요청 경로와 일치시킵니다. 일부 경로 제외
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * 이런 정적 리소스는 HTML 문서가 아니므로 nonce가 필요없음.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
