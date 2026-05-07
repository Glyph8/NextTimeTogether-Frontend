import { create } from 'zustand';

/**
 * 전역 인증 상태.
 * - AccessToken: Zustand 메모리 단일 소스. RefreshToken 은 httpOnly 쿠키 단일 소스.
 * - 사용자 식별자(hashedUserId): AT 의 sub 클레임에서 추출 (src/lib/currentUser.ts).
 *   별도 localStorage 키를 두지 않으므로 store 도 식별자 필드를 보유하지 않는다.
 */
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // 앱 로드 시 silent refresh 진행 여부

  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearAccessToken: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
