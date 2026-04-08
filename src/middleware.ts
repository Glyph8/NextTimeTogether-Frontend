import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 매 요청마다 고유한 nonce 값 생성
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // 개발 중에 HMR 등 허용을 위한 예외처리
  const isDevelopment = process.env.NODE_ENV === "development";

  // 통신 예외가 될 API URL, 추후 웹소켓 사용할 경우 추가 필요.
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Cloudinary 도메인 (이미지용)
  const cloudinaryDomain = "https://res.cloudinary.com";
  // Cloudinary 위젯 도메인 (스크립트/iframe용)
  const cloudinaryWidgetDomain = "https://upload-widget.cloudinary.com";
  // Cloudinary API 도메인 (이미지 업로드 요청용)
  const cloudinaryApiDomain = "https://api.cloudinary.com";

  // connect-src: API 서버 + Cloudinary 업로드 API
  const connectSrcPolicy = ["'self'", apiBaseUrl, cloudinaryApiDomain]
    .filter(Boolean)
    .join(" ");

  // style-src: CSS-in-JS 라이브러리 호환성을 위해 unsafe-inline 유지
  const styleSrcPolicy = `'self' 'unsafe-inline'`;

  // script-src:
  //   - 개발 환경: HMR(Hot Module Replacement), eval 기반 소스맵 허용을 위해 unsafe-inline/unsafe-eval 사용
  //   - 프로덕션 환경: nonce 기반 CSP 적용. unsafe-inline 제거로 XSS 인라인 스크립트 차단.
  //     nonce가 없는 인라인 스크립트는 차단되며, 허용 목록 도메인의 외부 스크립트는 nonce 없이 허용됨.
  //     (주의: 'strict-dynamic'을 추가하면 URL 허용 목록이 무시됨 → Cloudinary 위젯에 nonce 전달 필요)
  const scriptSrcPolicy = isDevelopment
    ? `'self' 'unsafe-inline' 'unsafe-eval' ${cloudinaryWidgetDomain}`
    : `'self' 'nonce-${nonce}' ${cloudinaryWidgetDomain}`;

  // CSP 정책 모음
  const cspHeader = `
    default-src 'self';
    connect-src ${connectSrcPolicy};
    script-src ${scriptSrcPolicy};
    style-src ${styleSrcPolicy};
    img-src 'self' blob: data: https://res.cloudinary.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    upgrade-insecure-requests;
  `;

  const cspValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  // 요청 헤더에 CSP 및 nonce 설정
  // x-nonce는 서버 컴포넌트(layout.tsx)에서 headers()로 읽기 위해 요청 헤더에 전달.
  // 응답 헤더에는 노출하지 않음 (브라우저 JS에서 nonce를 읽을 수 있는 경로 차단).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspValue);

  // 응답 헤더에 CSP 적용 (브라우저가 정책을 인식하도록 반드시 포함)
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspValue);

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
