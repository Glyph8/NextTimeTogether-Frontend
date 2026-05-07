/**
 * Route Handler 에서 Authorization 헤더로 받은 AccessToken 의 형식·만료를 검증한다.
 * - 서명 검증은 백엔드 책임이며, 여기서는 (1) 구조가 JWT 인지 (2) exp 가 미래인지만 본다.
 * - 정상이면 true, 누락/만료/구조 이상이면 false.
 */
export const isValidAccessToken = (token?: string | null): boolean => {
  if (!token) return false;

  try {
    const normalized = token.replace(/^Bearer\s+/i, "");
    const parts = normalized.split(".");
    if (parts.length !== 3) return false;

    const payloadPart = parts[1];
    if (!payloadPart) return false;

    let payloadJson = "";
    try {
      payloadJson = Buffer.from(payloadPart, "base64url").toString("utf-8");
    } catch {
      return false;
    }

    let payload: { exp?: number };
    try {
      payload = JSON.parse(payloadJson) as { exp?: number };
    } catch {
      return false;
    }

    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/** Request 객체에서 Authorization 헤더의 AT 를 검증한다. */
export const isAuthorizedRequest = (request: Request): boolean => {
  const headerToken = request.headers.get("authorization") ?? undefined;
  return isValidAccessToken(headerToken);
};
