type LookupErrorLike = {
  response?: {
    status?: number;
    data?: {
      code?: string | number;
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
      data: {
        code:
          typeof data?.code === "string" || typeof data?.code === "number"
            ? data.code
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
