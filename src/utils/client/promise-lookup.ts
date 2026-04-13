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
    throw new Error("lookupId input values must not be empty.");
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error("lookupVersion must be an integer greater than 0.");
  }

  const payload =
    version === PROMISE_LOOKUP_VERSION
      ? normalizedUserId
      : `v${version}:${normalizedUserId}`;

  return hmacSha256Hex(payload, normalizedIndexKey);
}

export function getLookupSourceFromStorage(): { userId: string; indexKey: string } {
  if (typeof window === "undefined") {
    throw new Error("lookup source can only be read in browser environments.");
  }

  const userId = localStorage.getItem(LOOKUP_USER_ID_KEY)?.trim();
  const rawIndexKey = localStorage.getItem(LOOKUP_INDEX_KEY)?.trim();
  const indexKey = rawIndexKey && rawIndexKey.length > 0 ? rawIndexKey : userId;

  if (!userId || !indexKey) {
    throw new Error("missing user identifier or lookup index key.");
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
