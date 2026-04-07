import { arrayBufferToBase64, base64ToArrayBuffer } from "../helper";

/**
 * AES-GCM으로 plainText를 암호화
 * - 암호화할 때마다 새로운 12바이트 랜덤 IV를 생성
 * - 반환값: "[IV(12B) + 암호문]"을 Base64로 인코딩한 문자열
 * - 복호화 시 앞 12바이트를 IV로 분리해서 사용
 *
 * @param plainText 암호화할 원본 문자열
 * @param masterKeyOrString CryptoKey 객체 또는 Base64 인코딩된 키 문자열
 */
export async function encryptDataClient(
  plainText: string,
  masterKeyOrString: CryptoKey | string,
  // 레거시 호출부(3번째 role 인자 전달)를 깨지 않기 위한 호환 파라미터
  _legacyRole?: string
): Promise<string> {
  try {
    let cryptoKey: CryptoKey;

    if (typeof masterKeyOrString === "string") {
      const keyBuffer = base64ToArrayBuffer(masterKeyOrString);
      cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );
    } else {
      cryptoKey = masterKeyOrString;
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encodedText = new TextEncoder().encode(plainText);
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      cryptoKey,
      encodedText
    );

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return arrayBufferToBase64(combined.buffer);
  } catch (err) {
    console.error("암호화 실패:", err);
    throw new Error("데이터 암호화에 실패했습니다.");
  }
}

export async function makePseudoId(
  userId: string,
  indexKey: string
): Promise<string> {
  try {
    const normalizedUserId = userId.trim().toLowerCase();
    const normalizedIndexKey = indexKey.trim();

    if (!normalizedUserId || !normalizedIndexKey) {
      throw new Error("pseudoId 생성 입력값이 비어있습니다.");
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(normalizedIndexKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(normalizedUserId)
    );

    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("pseudoId 생성 실패:", error);
    throw new Error("pseudoId 생성에 실패했습니다.");
  }
}
