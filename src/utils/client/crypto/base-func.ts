"use client";

/**
 * [Browser-Compatible] HMAC-SHA256 해시를 생성하는 함수 (Web Crypto API)
 * @param {Uint8Array} key - 마스터 키 (Raw bytes)
 * @param {string} data - 해싱할 데이터 (사용자 비밀번호)
 * @returns {Promise<ArrayBuffer>} - Raw ArrayBuffer 해시 값
 */
export async function hmacSha256(
  key: Uint8Array, // ❗️ Buffer 대신 Uint8Array
  data: string
): Promise<ArrayBuffer> { // ❗️ string 대신 ArrayBuffer 반환 (hashPassword 호환용)
  
const keyBytes = key.slice(0);
  // 1. 키를 Web Crypto API용 CryptoKey 객체로 임포트
  const cryptoKey = await crypto.subtle.importKey(
    "raw", // 키 형식 (순수 바이트)
   keyBytes,   // ❗️ 복제된 'keyBytes'를 사용합니다.
    { name: "HMAC", hash: "SHA-256" }, // 사용할 알고리즘
    false, // extractable (키 추출 불가로 설정)
    ["sign"] // 이 키의 용도 (서명/해시 생성)
  );

  // 2. 해싱할 데이터를 Uint8Array로 인코딩
  const dataBuffer = new TextEncoder().encode(data);

  // 3. HMAC-SHA256으로 서명(해시) 실행
  //    반환값은 ArrayBuffer입니다.
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    dataBuffer
  );

  // 4. ArrayBuffer를 그대로 반환
  return signatureBuffer;
}