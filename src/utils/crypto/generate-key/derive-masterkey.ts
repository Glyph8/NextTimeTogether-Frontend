export async function deriveMasterKeyPBKDF2(userId: string, password: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();

  const salt = encoder.encode(userId);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256 
  );

  return derivedBits;
}
