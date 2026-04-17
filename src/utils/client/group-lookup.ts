import { getLookupIndexKeyFromStorage } from "@/utils/client/promise-lookup";
import { resolveLookupSubjectFromStorage } from "@/utils/client/lookup-subject";

export const GROUP_LOOKUP_VERSION = 1;

const GROUP_LOOKUP_CACHE_KEY = "group_lookup_cache_v1";
const LOOKUP_ID_PATTERN = /^[0-9a-f]{64}$/;

interface GroupLookupCacheValue {
  userId: string;
  entries: Record<string, { lookupId: string; lookupVersion: number }>;
}

const normalizeUserId = (userId: string) => userId.trim().toLowerCase();
const normalizeGroupId = (groupId: string) => groupId.trim();
const normalizeIndexKey = (indexKey: string) => indexKey.trim();
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isValidLookupEntry = (
  value: unknown
): value is { lookupId: string; lookupVersion: number } =>
  isPlainObject(value) &&
  typeof value.lookupId === "string" &&
  LOOKUP_ID_PATTERN.test(value.lookupId) &&
  typeof value.lookupVersion === "number";

function readGroupLookupCache(): GroupLookupCacheValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(GROUP_LOOKUP_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed) || typeof parsed.userId !== "string") {
      return null;
    }

    if (!isPlainObject(parsed.entries)) {
      localStorage.removeItem(GROUP_LOOKUP_CACHE_KEY);
      return null;
    }

    const entries = Object.entries(parsed.entries);
    const sanitizedEntries: GroupLookupCacheValue["entries"] = {};
    for (const [groupId, entry] of entries) {
      if (typeof groupId === "string" && isValidLookupEntry(entry)) {
        sanitizedEntries[groupId] = entry;
      }
    }

    const sanitizedCache: GroupLookupCacheValue = {
      userId: parsed.userId,
      entries: sanitizedEntries,
    };
    const hasInvalidEntries = Object.keys(sanitizedEntries).length !== entries.length;
    if (hasInvalidEntries) {
      writeGroupLookupCache(sanitizedCache);
      return sanitizedCache;
    }

    return sanitizedCache;
  } catch {
    return null;
  }
}

function writeGroupLookupCache(value: GroupLookupCacheValue): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(GROUP_LOOKUP_CACHE_KEY, JSON.stringify(value));
  } catch (error) {
    console.warn("[GroupLookup] Failed to persist lookup cache.", error);
  }
}

async function makeHmacSha256Hex(payload: string, indexKey: string): Promise<string> {
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

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function ensureCacheForUser(userId: string): GroupLookupCacheValue {
  const current = readGroupLookupCache();
  if (!current || current.userId !== userId) {
    const next = { userId, entries: {} };
    writeGroupLookupCache(next);
    return next;
  }
  return current;
}

export async function makeGroupLookupId(
  userId: string,
  groupId: string,
  indexKey: string,
  version: number = GROUP_LOOKUP_VERSION
): Promise<string> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedGroupId = normalizeGroupId(groupId);
  const normalizedIndexKey = normalizeIndexKey(indexKey);

  if (!normalizedUserId || !normalizedGroupId || !normalizedIndexKey) {
    throw new Error("userId, groupId and indexKey must not be empty after normalization.");
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error("lookupVersion must be an integer greater than or equal to 1.");
  }

  const payload =
    version === GROUP_LOOKUP_VERSION
      ? `${normalizedUserId}:${normalizedGroupId}`
      : `v${version}:${normalizedUserId}:${normalizedGroupId}`;

  return makeHmacSha256Hex(payload, normalizedIndexKey);
}

export function shouldUseGroupLookup(): boolean {
  return process.env.NEXT_PUBLIC_GROUP_LOOKUP_ENABLED !== "false";
}

export function shouldSendLegacyEncGroupId(): boolean {
  return process.env.NEXT_PUBLIC_GROUP_LOOKUP_DUAL_REQUEST !== "false";
}

export interface GroupLookupRequestPayload {
  groupId: string;
  lookupId: string;
  lookupVersion: number;
  encGroupId?: string;
}

export function buildGroupLookupRequest(
  groupId: string,
  lookup: { lookupId: string; lookupVersion: number },
  encGroupId?: string
): GroupLookupRequestPayload {
  return {
    groupId,
    lookupId: lookup.lookupId,
    lookupVersion: lookup.lookupVersion,
    ...(encGroupId && shouldSendLegacyEncGroupId() ? { encGroupId } : {}),
  };
}

export function maskLookupId(lookupId?: string): string {
  if (!lookupId) return "";
  if (lookupId.length <= 12) return `${lookupId.slice(0, 4)}***`;
  return `${lookupId.slice(0, 8)}...${lookupId.slice(-4)}`;
}

export async function resolveGroupLookupContext(
  groupId: string,
  version: number = GROUP_LOOKUP_VERSION
) {
  if (typeof window === "undefined") {
    throw new Error("group lookup can only be resolved in browser environments.");
  }

  const userId = resolveLookupSubjectFromStorage().subjectId;

  const normalizedUserId = normalizeUserId(userId);
  const normalizedGroupId = normalizeGroupId(groupId);
  if (!normalizedGroupId) {
    throw new Error("groupId must not be empty for group lookup.");
  }

  const cache = ensureCacheForUser(normalizedUserId);
  const cached = cache.entries[normalizedGroupId];
  if (cached && cached.lookupVersion === version) {
    return cached;
  }

  const indexKey = getLookupIndexKeyFromStorage(userId);
  const lookupId = await makeGroupLookupId(userId, normalizedGroupId, indexKey, version);
  if (!LOOKUP_ID_PATTERN.test(lookupId)) {
    throw new Error("lookupId must be 64 lowercase hex characters.");
  }

  const context = {
    lookupId,
    lookupVersion: version,
  };

  cache.entries[normalizedGroupId] = context;
  writeGroupLookupCache(cache);
  return context;
}

export function clearGroupLookupCacheForGroup(groupId: string): void {
  const cache = readGroupLookupCache();
  if (!cache) return;

  const normalizedGroupId = normalizeGroupId(groupId);
  if (!normalizedGroupId || !cache.entries[normalizedGroupId]) {
    return;
  }

  delete cache.entries[normalizedGroupId];
  writeGroupLookupCache(cache);
}

export function clearAllGroupLookupCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GROUP_LOOKUP_CACHE_KEY);
  } catch (error) {
    console.warn("[GroupLookup] Failed to clear lookup cache.", error);
  }
}
