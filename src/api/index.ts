import { Api, BaseResponse } from "@/apis/generated/Api";
import { useAuthStore } from "@/store/auth.store";
import { cookies } from "next/headers";

export interface ApiResponse<T> extends BaseResponse {
  result?: T; // 제네릭 T 타입으로 result를 재정의
}

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export async function createServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  if (!token) throw new Error("serverAPI에서 쿠키의 엑세스 토큰 not found");
  
  return new Api({
    baseURL: MAIN_BACKEND_URL,
    securityWorker: () => ({
      headers: { Authorization: token }
    }),
    secure: true,
  });
}

// const baseApi = new Api({
//     // baseURL, securityWorker 등은 이제 axiosInstance가 모두 처리
//     customAxios: axiosInstance,
// });
// import axiosInstance from "@/api/axiosInstance";

// baseURL: "http://43.202.154.29:8083",

// const baseApi = new Api({
//   baseURL: "https://meetnow.duckdns.org",
// });
