import { create } from 'zustand';

/**
 * 전역 인증 상태 인터페이스
 */
interface AuthState {
  accessToken: string | null;     // 메모리에 저장될 AccessToken
  userId: string | null;
  isAuthenticated: boolean;     // 인증 여부 (AT 유무로 파생)
  isLoading: boolean;           // (중요) 앱 로드 시 토큰 갱신 중인지 여부
  
  // 상태를 변경하는 액션
  setAccessToken: (token: string) => void;
  setUserId: (userId: string) => void;
  clearAccessToken: () => void;
  setIsLoading: (loading: boolean) => void;
}

/**
 * 전역 인증 스토어
 * isLoading을 true로 시작하여, 앱 로드 시 "조용한 새로고침"이 완료될 때까지
 * 로딩 상태를 유지하도록 합니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true, // <-- 앱 로드 시, 토큰 확인 전까지 로딩 상태
  
  /**
   * AccessToken을 스토어(메모리)에 저장합니다.
   * 인증 상태를 true로, 로딩 상태를 false로 변경합니다.
   */
  setAccessToken: (token) => set({ 
    accessToken: token, 
    isAuthenticated: true, 
    isLoading: false 
  }),

  setUserId: (userId) => set({
    userId: userId
  }),
  /**
   * 로그아웃 또는 세션 만료 시 토큰을 제거합니다.
   */
  clearAccessToken: () => set({ 
    accessToken: null, 
    userId: null,
    isAuthenticated: false, 
    isLoading: false 
  }),

  /**
   * 로딩 상태를 수동으로 설정합니다.
   */
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
