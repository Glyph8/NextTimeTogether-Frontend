"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getMasterKey } from "@/utils/client/key-storage";
import {
  clearAuthCookies,
  refreshAccessToken,
} from "@/app/(auth)/login/refresh.action";
import { decryptStringFromBase64 } from "@/utils/client/crypto/crypto-storage";
import { clearClientAuthState } from "@/lib/clearClientAuthState";

/**
 * 앱 진입 시 1회 실행되는 세션 복원 훅.
 *  1) IndexedDB MasterKey 로드 → 없으면 비로그인 상태
 *  2) localStorage 암호화 userId 복호화 → MasterKey 유효성 검증
 *  3) httpOnly RT 쿠키로 새 AT 발급 → Zustand 에 저장
 * 어느 한 단계라도 실패하면 인증 상태를 모두 정리하고 /login 으로 이동.
 */
export const useAuthSession = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRestoring, setIsRestoring] = useState(true);
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    // 이미 AT 가 메모리에 있거나, 인증이 필요 없는 페이지면 복원 생략
    const isPublicPath =
      pathname === "/" ||
      pathname === "/login" ||
      pathname.includes("/register");

    if (accessToken || isPublicPath) {
      setIsRestoring(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const masterKey = await getMasterKey();
        if (!masterKey) {
          throw new Error("MasterKey 없음 — 로그인 필요");
        }

        const encryptedUserId = localStorage.getItem("encrypted_user_id");
        if (!encryptedUserId) {
          throw new Error("암호화된 userId 없음 — 로그인 필요");
        }

        // userId 복호화 자체는 결과를 사용하지 않지만, MasterKey 가 올바른지 검증하는 역할.
        // 실패 시 catch 로 빠져 세션 정리 + /login 이동.
        await decryptStringFromBase64(encryptedUserId, masterKey);

        const refreshResult = await refreshAccessToken();
        if (!refreshResult.success || !refreshResult.accessToken) {
          throw new Error(refreshResult.error || "AccessToken 갱신 실패");
        }

        setAccessToken(refreshResult.accessToken);
      } catch (err) {
        console.warn(`[AuthSession] 세션 복원 실패:`, err);
        try {
          await clearAuthCookies();
        } catch (cookieError) {
          console.warn("[AuthSession] 쿠키 정리 실패", cookieError);
        }
        await clearClientAuthState();
        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, [accessToken, setAccessToken, router, pathname]);

  return { isRestoring };
};
