import { createHmac } from "crypto";

/**
 * HMAC-SHA256 해시를 생성하는 함수
 * @param {string} key - 마스터 키 (Pepper)
 * @param {string} data - 해싱할 데이터 (사용자 비밀번호)
 * @returns {string} - Base64로 인코딩된 해시 값
 */
export function hmacSha256(key: string, data: string): Promise<string> {
  // Promise를 반환하여 비동기 처리를 흉내냈지만, 실제로는 동기 작업입니다.
  // 코드의 일관성을 위해 async/await 패턴을 사용할 수 있도록 Promise로 감쌌습니다.
  return new Promise((resolve) => {
    const hmac = createHmac("sha256", key);
    hmac.update(data);
    resolve(hmac.digest("base64"));
  });
}
