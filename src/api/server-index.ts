import { Api, BaseResponse } from "@/apis/generated/Api";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> extends BaseResponse {
  result?: T;
}

/**
 * 서버 액션/라우트 핸들러용 Api 인스턴스 생성기.
 * AccessToken은 클라이언트(Zustand 메모리)에서 인자로 전달받는다.
 * (httpOnly 쿠키에는 RefreshToken만 저장되므로 서버는 AT를 보유하지 않음)
 */
export function createServerApi(accessToken: string) {
  if (!accessToken) {
    throw new Error("serverAPI 생성 실패: accessToken이 비어있습니다.");
  }

  return new Api({
    baseURL: MAIN_BACKEND_URL,
    securityWorker: () => ({
      headers: { Authorization: accessToken },
    }),
    secure: true,
  });
}
