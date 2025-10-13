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
