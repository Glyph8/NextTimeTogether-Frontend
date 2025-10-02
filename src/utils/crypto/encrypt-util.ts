// encrypt-util.ts
import { Buffer } from "buffer";

export class EncryptUtil {
  /**
   * 암호화에 사용할 랜덤한 128비트 AES 키 생성
   */
  static async generateRandomBase64AESKey(): Promise<string> {
    const key = crypto.getRandomValues(new Uint8Array(16)); // 128bit
    return Buffer.from(key).toString("base64");
  }

  /**
   * 주어진 평문(plainText)을 AES-GCM 알고리즘과
   * 고정된 초기화 벡터(IV)를 사용하여 암호화
   * @throws IV가 제공되지 않으면 오류 발생
   */
  static async encryptAESGCMWithFixedIV(
    plainText: string,
    base64Key: string,
    fixedIV?: Uint8Array
  ): Promise<string> {
    if (!fixedIV) {
      throw new Error(
        "IV 값은 필수입니다. iv-constants.ts에서 적절한 IV를 선택해 전달하세요."
      );
    }

    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(base64Key, "base64"),
      "AES-GCM",
      false,
      ["encrypt"]
    );

    const encoded = new TextEncoder().encode(plainText);

    const ciphertext = await crypto.subtle.encrypt(
      // { name: "AES-GCM", iv: fixedIV },
      { name: "AES-GCM", iv: new Uint8Array(fixedIV) },
      key,
      encoded
    );

    return Buffer.from(ciphertext).toString("base64");
  }

  /**
   * encryptAESGCMWithFixedIV로 암호화된 데이터를 다시 평문으로 복호화
   * 고정된 IV로 AES-GCM 복호화
   * @throws IV가 제공되지 않으면 오류 발생
   */
  static async decryptAESGCMWithFixedIV(
    cipherTextBase64: string,
    base64Key: string,
    fixedIV?: Uint8Array
  ): Promise<string> {
    if (!fixedIV) {
      throw new Error(
        "IV 값은 필수입니다. iv-constants.ts에서 적절한 IV를 선택해 전달하세요."
      );
    }

    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(base64Key, "base64"),
      "AES-GCM",
      false,
      ["decrypt"]
    );

    const cipherBuffer = Buffer.from(cipherTextBase64, "base64");

    const plainBuffer = await crypto.subtle.decrypt(
      // { name: "AES-GCM", iv: fixedIV },
      { name: "AES-GCM", iv: new Uint8Array(fixedIV) },
      key,
      cipherBuffer
    );

    return new TextDecoder().decode(plainBuffer);
  }
}
