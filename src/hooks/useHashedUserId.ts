"use client";

import { useEffect, useRef, useState } from "react";
import { getHashedUserId } from "@/utils/client/key-storage";

/**
 * [보안] masterKey로부터 파생되어 IndexedDB에 저장된 hashedUserId를
 * 비동기로 읽어 React 상태로 반환합니다.
 *
 * localStorage 평문 저장 대신 IndexedDB를 사용해 XSS 노출 범위를 줄입니다.
 * 탭이 다시 활성화될 때 재조회하여 다른 탭의 로그아웃/로그인을 반영합니다.
 * 최초 로드 이후 재조회는 isLoadingHashedId를 변경하지 않아 UI 깜빡임을 방지합니다.
 */
export const useHashedUserId = () => {
  const [hashedUserId, setHashedUserId] = useState<string | null>(null);
  const [isLoadingHashedId, setIsLoadingHashedId] = useState(true);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchHashedUserId = async () => {
      try {
        const value = await getHashedUserId();
        if (cancelled) return;
        if (value !== hashedUserId) {
          setHashedUserId(value);
        }
      } catch {
        if (!cancelled) setHashedUserId(null);
      } finally {
        if (!cancelled && !initialLoadDone.current) {
          initialLoadDone.current = true;
          setIsLoadingHashedId(false);
        }
      }
    };

    fetchHashedUserId();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchHashedUserId();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hashedUserId, isLoadingHashedId };
};
