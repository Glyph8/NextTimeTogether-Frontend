import { makePseudoId } from "@/utils/client/crypto/encryptClient";
import { resolveLookupSubjectFromStorage } from "@/utils/client/lookup-subject";
import { GetPromiseRequest } from "@/apis/generated/Api";

export const PROMISE_LOOKUP_VERSION = 1;

const normalizeUserId = (userId: string) => userId.trim().toLowerCase();
const normalizeIndexKey = (indexKey: string) => indexKey.trim();

export async function makeLookupId(
  userId: string,
  indexKey: string,
  version: number = PROMISE_LOOKUP_VERSION
): Promise<string> {
  const normalizedUserId = normalizeUserId(userId);
  const normalizedIndexKey = normalizeIndexKey(indexKey);

  if (!normalizedUserId || !normalizedIndexKey) {
    throw new Error("userId and indexKey must not be empty after normalization.");
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error("lookupVersion must be an integer greater than or equal to 1.");
  }

  const payload =
    version === PROMISE_LOOKUP_VERSION
      ? normalizedUserId
      : `v${version}:${normalizedUserId}`;

  return makePseudoId(payload, normalizedIndexKey);
}

export function getLookupSourceFromStorage(): { userId: string; indexKey: string } {
  // Transitional naming: userId is currently used as the lookup subjectId across the app.
  const { subjectId, indexKey } = resolveLookupSubjectFromStorage();
  return { userId: subjectId, indexKey };
}

export function getLookupIndexKeyFromStorage(providedUserId?: string): string {
  if (typeof window === "undefined") {
    throw new Error("lookup source can only be read in browser environments.");
  }

  const userId = providedUserId ?? resolveLookupSubjectFromStorage().subjectId;
  // Backward compatibility: old sessions may not have pseudo_id_index_key yet.
  // In that case, we fall back to userId as indexKey to keep lookup derivation stable.
  const rawIndexKey = localStorage.getItem("pseudo_id_index_key")?.trim();
  const indexKey = rawIndexKey && rawIndexKey.length > 0 ? rawIndexKey : userId;

  if (!indexKey) {
    throw new Error("Missing lookup index key.");
  }

  return indexKey;
}

export async function resolveLookupContext(version: number = PROMISE_LOOKUP_VERSION) {
  const { userId, indexKey } = getLookupSourceFromStorage();
  return resolveLookupContextForUser(userId, indexKey, version);
}

export async function resolveLookupContextForUser(
  userId: string,
  indexKey: string,
  version: number = PROMISE_LOOKUP_VERSION
) {
  const lookupId = await makeLookupId(userId, indexKey, version);

  return {
    lookupId,
    lookupVersion: version,
  };
}

export function shouldSendLegacyEncUserId(): boolean {
  return process.env.NEXT_PUBLIC_PROMISE_LOOKUP_DUAL_REQUEST !== "false";
}

export function buildPromiseLookupRequest(
  promiseId: string,
  lookup: { lookupId: string; lookupVersion: number },
  encUserId?: string
): GetPromiseRequest {
  return {
    promiseId,
    lookupId: lookup.lookupId,
    lookupVersion: lookup.lookupVersion,
    ...(encUserId && shouldSendLegacyEncUserId() ? { encUserId } : {}),
  };
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
