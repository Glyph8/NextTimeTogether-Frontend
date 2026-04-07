"use client";

import { base64ToArrayBuffer } from "../helper";

/**
 * encryptDataClient()로 암호화된 Base64 문자열을 복호화
 * - 앞 12바이트를 IV로, 나머지를 암호문으로 분리
 *
 * @param encrypted  encryptDataClient()의 반환값 (Base64)
 * @param masterKeyOrString CryptoKey 또는 Base64 인코딩 키 문자열
 */
async function decryptDataWithCryptoKey(
  encrypted: string,
  masterKeyOrString: CryptoKey | string
): Promise<string> {
  try {
    let cryptoKey: CryptoKey;

    if (typeof masterKeyOrString === "string") {
      const keyBuffer = base64ToArrayBuffer(masterKeyOrString);
      cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );
    } else {
      cryptoKey = masterKeyOrString;
    }

    const combined = base64ToArrayBuffer(encrypted);

    // 앞 12바이트 = IV, 나머지 = 암호문
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (e) {
    console.error("❌ 복호화 실패:", e);
    throw new Error("복호화에 실패했습니다.");
  }
}

async function decryptDataWithCryptoKey(
  encrypted: string,
  masterKeyOrString: CryptoKey | string,
  role?: string
) {
  return decryptDataCompat(encrypted, masterKeyOrString, role);
}

export default decryptDataWithCryptoKey;