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
  const binaryString = atob(base64); // base64를 디코딩해 바이너리 문자열로 변환
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer; // Uint8Array → ArrayBuffer 반환
}
