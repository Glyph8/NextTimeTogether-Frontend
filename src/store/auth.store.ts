import { create } from 'zustand';

/**
 * 전역 인증 상태.
 * AccessToken 만 메모리(Zustand)에 보관. RefreshToken 은 httpOnly 쿠키 단일 소스.
 * userId 식별자는 화면별 요구사항이 달라 localStorage 의 hashed_user_id_for_manager 등으로 분리 관리한다.
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
