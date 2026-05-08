import { cookies } from "next/headers";
import { IS_PRODUCTION } from "@/lib/tokenCookie";

export const clearAuthTokenCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("access_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
};
