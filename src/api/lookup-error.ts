type LookupErrorLike = {
  response?: {
    status?: number;
    headers?: Record<string, unknown>;
    data?: {
      code?: string | number;
      requestId?: string;
      request_id?: string;
      traceId?: string;
      trace_id?: string;
      result?: {
        requestId?: string;
        request_id?: string;
        traceId?: string;
        trace_id?: string;
      };
    };
  };
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asLookupError = (error: unknown): LookupErrorLike | null => {
  if (!isObject(error)) return null;

  const response = isObject(error.response) ? error.response : undefined;
  const data = response && isObject(response.data) ? response.data : undefined;

  return {
    response: {
      status: typeof response?.status === "number" ? response.status : undefined,
      headers: isObject(response?.headers)
        ? (response.headers as Record<string, unknown>)
        : undefined,
      data: {
        code:
          typeof data?.code === "string" || typeof data?.code === "number"
            ? data.code
            : undefined,
        requestId: typeof data?.requestId === "string" ? data.requestId : undefined,
        request_id: typeof data?.request_id === "string" ? data.request_id : undefined,
        traceId: typeof data?.traceId === "string" ? data.traceId : undefined,
        trace_id: typeof data?.trace_id === "string" ? data.trace_id : undefined,
        result: isObject(data?.result)
          ? {
              requestId:
                typeof data.result.requestId === "string"
                  ? data.result.requestId
                  : undefined,
              request_id:
                typeof data.result.request_id === "string"
                  ? data.result.request_id
                  : undefined,
              traceId:
                typeof data.result.traceId === "string"
                  ? data.result.traceId
                  : undefined,
              trace_id:
                typeof data.result.trace_id === "string"
                  ? data.result.trace_id
                  : undefined,
            }
          : undefined,
      },
    },
  };
};

export type LookupErrorType =
  | "INVALID_LOOKUP"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER"
  | "UNKNOWN";

type LookupMessageOverride = Partial<
  Record<Exclude<LookupErrorType, "UNKNOWN">, string>
>;

export const getLookupHttpStatus = (error: unknown): number | undefined => {
  return asLookupError(error)?.response?.status;
};

export const getLookupServerCode = (error: unknown): string | undefined => {
  const code = asLookupError(error)?.response?.data?.code;
  if (typeof code === "string") return code;
  if (typeof code === "number") return String(code);
  return undefined;
};

const pickStringHeader = (
  headers: Record<string, unknown> | undefined,
  candidates: string[]
): string | undefined => {
  if (!headers) return undefined;

  for (const [rawKey, rawValue] of Object.entries(headers)) {
    const key = rawKey.toLowerCase();
    if (!candidates.includes(key)) continue;

    if (typeof rawValue === "string" && rawValue.trim()) {
      return rawValue.trim();
    }

    if (Array.isArray(rawValue) && rawValue.length > 0) {
      const first = rawValue[0];
      if (typeof first === "string" && first.trim()) {
        return first.trim();
      }
    }
  }

  return undefined;
};

export const getLookupRequestId = (error: unknown): string | undefined => {
  const lookupError = asLookupError(error);
  if (!lookupError) return undefined;

  const fromHeaders = pickStringHeader(lookupError.response?.headers, [
    "x-request-id",
    "x-correlation-id",
    "x-trace-id",
    "request-id",
    "trace-id",
  ]);
  if (fromHeaders) return fromHeaders;

  const data = lookupError.response?.data;
  return (
    data?.requestId ??
    data?.request_id ??
    data?.traceId ??
    data?.trace_id ??
    data?.result?.requestId ??
    data?.result?.request_id ??
    data?.result?.traceId ??
    data?.result?.trace_id
  );
};

export const getLookupErrorType = (error: unknown): LookupErrorType => {
  const status = getLookupHttpStatus(error);

  if (status === 400) return "INVALID_LOOKUP";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (typeof status === "number" && status >= 500) return "SERVER";
  return "UNKNOWN";
};

export const shouldAllowLookupFallback = (error: unknown): boolean => {
  const serverCode = getLookupServerCode(error)?.trim().toUpperCase();
  if (!serverCode) {
    return false;
  }

  return (
    serverCode === "INVALID_LOOKUP" ||
    serverCode === "LOOKUP_INVALID_FORMAT" ||
    serverCode === "NOT_FOUND" ||
    serverCode === "LOOKUP_NOT_FOUND" ||
    serverCode === "CONFLICT" ||
    serverCode === "LOOKUP_CONFLICT"
  );
};

export const getLookupUserMessage = (
  error: unknown,
  fallback: string,
  overrides?: LookupMessageOverride
): string => {
  const type = getLookupErrorType(error);

  if (type === "INVALID_LOOKUP") {
    return (
      overrides?.INVALID_LOOKUP ??
      "Lookup 형식이 올바르지 않습니다. 다시 시도해주세요."
    );
  }
  if (type === "FORBIDDEN") {
    return overrides?.FORBIDDEN ?? "요청 권한이 없습니다.";
  }
  if (type === "NOT_FOUND") {
    return (
      overrides?.NOT_FOUND ??
      "대상을 찾을 수 없습니다. 다시 동기화한 후 시도해주세요."
    );
  }
  if (type === "CONFLICT") {
    return (
      overrides?.CONFLICT ??
      "요청 충돌이 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
  if (type === "SERVER") {
    return (
      overrides?.SERVER ??
      "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
  return fallback;
};
