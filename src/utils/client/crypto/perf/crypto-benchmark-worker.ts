type WorkerRequest = {
  id: string;
  encryptedList: string[];
  keyBase64: string;
};

type WorkerResponse =
  | { id: string; ok: true; durationMs: number; processedCount: number }
  | { id: string; ok: false; error: string };

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  let normalizedBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalizedBase64.length % 4;
  if (padding) {
    normalizedBase64 += "=".repeat(4 - padding);
  }

  const binaryString = atob(normalizedBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function decryptDataClientLike(
  encrypted: string,
  cryptoKey: CryptoKey
): Promise<string> {
  const combined = base64ToArrayBuffer(encrypted);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    ciphertext
  );
  return new TextDecoder().decode(decryptedBuffer);
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, encryptedList, keyBase64 } = event.data;

  try {
    const keyBuffer = base64ToArrayBuffer(keyBase64);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const started = performance.now();
    await Promise.all(encryptedList.map((item) => decryptDataClientLike(item, cryptoKey)));
    const durationMs = performance.now() - started;

    const response: WorkerResponse = {
      id,
      ok: true,
      durationMs,
      processedCount: encryptedList.length,
    };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : "worker decrypt failed",
    };
    self.postMessage(response);
  }
};

