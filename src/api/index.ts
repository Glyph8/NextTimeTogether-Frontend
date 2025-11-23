import { Api} from "@/apis/generated/Api";
import { useAuthStore } from "@/store/auth.store";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** 스웨거 안맞는 타입들 직접 처리하기 */
export interface BackendResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const clientBaseApi = new Api({
  baseURL: MAIN_BACKEND_URL,
  securityWorker: () => {
    // const token = localStorage.getItem("access_token");
     // 2. localStorage 대신 Zustand의 .getState()로 토큰을 직접 읽습니다.
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.warn("No access token found in Zustand store.");
      return {
        headers: {}, // 헤더 없이 요청
      };
    }
    return {
      headers: {
        Authorization: token,
      },
    };
  },
  secure: true, // security가 필요한 엔드포인트에 자동 적용
});
