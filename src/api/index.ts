import { Api } from "@/apis/generated/Api";
import { useAuthStore } from "@/store/auth.store";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** 스웨거 안맞는 타입들 직접 처리하기 */
export interface BackendResponse<T> {
  code: number;
  message: string;
  result: T;
}

/**
 * API catch 블록용 공통 에러 핸들러.
 * 에러를 로깅한 뒤 그대로 re-throw한다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any): never => {
  if (error.response) {
    console.error("API Error:", error.response.status, error.response.data);
  } else if (error.request) {
    console.error("API No Response:", error.request);
  } else {
    console.error("API Error:", error.message);
  }
  throw error;
};

export const clientBaseApi = new Api({
  baseURL: MAIN_BACKEND_URL,
  securityWorker: () => {
    // Zustand의 .getState()로 토큰
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.warn("No access token found in Zustand store.");
      return { headers: {} };
    }
    return { headers: { Authorization: token } };
  },
  secure: true, // security가 필요한 엔드포인트에 자동 적용
});
