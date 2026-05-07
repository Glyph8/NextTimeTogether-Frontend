import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 환경변수에 path가 포함되어 있어도 안전하게 origin만 추출.
 * CSP의 connect-src는 scheme://host:port까지만 매칭하므로 path가 섞이면 무효 정책이 된다.
 */
const getApiOrigin = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
};

export function proxy(request: NextRequest) {
  // 16바이트 무작위 → base64. UUID 문자열을 base64로 변환하던 방식보다 표준에 가깝고
  // 의도(고엔트로피 짧은 토큰)가 코드에서 그대로 드러난다.
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64");

  const isDevelopment = process.env.NODE_ENV === "development";
  const apiOrigin = getApiOrigin();

  // connect-src: 백엔드 API + (개발 한정) HMR WebSocket
  const connectSrc = [
    "'self'",
    apiOrigin,
    isDevelopment ? "ws:" : null,
    isDevelopment ? "wss:" : null,
  ]
    .filter(Boolean)
    .join(" ");

  // script-src:
  //   production = nonce + strict-dynamic 조합.
  //     - 'strict-dynamic'이 있으면 host-source('self', https: 등)는 자동 무시되고
  //       nonce가 부여된 스크립트가 동적으로 로드한 후속 스크립트만 신뢰된다.
  //     - 결과: 같은 origin에 attacker-controlled JS가 올라와도 실행 불가.
  //   development = HMR/eval 호환을 위해 unsafe-inline/unsafe-eval 허용.
  const scriptSrc = isDevelopment
    ? `'self' 'unsafe-inline' 'unsafe-eval'`
    : `'nonce-${nonce}' 'strict-dynamic'`;

  // style-src: Tailwind는 정적 CSS지만 Next.js가 라우트별 critical CSS를
  // <style>로 인라인 주입하므로 'unsafe-inline'을 의도적으로 유지한다.
  // (style-src는 strict-dynamic 미지원이라 nonce로 묶어도 운영 비용 대비 이득이 적음.)
  const styleSrc = `'self' 'unsafe-inline'`;

  const cspDirectives = [
    `default-src 'self'`,
    `connect-src ${connectSrc}`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `img-src 'self' blob: data: https://res.cloudinary.com`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `upgrade-insecure-requests`,
  ];

  const cspValue = cspDirectives.join("; ");

  // 서버 컴포넌트(layout.tsx)에서 headers()로 nonce를 읽기 위해 요청 헤더에 전달.
  // 응답 헤더에는 노출하지 않음 — 브라우저 JS에서 nonce를 읽을 수 있는 경로 차단.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // CSP는 응답 헤더에서만 브라우저가 해석한다.
  response.headers.set("Content-Security-Policy", cspValue);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * 정적 리소스(_next/static, _next/image, favicon)는 HTML 문서가 아니라
     * nonce 주입이 불필요하므로 제외하여 미들웨어 부하를 줄인다.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
