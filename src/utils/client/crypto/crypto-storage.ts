import { arrayBufferToBase64, base64ToArrayBuffer } from "@/utils/client/helper";

/**
 * [신규] AES-GCM을 사용해 문자열을 암호화하고 (IV 포함),
 * localStorage 저장을 위해 Base64 문자열로 반환합니다.
 *
 * @param data - 암호화할 원본 문자열 (e.g., "user@email.com")
 * @param key - 암호화에 사용할 CryptoKey (e.g., masterKey)
 * @returns "[IV(Base64)][암호문(Base64)]" 형태가 아닌,
 * 하나로 합쳐진 "[IV + 암호문](Base64)" 문자열
 */
export async function encryptStringToBase64(
  data: string,
  key: CryptoKey
): Promise<string> {
  try {
    // 1. (IV 생성) 12바이트(96비트)의 무작위 IV를 생성합니다.
    // AES-GCM은 매번 새로운 IV를 사용해야 합니다.
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 2. (인코딩) 문자열을 ArrayBuffer로 변환합니다.
    const encodedData = new TextEncoder().encode(data);

    // 3. (암호화) AES-GCM 알고리즘으로 데이터를 암호화합니다.
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv, // 생성한 IV 사용
      },
      key,
      encodedData
    );

    // 4. (결합) [IV(12바이트)] + [암호화된 데이터]를 하나의 버퍼로 합칩니다.
    // 복호화 시 IV를 알아야 하므로, 암호문 앞에 붙여서 함께 저장합니다.
    const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combinedBuffer.set(iv, 0); // 0번 인덱스부터 IV 삽입
    combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length); // IV 바로 뒤에 암호문 삽입

    // 5. (Base64 변환) 합쳐진 버퍼를 Base64 문자열로 변환하여 반환
    return arrayBufferToBase64(combinedBuffer.buffer);
    
  } catch (error) {
    console.error("❌ [encryptStringToBase64] 암호화 실패:", error);
    throw new Error("데이터 암호화에 실패했습니다.");
  }
}

/**
 * [신규] encryptStringToBase64로 암호화된 Base64 문자열을
 * AES-GCM을 사용해 복호화하고 원본 문자열로 반환합니다.
 *
 * @param base64String - 암호화된 Base64 문자열
 * @param key - 복호화에 사용할 CryptoKey (e.g., masterKey)
 * @returns 원본 문자열 (e.g., "user@email.com")
 */
export async function decryptStringFromBase64(
  base64String: string,
  key: CryptoKey
): Promise<string> {
  try {
    // 1. (Base64 디코딩) Base64 문자열을 ArrayBuffer로 변환합니다.
    const combinedBuffer = base64ToArrayBuffer(base64String);

    // 2. (분리) [IV]와 [암호문]을 분리합니다.
    // IV는 항상 앞 12바이트입니다.
    const iv = combinedBuffer.slice(0, 12);
    const encryptedData = combinedBuffer.slice(12); // 12바이트 이후 모든 것

    // 3. (복호화) AES-GCM 알고리즘으로 데이터를 복호화합니다.
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv, // 저장했던 IV 사용
      },
      key,
      encryptedData
    );

    // 4. (디코딩) 복호화된 ArrayBuffer를 원본 문자열로 변환하여 반환
    return new TextDecoder().decode(decryptedBuffer);

  } catch (error) {
    console.error("❌ [decryptStringFromBase64] 복호화 실패:", error);
    // (참고) 키가 다르거나 데이터가 손상되면 여기서 에러가 발생합니다.
    throw new Error("데이터 복호화에 실패했습니다.");
  }
}