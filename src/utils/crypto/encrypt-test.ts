import { EncryptUtil } from "./encrypt-util";
import {
  GroupProxyUser_iv,
  GroupShareKey_iv,
  User_iv,
} from "./iv-value/iv-constants";

/*
GroupProxyUser
Group_iv 
User_iv 
GroupShareKey
*/

async function encryptPlainData(plainText: string, key: string, role?: string) {
  const normalizedKey = EncryptUtil.normalizeAESKey(key, 32); // 길이 맞추기

  const Code_iv = () => {
    if (role === "group_iv") return GroupProxyUser_iv;
    else if (role === "user_iv") return User_iv;
    else if (role === "group_proxy_user") return GroupProxyUser_iv;
    else if (role === "group_sharekey") return GroupShareKey_iv;
    else return GroupShareKey_iv;
  };

  // 노션 작성된 내용
  try {
    const encrypted = await EncryptUtil.encryptAESGCMWithIV(
      plainText,
      normalizedKey,
      Code_iv()
    );
    console.log("🔐 암호화 결과:", encrypted);
    return encrypted;
  } catch (e) {
    console.error("❌ 암호화/복호화 오류:", e);
    throw new Error("암호화/복호화에 실패했습니다.");
  }

}

export default encryptPlainData;
