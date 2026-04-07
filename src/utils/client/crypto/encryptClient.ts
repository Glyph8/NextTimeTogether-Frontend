import { arrayBufferToBase64, base64ToArrayBuffer } from "../helper";

export async function encryptDataClient(
  plainText: string,
  masterKeyOrString: CryptoKey | string,
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
