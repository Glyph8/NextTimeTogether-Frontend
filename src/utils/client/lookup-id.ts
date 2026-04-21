const LOOKUP_ID_PATTERN = /^[0-9a-f]{64}$/;

const normalizeLookupSubject = (subjectId: string) => subjectId.trim().toLowerCase();
const normalizeLookupResource = (resourceId: string) => resourceId.trim();
const normalizeLookupIndexKey = (indexKey: string) => indexKey.trim();

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

interface LookupIdInput {
  subjectId: string;
  indexKey: string;
  version: number;
  resourceId?: string;
}

export async function makeCanonicalLookupId({
  subjectId,
  indexKey,
  version,
  resourceId,
}: LookupIdInput): Promise<string> {
  const normalizedSubjectId = normalizeLookupSubject(subjectId);
  const normalizedIndexKey = normalizeLookupIndexKey(indexKey);
  const normalizedResourceId =
    typeof resourceId === "string" ? normalizeLookupResource(resourceId) : undefined;

  if (!normalizedSubjectId || !normalizedIndexKey) {
    throw new Error("lookupId 생성 입력값이 비어있습니다.");
  }

  if (typeof resourceId === "string" && !normalizedResourceId) {
    throw new Error("lookupId 생성 resourceId가 비어있습니다.");
  }

  if (!Number.isInteger(version) || version < 1) {
    throw new Error("lookupVersion must be an integer greater than or equal to 1.");
  }

  const isV1 = version === 1;
  const basePayload =
    typeof normalizedResourceId === "string"
      ? `${normalizedSubjectId}:${normalizedResourceId}`
      : normalizedSubjectId;

  const payload = isV1 ? basePayload : `v${version}:${basePayload}`;
  const lookupId = await makeHmacSha256Hex(payload, normalizedIndexKey);

  if (!LOOKUP_ID_PATTERN.test(lookupId)) {
    throw new Error("lookupId must be 64 lowercase hex characters.");
  }

  return lookupId;
}
