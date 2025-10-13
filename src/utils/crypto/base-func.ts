import { createHmac } from "crypto";

/**
 * HMAC-SHA256 해시를 생성하는 함수
 * @param {string} key - 마스터 키 (Pepper)
 * @param {string} data - 해싱할 데이터 (사용자 비밀번호)
 * @returns {string} - Base64로 인코딩된 해시 값
 */


export function hmacSha256(key: string | Buffer, data: string): Promise<string> {
  return new Promise((resolve) => {
    const hmac = createHmac("sha256", key);
    hmac.update(data);
    resolve(hmac.digest("base64"));
  });
}
