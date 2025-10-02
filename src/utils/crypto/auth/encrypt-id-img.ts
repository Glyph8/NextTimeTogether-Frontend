// export const blind = await hmacSha256(masterKey, userId);

export async function hmacSha256Truncated(
  key: ArrayBuffer | string,
  keyword: string,
  bits: number = 256 // 기본은 256비트
): Promise<string> {
  if (![128, 160, 192, 224, 256].includes(bits)) {
    // 지원하는 수에 대한 비트 예외처리(프론트가 만든 예외포맷으로 하면됩니다)
  }

  const encoder = new TextEncoder();
  const keyBuffer = typeof key === "string" ? encoder.encode(key) : key;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(keyword)
  );

  const byteLength = bits / 8;
  const fullBytes = new Uint8Array(signature).slice(0, byteLength);

  return Array.from(fullBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
