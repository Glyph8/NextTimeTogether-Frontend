import {
  GroupProxyUser_iv,
  User_iv,
  GroupShareKey_iv,
  UserIdContext_iv,
  PromiseProxyUser_iv,
  PromiseShareKey_iv,
  PsudoId_iv,
} from "@/utils/crypto/iv-value/iv-constants";
import { arrayBufferToBase64, base64ToArrayBuffer } from "../helper";

export async function encryptDataClient(
  plainText: string,
  masterKeyOrString: CryptoKey | string,
  role: string
): Promise<string> {
  try {
    let cryptoKey: CryptoKey;

    if (typeof masterKeyOrString === "string") {
      // 1. masterKeyOrString이 문자열(Base64)인 경우
      //    ArrayBuffer로 변환합니다. (helper 함수 가정)
      const keyBuffer = base64ToArrayBuffer(masterKeyOrString);

      // 2. ArrayBuffer를 CryptoKey로 임포트합니다.
      //    "encrypt" 사용이 가능해야 합니다.
      cryptoKey = await crypto.subtle.importKey(
        "raw", // 키 포맷 (raw는 바이너리)
        keyBuffer, // 키 데이터
        { name: "AES-GCM" }, // 알고리즘
        false, // 키는 내보낼 수 없음 (보안)
        ["encrypt"] // 키 용도 (암호화)
      );
    } else {
      // 3. 이미 CryptoKey 객체인 경우
      cryptoKey = masterKeyOrString;
    }

    // TODO :  매번 새로운 12바이트 랜덤 IV 생성
    // const iv = crypto.getRandomValues(new Uint8Array(12));
    const iv = () => {
      if (role === "group_iv") return GroupProxyUser_iv;
      else if (role === "user_iv") return User_iv;
      else if (role === "user_id_context") return UserIdContext_iv;
      else if (role === "group_proxy_user") return GroupProxyUser_iv;
      else if (role === "group_sharekey") return GroupShareKey_iv;
      else if (role === "promise_proxy_user") return PromiseProxyUser_iv;
      else if (role === "promise_sharekey") return PromiseShareKey_iv;
      else if (role === "psudo_id") return PsudoId_iv;
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
      cryptoKey, // <-- '리모컨'을 금고(API)에 즉시 사용
      encodedText
    );

    //  IV와 암호문을 Base64 문자열로 변환하여, 전송/저장 가능한
    // "iv:ciphertext" 형태로 결합
    // const ivBase64 = arrayBufferToBase64(iv().buffer);
    const cipherTextBase64 = arrayBufferToBase64(encryptedBuffer);

    // return `${ivBase64}:${cipherTextBase64}`;
    return cipherTextBase64;
  } catch (err) {
    console.error(`암호화 실패 (Role: ${role}):`, err);
    throw new Error("데이터 암호화에 실패했습니다.");
  }
}
