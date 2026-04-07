"use client";

import {
  GroupProxyUser_iv,
  User_iv,
  GroupShareKey_iv,
  UserIdContext_iv,
  PromiseProxyUser_iv,
  PromiseShareKey_iv,
} from "@/utils/crypto/iv-value/iv-constants";
import { base64ToArrayBuffer } from "../helper";

const getLegacyIvByRole = (role: string): Uint8Array => {
  if (role === "group_iv") return GroupProxyUser_iv;
  if (role === "user_iv") return User_iv;
  if (role === "user_id_context") return UserIdContext_iv;
  if (role === "group_proxy_user") return GroupProxyUser_iv;
  if (role === "group_sharekey") return GroupShareKey_iv;
  if (role === "promise_proxy_user") return PromiseProxyUser_iv;
  if (role === "promise_sharekey") return PromiseShareKey_iv;
  return GroupShareKey_iv;
};

const importDecryptKey = async (
  masterKeyOrString: CryptoKey | string
): Promise<CryptoKey> => {
  if (typeof masterKeyOrString !== "string") {
    return masterKeyOrString;
  }

  const keyBuffer = base64ToArrayBuffer(masterKeyOrString);
  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
};

export async function decryptDataCompat(
  encrypted: string,
  masterKeyOrString: CryptoKey | string,
  role?: string
) {
  try {
    const cryptoKey = await importDecryptKey(masterKeyOrString);

    try {
      const combined = base64ToArrayBuffer(encrypted);
      if (combined.byteLength <= 12) {
        throw new Error("v2 포맷 길이가 유효하지 않습니다. 최소 13바이트가 필요합니다.");
      }

      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        cryptoKey,
        ciphertext
      );
      return new TextDecoder().decode(decryptedBuffer);
    } catch (v2Error) {
      if (!role) {
        throw v2Error;
      }

      const ciphertext = base64ToArrayBuffer(encrypted);
      const legacyIv = getLegacyIvByRole(role);
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: legacyIv as BufferSource,
        },
        cryptoKey,
        ciphertext
      );
      return new TextDecoder().decode(decryptedBuffer);
    }
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
