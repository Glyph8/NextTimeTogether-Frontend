"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { refreshAccessToken } from "@/app/(auth)/login/refresh.action";

/**
 * 이 컴포넌트는 앱 로드 시 단 한 번 실행되어,
 * httpOnly 쿠키(RefreshToken)를 기반으로
 * Zustand 스토어(AccessToken)의 상태를 초기화(복원)합니다.
 */
export function AuthInitializer() {
  const { accessToken, setAccessToken, clearAccessToken, setIsLoading } = useAuthStore();
  
  // 여러 번 실행되는 것을 방지하기 위한 Ref
  const didInitialize = useRef(false);

  useEffect(() => {
    // StrictMode 등에서 두 번 실행되는 것을 방지
    if (didInitialize.current) return;
    didInitialize.current = true; 

    const initializeAuth = async () => {

      // TODO : 현재 리프레쉬 API가 동작하지 않음으로. localSTorage로 대체
      
      // 1. Zustand(메모리)에 이미 AccessToken이 있는지 확인
      // (e.g., 로그인 직후 페이지 이동 시)
      if (accessToken) {
        console.log("이미 엑세스 토큰이 있음 : ", accessToken)
        setIsLoading(false); // 이미 로드됨
        return;
      }

      try {
        // 2. 메모리에 토큰이 없으면, "조용한 새로고침" 시도
        const result = await refreshAccessToken();

        if (result.success && result.accessToken) {
          // 3. 성공 시: 새 AccessToken을 Zustand에 저장 (로그인 상태 복원)
          console.log("리프레쉬 토큰으로 재발급 성공")
          setAccessToken(result.accessToken);
        } else {
          // 4. 실패 시: 유효한 RefreshToken이 없음 (로그아웃 상태)
          console.log("리프레쉬 토큰으로 재발급 실패")
          clearAccessToken();
        }
      } catch (err) {
        // 5. 에러 시: 로그아웃 상태로 확정
        console.error("Auth initialization failed:", err);
        clearAccessToken();
      }
    };

    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의도적으로 앱 로드 시 *단 한 번*만 실행합니다.

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
}
