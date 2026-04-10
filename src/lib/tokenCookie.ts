export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const getRefreshTokenFromSetCookie = (
  setCookieHeader: string | string[] | undefined
): string | null => {
  if (!setCookieHeader) return null;

  const parseCookiePair = (cookie: string): { name: string; value: string } | null => {
    const firstPair = cookie.split(";")[0]?.trim();
    if (!firstPair) return null;

    const separatorIndex = firstPair.indexOf("=");
    if (separatorIndex <= 0) return null;

    const name = firstPair.slice(0, separatorIndex).trim();
    const value = firstPair.slice(separatorIndex + 1).trim();
    if (!name || !value) return null;

    return { name, value };
  };

  if (Array.isArray(setCookieHeader)) {
    for (const cookie of setCookieHeader) {
      const parsed = parseCookiePair(cookie);
      if (parsed?.name === "refresh_token") {
        return parsed.value;
      }
    }
    return null;
  }

  // string 케이스: 단일 쿠키/콤마 결합 문자열 모두에서 refresh_token만 직접 탐색
  const match = setCookieHeader.match(/(?:^|,\s*)refresh_token=([^;,\s][^;]*)/);
  if (!match?.[1]) return null;

  const refreshToken = match[1].trim();
  return refreshToken.length > 0 ? refreshToken : null;
};
