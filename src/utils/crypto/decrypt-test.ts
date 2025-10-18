import { EncryptUtil } from "./encrypt-util";
import { GroupProxyUser_iv, GroupShareKey_iv, User_iv } from "./iv-value/iv-constants";

async function decryptEncryptData(encrypted:string,  personalKey:string, role:string) {
  // TODO : // 길이 맞추기 필요함?
  const normalizedKey = EncryptUtil.normalizeAESKey(personalKey, 32); 
  const Code_iv = () => {
      if (role === "group_iv") return GroupProxyUser_iv;
      else if (role === "user_iv") return User_iv;
      else if (role === "group_proxy_user") return GroupProxyUser_iv;
      else if (role === "group_sharekey") return GroupShareKey_iv;
      else return GroupShareKey_iv;
    };
  
  try {
    const decrypted = await EncryptUtil.decryptAESGCMWithIV(
      encrypted,
      normalizedKey,
      Code_iv()
    );
    console.log("🔑 복호화 결과:", decrypted);
    return decrypted;
  } catch (e) {
    console.error("❌ 복호화 실패:", e);
    throw new Error("복호화에 실패했습니다.");
  }
}

export default decryptEncryptData;
