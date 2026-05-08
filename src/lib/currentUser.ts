import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";

/**
 * 현재 사용자 식별자(hashedUserId)의 단일 진실 소스.
 *
 * 백엔드가 JWT 의 표준 `sub` 클레임에 hashedUserId 를 박아서 발급하므로,
 * 클라이언트는 AccessToken 만 단일 소스로 두고 거기서 식별자를 추출한다.
 * - localStorage 에 별도 식별자를 저장하지 않음 → XSS 표면 축소
 * - 토큰 만료 → 식별자 자동 invalid → 별도 동기화 코드 불필요
 * - 401 인터셉터로 AT 가 갱신되면 sub 도 자동 갱신
 *
 * AT 가 아직 채워지지 않은 시점(로그인 직후 ~ Zustand setAccessToken 직전,
 * 새로고침 ~ useAuthSession refresh 완료 직전)에는 null 을 반환하므로
 * 호출처는 isRestoring 로더 또는 명시적 null 체크로 보호해야 한다.
 */

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const normalized = token.replace(/^Bearer\s+/i, "");
    const parts = normalized.split(".");
    if (parts.length !== 3) return null;

    const payloadPart = parts[1];
    if (!payloadPart) return null;

    // JWT 는 base64url 인코딩 → atob 가 처리하는 base64 로 변환
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const payloadJson =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");

    return JSON.parse(payloadJson) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const extractSub = (token: string | null | undefined): string | null => {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const sub = payload.sub;
  return typeof sub === "string" && sub.length > 0 ? sub : null;
};

/**
 * 컴포넌트 외부(이벤트 핸들러, mutation, hooks 의 비반응 부분)에서 즉시
 * 현재 사용자 식별자를 가져온다. AT 가 없으면 null.
 */
export const getCurrentUserId = (): string | null => {
  const token = useAuthStore.getState().accessToken;
  return extractSub(token);
};

/**
 * 인증된 사용자만 호출하는 경로에서 사용. 식별자가 없으면 throw.
 * 호출처에서 try/catch 또는 상위 ErrorBoundary 가 잡도록 한다.
 */
export const requireCurrentUserId = (): string => {
  const id = getCurrentUserId();
  if (!id) {
    throw new Error("로그인이 필요합니다. (AccessToken 이 없거나 sub 클레임이 없음)");
  }
  return id;
};

/**
 * React 컴포넌트 함수 본문에서 사용. AT 가 변경되면 자동 리렌더.
 * Zustand selector 로 accessToken 만 구독하여 다른 상태 변경에는 영향받지 않음.
 */
export const useCurrentUserId = (): string | null => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useMemo(() => extractSub(accessToken), [accessToken]);
};
