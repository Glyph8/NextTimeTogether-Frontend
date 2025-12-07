"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { getMasterKey } from "@/utils/client/key-storage";
import { refreshAccessToken } from "@/app/(auth)/login/refresh.action";
import { decryptStringFromBase64 } from "@/utils/client/crypto/crypto-storage";

/**
 * 앱 로드 시 세션을 복원/확인하는 훅
 * (Root Layout 등 앱의 진입점에서 1회 호출)
 */
export const useAuthSession = () => {
  const router = useRouter();
  const pathname = usePathname();
  // 세션 복원 중임을 알리는 로딩 상태 (e.g., 스플래시 스크린)
  const [isRestoring, setIsRestoring] = useState(true);
  const { accessToken, setAccessToken, userId, setUserId, clearAccessToken } = useAuthStore();
  
  useEffect(() => {
    // 1. 이미 메모리에 세션이 있거나, 로그인 페이지라면 복원 시도 안 함
    if ((accessToken && userId) || pathname === "/login" || pathname.includes("/register") || pathname === "/") {
      console.log("이미 세션이 있거나, 로그인이므로 userID 복원하지 않음. 현재 userId : ", userId);
      setIsRestoring(false);
      return;
    }

    const restoreSession = async () => {
      try {
        console.log("🔄 [AuthSession] 세션 복원 시도...");

        // 2. IndexedDB에서 MasterKey 가져오기
        const masterKey = await getMasterKey();
        if (!masterKey) {
          throw new Error(
            "MasterKey가 IndexedDB에 없습니다. 로그인이 필요합니다."
          );
        }
        console.log("✅ [AuthSession] MasterKey 로드 성공");

        // 3. localStorage에서 암호화된 userId 가져오기
        const encryptedUserId = localStorage.getItem("encrypted_user_id");
        if (!encryptedUserId) {
          throw new Error("암호화된 userId가 없습니다. 로그인이 필요합니다.");
        }

        // 4. MasterKey로 userId 복호화 (핵심 로직)
        const userId = await decryptStringFromBase64(
          encryptedUserId,
          masterKey
        );
        console.log("✅ [AuthSession] userId 복호화 성공");

        // 5. httpOnly RefreshToken으로 새 AccessToken 갱신 (서버 액션 호출)
        const refreshResult = await refreshAccessToken();
        if (!refreshResult.success || !refreshResult.accessToken) {
          throw new Error(refreshResult.error || "AccessToken 갱신 실패");
        }
        console.log("✅ [AuthSession] AccessToken 갱신 성공");

        // 6. 모든 정보가 복원되면 Zustand(메모리)에 저장
        setUserId(userId);
        setAccessToken(refreshResult.accessToken);

        console.log("🎉 [AuthSession] 세션 복원 완료");
      } catch (err) {
        console.warn(`[AuthSession] 세션 복원 실패: ${err}`);
        // 세션 복원에 실패하면 로그인 페이지로 (로그인 페이지 자체는 제외)
        clearAccessToken() // 사용자 데이터 날리기 
        localStorage.removeItem("encrypted_user_id"); // 실패한 데이터 정리
        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, [accessToken, setAccessToken, userId, setUserId, router, pathname, clearAccessToken]);

  return { isRestoring };
};