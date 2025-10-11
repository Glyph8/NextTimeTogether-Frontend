import { EncryptUtil } from "../encrypt-util";

async function testGenerateKey() {
  try {
    const base64Key = await EncryptUtil.generateRandomBase64AESKey();
    console.log("🔑 [생성된 키]:", base64Key); // 생성된 128비트 AES 키 (base64)
    return base64Key;
  } catch (e) {
    console.error("❌ 키 생성 실패:", e);
    throw new Error("키 생성에 실패했습니다.");
  }
}

export default testGenerateKey;
