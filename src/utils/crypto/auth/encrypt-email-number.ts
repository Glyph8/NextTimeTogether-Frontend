
// btoa는 Node 런타임에 없습니다(ReferenceError). 서버 액션/Route에서 호출 시 즉시 실패합니다.
// 대용량 배열에서 String.fromCharCode(...u8) 스프레드는 콜스택 오버플로 위험이 있습니다.
// crypto는 전역을 쓰되 globalThis로 안전 접근이 좋습니다.
// https://github.com/Glyph8/NextTimeTogether-Frontend/pull/16#discussion_r2426258277

export const encryptEmailPhone = async (
  masterKey: ArrayBuffer,
  keyword: string
) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    masterKey,
    // { name: "AES-256-GCM" },
     { name: "AES-GCM" }, // AES-256-GCM이 아니라 AES-GCM
    false,
    ["encrypt"]
  );

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(keyword)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
};
