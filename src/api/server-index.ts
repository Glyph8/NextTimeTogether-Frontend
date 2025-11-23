import { Api, BaseResponse } from "@/apis/generated/Api";
import { cookies } from "next/headers";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> extends BaseResponse {
  result?: T; // 제네릭 T 타입으로 result를
  //  재정의
}

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