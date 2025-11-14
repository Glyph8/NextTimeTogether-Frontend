"use client"
// 2. (신규) Uint8Array를 Base64 문자열로 변환하는 브라우저용 헬퍼 함수
export function uint8ArrayToBase64(buffer: Uint8Array): string {
  // btoa: binary to ASCII
  // String.fromCharCode.apply(null, buffer)는
  // Uint8Array [72, 101, 108, 108, 111] -> "Hello" (바이너리 문자열)로 변환
  return btoa(String.fromCharCode.apply(null, Array.from(buffer)));
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // 1. Base64URL을 표준 Base64로 변환
  // '-' -> '+'
  // '_' -> '/'
  console.log("base64toArrayBuffer에 입력 : ", base64)
  let normalizedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');

  // 2. 패딩('=')이 생략된 경우 복원
  // Base64 문자열의 길이는 4의 배수여야 합니다.
  const padding = normalizedBase64.length % 4;
  if (padding) {
    normalizedBase64 += '='.repeat(4 - padding);
  }

  // 3. 표준 Base64 문자열을 디코딩
  const binaryString = atob(normalizedBase64); // base64를 디코딩해 바이너리 문자열로 변환
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer; // Uint8Array → ArrayBuffer 반환
}