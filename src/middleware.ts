import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. 매 요청마다 고유한 nonce 값 생성
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 개발 중에 HMR 등 허용을 위한 예외처리
  const isDevelopment = process.env.NODE_ENV === "development";
  console.log('🔍 Environment:', process.env.NODE_ENV);
  console.log('🔍 isDevelopment:', isDevelopment);

  const scriptSrcPolicy = isDevelopment
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  // ✅ 개발 환경에서는 nonce 없이 unsafe-inline만 사용
  const styleSrcPolicy = isDevelopment
    ? `'self' 'unsafe-inline'`
    : `'self' 'nonce-${nonce}'`;
    
  // 2. CSP 정책 문자열 정의
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrcPolicy}; 
    style-src ${styleSrcPolicy};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // 3. 요청 헤더에 CSP 및 nonce 설정 (Next.js가 읽을 수 있도록)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    cspHeader.replace(/\s{2,}/g, " ").trim()
  );

  // 4. 응답 헤더에 CSP 적용
  // response.headers.set(...)을 사용해야 실제 브라우저로 헤더가 전송됩니다.
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    requestHeaders.get("Content-Security-Policy") || ""
  );
  response.headers.set("x-nonce", requestHeaders.get("x-nonce") || "");

  return response;
}

// 5. 미들웨어 실행 경로 설정 (성능 최적화) 매 요청마다 간섭하므로 검사 필요없는 경로는 생략.
export const config = {
  matcher: [
    /*
     * 모든 요청 경로와 일치시킵니다. 단, 다음 경로는 제외합니다:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * 이런 정적 리소스는 HTML 문서가 아니므로 nonce가 필요 없습니다.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
