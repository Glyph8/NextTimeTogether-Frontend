import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// 서버 전용 암호화 키 (환경 변수) - 환경 변수 검증
const COOKIE_ENCRYPTION_KEY = (() => {
  const key = process.env.COOKIE_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("COOKIE_ENCRYPTION_KEY environment variable is required");
  }
  if (!/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error(
      "COOKIE_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)"
    );
  }
  return key;
})();

export function encryptKey(masterKey: string | ArrayBuffer): string {
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv(
      "aes-256-gcm",
      Buffer.from(COOKIE_ENCRYPTION_KEY, "hex"),
      iv
    );

    let encrypted: string;

    // masterKey가 array buffer 타입인 경우도 처리
    if (masterKey instanceof ArrayBuffer) {
      encrypted = cipher.update(Buffer.from(masterKey)).toString("hex");
    } else {
      encrypted = cipher.update(masterKey, "utf8", "hex");
    }

    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  } catch (error) {
    throw new Error(
      `Key encryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function decryptKey(encryptedKey: string): string {
  try {
    const [ivHex, encrypted, authTagHex] = encryptedKey.split(":");
    if (!ivHex || !encrypted || !authTagHex) {
      throw new Error(
        "Invalid encrypted key format. Expected format: iv:encrypted:authTag"
      );
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(COOKIE_ENCRYPTION_KEY, "hex"),
      Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error(
      `Key decryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
