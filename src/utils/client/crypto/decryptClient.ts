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
  masterCryptoKey: CryptoKey,
  role: string
) {
  // TODO : // 길이 맞추기 필요함?
  //   const normalizedKey = EncryptUtil.normalizeAESKey(masterCryptoKey, 32);
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
    const ciphertext = base64ToArrayBuffer(encrypted);
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv(), // <-- 암호문에서 추출한 'iv'를 사용
      },
      masterCryptoKey, // <-- IndexedDB에서 가져온 'CryptoKey'를 사용
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
