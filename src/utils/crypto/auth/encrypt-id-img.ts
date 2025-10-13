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


// TODO : 이거 맞냐..? img-iv를 보내줘야해서 내가 추가함.
export async function hmacSha256TruncatedWithIv(
  key: ArrayBuffer | string,
  keyword: string,
  bits: number = 256 // 기본은 256비트
): Promise<{ ciphertext: string; iv: string }> {
  if (![128, 160, 192, 224, 256].includes(bits)) {
    // 지원하는 수에 대한 비트 예외처리(프론트가 만든 예외포맷으로 하면됩니다)
  }

  // TODO : 이거 맞냐..? 내가 추가함.
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoder = new TextEncoder();
  const keyBuffer = typeof key === "string" ? encoder.encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.encrypt(
    { name: "HMAC", iv },
    cryptoKey,
    encoder.encode(keyword)
  );

  const byteLength = bits / 8;
  const fullBytes = new Uint8Array(signature).slice(0, byteLength);

  return {
    ciphertext: Array.from(fullBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
