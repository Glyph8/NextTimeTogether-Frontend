import {
  GroupProxyUser_iv,
  User_iv,
  GroupShareKey_iv,
  UserIdContext_iv,
} from "@/utils/crypto/iv-value/iv-constants";
import { arrayBufferToBase64 } from "../helper";

export async function encryptDataClient(
  plainText: string,
  masterCryptoKey: CryptoKey, // CryptoKey를 직접 받음
  role: string
): Promise<string> {
  try {
    // TODO :  매번 새로운 12바이트 랜덤 IV 생성
    // const iv = crypto.getRandomValues(new Uint8Array(12));
    const iv = () => {
      if (role === "group_iv") return GroupProxyUser_iv;
      else if (role === "user_iv") return User_iv;
      else if (role === "user_id_context") return UserIdContext_iv;
      else if (role === "group_proxy_user") return GroupProxyUser_iv;
      else if (role === "group_sharekey") return GroupShareKey_iv;
      else return GroupShareKey_iv;
    };

    // 텍스트를 바이너리(ArrayBuffer)로 인코딩
    const encodedText = new TextEncoder().encode(plainText);

    //importKey 없이 CryptoKey를 즉시 사용
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv(),
      },
      masterCryptoKey, // <-- '리모컨'을 금고(API)에 즉시 사용
      encodedText
    );

    //  IV와 암호문을 Base64 문자열로 변환하여, 전송/저장 가능한
    // "iv:ciphertext" 형태로 결합
    const ivBase64 = arrayBufferToBase64(iv().buffer);
    const cipherTextBase64 = arrayBufferToBase64(encryptedBuffer);

    return `${ivBase64}:${cipherTextBase64}`;
  } catch (err) {
    console.error(`암호화 실패 (Role: ${role}):`, err);
    throw new Error("데이터 암호화에 실패했습니다.");
  }
}
