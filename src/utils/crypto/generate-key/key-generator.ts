import { EncryptUtil } from "../encrypt-util";
// import { Crypto } from './encrypt-util';

async function testGenerateKey() {
  try {
    // const base64Key = await Crypto.generateRandomBase64AESKey();
    const base64Key = await EncryptUtil.generateRandomBase64AESKey();
    console.log("🔑 [생성된 키]:", base64Key); // 생성된 128비트 AES 키 (base64)
  } catch (e) {
    console.error("❌ 키 생성 실패:", e);
  }
}

testGenerateKey();
