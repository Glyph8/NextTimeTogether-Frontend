import { Api } from "@/apis/generated/Api";
import { useAuthStore } from "@/store/auth.store";
import { refreshAccessToken } from "@/app/(auth)/login/refresh.action";
import { clearClientAuthState } from "@/lib/clearClientAuthState";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const MAIN_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** 스웨거 안맞는 타입들 직접 처리하기 */
export interface BackendResponse<T> {
  code: number;
  message: string;
  result: T;
}

type ApiErrorLike = {
  response?: {
    status?: number;
    data?: unknown;
  };
  request?: unknown;
  message?: string;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isApiErrorLike = (error: unknown): error is ApiErrorLike => {
  if (!isObject(error)) {
    return false;
  }

  const { response, request, message } = error;

  const hasValidResponse =
    response === undefined ||
    (isObject(response) &&
      ("status" in response ? typeof response.status === "number" || response.status === undefined : true) &&
      ("data" in response ? true : true));

  const hasValidMessage = message === undefined || typeof message === "string";

  return hasValidResponse && hasValidMessage && ("request" in error ? true : request === undefined);
};

/**
 * API catch 블록용 공통 에러 핸들러.
 */
export const handleApiError = (error: unknown): never => {
  if (isApiErrorLike(error) && error.response) {
    console.error("API Error:", error.response.status, error.response.data);
  } else if (isApiErrorLike(error) && error.request) {
    console.error("API No Response:", error.request);
  } else if (error instanceof Error) {
    console.error("API Error:", error.message);
  } else {
    console.error("API Error:", error);
  }
  throw error;
};

export const clientBaseApi = new Api({
  baseURL: MAIN_BACKEND_URL,
  securityWorker: () => {
    // 매 요청 직전에 Zustand 메모리에서 최신 AccessToken 을 읽어 헤더 부착.
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      return { headers: {} };
    }
    return { headers: { Authorization: token } };
  },
  secure: true,
});

/* -----------------------------------------------------------------
 * 401 자동 refresh 인터셉터 (single-flight + retry-once)
 *
 * 동시에 여러 요청이 401을 받아도 refreshAccessToken 은 단 한 번만 호출되도록
 * Promise 를 공유한다(single-flight). 모든 요청은 같은 Promise 의 결과를 기다린 뒤
 * 새 토큰으로 원 요청을 재시도한다. 재시도가 또 401 이면 무한루프 방지를 위해
 * 한 번만 시도하고, 실패 시 클라이언트 인증 상태를 정리하고 /login 으로 이동한다.
 * ----------------------------------------------------------------- */

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let inflightRefresh: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
  try {
    const result = await refreshAccessToken();
    if (!result.success || !result.accessToken) {
      return null;
    }
    useAuthStore.getState().setAccessToken(result.accessToken);
    return result.accessToken;
  } catch {
    return null;
  }
};

const handleAuthFailure = async () => {
  try {
    await clearClientAuthState();
  } catch (cleanupError) {
    console.warn("[Interceptor] 인증 상태 정리 실패", cleanupError);
  }
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

clientBaseApi.instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableConfig | undefined;

    // 401 이 아니거나, config 가 없거나, 이미 한 번 재시도한 요청이면 그대로 throw
    if (status !== 401 || !originalRequest || originalRequest._retried) {
      throw error;
    }

    originalRequest._retried = true;

    // 동시 다발 401 → 같은 refresh Promise 를 공유
    inflightRefresh ??= performRefresh().finally(() => {
      inflightRefresh = null;
    });

    const newToken = await inflightRefresh;

    if (!newToken) {
      await handleAuthFailure();
      throw error;
    }

    // 새 토큰으로 원 요청 재시도
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = newToken;
    return clientBaseApi.instance.request(originalRequest);
  }
);
