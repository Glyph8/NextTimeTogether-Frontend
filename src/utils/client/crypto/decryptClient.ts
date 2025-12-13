'use client'

import {
  GroupProxyUser_iv,
  User_iv,
  GroupShareKey_iv,
  UserIdContext_iv,
  PromiseProxyUser_iv,
  PromiseShareKey_iv,
} from "@/utils/crypto/iv-value/iv-constants";
import { base64ToArrayBuffer } from "../helper";

async function decryptDataWithCryptoKey(
  encrypted: string,
  masterKeyOrString: CryptoKey | string, // 1. 타입 변경 (string 허용)
  role: string
) {

  console.log("복호화 대상 :", encrypted);
  console.log("복호화 IV : ", role);

  // IV 결정 로직 (기존 동일)
  const iv = () => {
    if (role === "group_iv") return GroupProxyUser_iv;
    else if (role === "user_iv") return User_iv;
    else if (role === "user_id_context") return UserIdContext_iv;
    else if (role === "group_proxy_user") return GroupProxyUser_iv;
    else if (role === "group_sharekey") return GroupShareKey_iv;
    else if (role === "promise_proxy_user") return PromiseProxyUser_iv;
    else if (role === "promise_sharekey") return PromiseShareKey_iv;
    else return GroupShareKey_iv;
  };

  try {
    let cryptoKey: CryptoKey;

    // 2. 키 타입에 따른 처리 로직 추가
    if (typeof masterKeyOrString === "string") {
      // 2-1. 문자열인 경우: ArrayBuffer 변환 후 Key Import
      const keyBuffer = base64ToArrayBuffer(masterKeyOrString);
      
      cryptoKey = await crypto.subtle.importKey(
        "raw", 
        keyBuffer, 
        { name: "AES-GCM" }, 
        false, 
        ["decrypt"] // [중요] 복호화용이므로 'decrypt' 권한 필요
      );
    } else {
      // 2-2. 이미 CryptoKey인 경우 그대로 사용
      cryptoKey = masterKeyOrString;
    }

    const ciphertext = base64ToArrayBuffer(encrypted);
    
    // 3. 결정된 cryptoKey를 사용하여 복호화 수행
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv(),
      },
      cryptoKey, 
      ciphertext
    );

    console.log("client decrypt 성공");
    return new TextDecoder().decode(decryptedBuffer);
  } catch (e) {
    console.error("❌ 복호화 실패:", e);
    throw new Error("복호화에 실패했습니다.");
  }
}

export default decryptDataWithCryptoKey;