export const PROMISE_LOOKUP_VERSION = 1;

const LOOKUP_USER_ID_KEY = "hashed_user_id_for_manager";
const LOOKUP_INDEX_KEY = "pseudo_id_index_key";

const normalizeUserId = (userId: string) => userId.trim().toLowerCase();
const normalizeIndexKey = (indexKey: string) => indexKey.trim();

const toHexString = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

async function hmacSha256Hex(payload: string, indexKey: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(indexKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return toHexString(signature);
}

export async function makeLookupId(
  userId: string,
  indexKey: string,
  version: number = PROMISE_LOOKUP_VERSION
): Promise<string> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedIndexKey = normalizeIndexKey(indexKey);

  if (!normalizedUserId || !normalizedIndexKey) {
    throw new Error("lookupId 생성 입력값이 비어있습니다.");
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error("lookupVersion은 1 이상의 정수여야 합니다.");
  }

  const payload =
    version === PROMISE_LOOKUP_VERSION
      ? normalizedUserId
      : `v${version}:${normalizedUserId}`;

  return hmacSha256Hex(payload, normalizedIndexKey);
}

export function getLookupSourceFromStorage(): { userId: string; indexKey: string } {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 lookup source를 조회할 수 있습니다.");
  }

  const userId = localStorage.getItem(LOOKUP_USER_ID_KEY)?.trim();
  const indexKey = localStorage.getItem(LOOKUP_INDEX_KEY)?.trim() || userId;

  if (!userId || !indexKey) {
    throw new Error("lookupId 생성에 필요한 사용자 식별값 또는 인덱스 키가 없습니다.");
  }

  return { userId, indexKey };
}

export async function resolveLookupContext(version: number = PROMISE_LOOKUP_VERSION) {
  const { userId, indexKey } = getLookupSourceFromStorage();
  const lookupId = await makeLookupId(userId, indexKey, version);

  return {
    lookupId,
    lookupVersion: version,
  };
}

export function shouldSendLegacyEncUserId(): boolean {
  return process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST !== "false";
}

export function maskLookupId(lookupId?: string): string {
  if (!lookupId) {
    return "";
  }

  if (lookupId.length <= 12) {
    return `${lookupId.slice(0, 4)}***`;
  }

  return `${lookupId.slice(0, 8)}...${lookupId.slice(-4)}`;
}
