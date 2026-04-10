export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const getRefreshTokenFromSetCookie = (
  setCookieHeader: string | string[] | undefined
): string | null => {
  const refreshCookie = Array.isArray(setCookieHeader)
    ? setCookieHeader.find((cookie) => cookie.startsWith("refresh_token="))
    : setCookieHeader;

  if (!refreshCookie) {
    return null;
  }

  const tokenPair = refreshCookie.split(";")[0];
  const separatorIndex = tokenPair.indexOf("=");
  if (separatorIndex < 0) {
    return null;
  }

  const refreshToken = tokenPair.slice(separatorIndex + 1);
  return refreshToken.length > 0 ? refreshToken : null;
};
