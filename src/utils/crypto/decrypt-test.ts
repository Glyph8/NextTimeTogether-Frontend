import { EncryptUtil } from "./encrypt-util";
import { GroupProxyUser_iv } from "./iv-value/iv-constants";

async function decryptEncryptData(encrypted:string,  personalKey:string) {
  // const encrypted = "암호화된문자열==";
  // const personalKey = "ScJmgqWF192Ixl816aDFzA=="; // base64 개인 AES키

  try {
    // const decrypted = await Crypto.decryptAESGCMWithIV(encrypted, personalKey, GroupProxyUser_iv);
    const decrypted = await EncryptUtil.decryptAESGCMWithIV(
      encrypted,
      personalKey,
      GroupProxyUser_iv
    );
    console.log("🔑 복호화 결과:", decrypted);
  } catch (e) {
    console.error("❌ 복호화 실패:", e);
  }
}

export default decryptEncryptData;
