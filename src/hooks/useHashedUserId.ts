"use client";

import { useEffect, useState } from "react";
import { getHashedUserId } from "@/utils/client/key-storage";

/**
 * [보안] masterKey로부터 파생되어 IndexedDB에 저장된 hashedUserId를
 * 비동기로 읽어 React 상태로 반환합니다.
 *
 * localStorage 평문 저장 대신 IndexedDB를 사용해 XSS 노출 범위를 줄입니다.
 */
export const useHashedUserId = () => {
  const [hashedUserId, setHashedUserId] = useState<string | null>(null);
  const [isLoadingHashedId, setIsLoadingHashedId] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getHashedUserId()
      .then((value) => {
        if (!cancelled) setHashedUserId(value);
      })
      .catch(() => {
        if (!cancelled) setHashedUserId(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingHashedId(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { hashedUserId, isLoadingHashedId };
};
