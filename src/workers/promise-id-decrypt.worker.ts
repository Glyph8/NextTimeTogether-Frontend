const DB_NAME = "E2EEKeyStore";
const STORE_NAME = "CryptoKeys";
const KEY_ID = "userMasterKey";

type DecryptBatchRequest = {
  type: "decrypt-batch";
  payload: {
    encPromiseIds: string[];
  };
};

type DecryptBatchSuccessResponse = {
  type: "decrypt-batch-success";
  payload: {
    decryptedPromiseIds: string[];
  };
};

type DecryptBatchErrorResponse = {
  type: "decrypt-batch-error";
  payload: {
    message: string;
  };
};

function openKeyStoreDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function getMasterKeyFromIndexedDB(): Promise<CryptoKey> {
  const db = await openKeyStoreDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(KEY_ID);

  const key = await new Promise<CryptoKey | null>((resolve, reject) => {
    request.onsuccess = () => resolve((request.result as CryptoKey | null) ?? null);
    request.onerror = () => reject(request.error);
  });

  if (!key) {
    throw new Error("마스터키를 찾을 수 없습니다.");
  }

  return key;
}

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

async function decryptDataWithCryptoKey(
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

const workerScope: Worker = self as unknown as Worker;

workerScope.onmessage = async (event: MessageEvent<DecryptBatchRequest>) => {
  const { data } = event;
  if (!data || data.type !== "decrypt-batch") {
    return;
  }

  try {
    const { encPromiseIds } = data.payload;
    const masterKey = await getMasterKeyFromIndexedDB();
    const decryptedPromiseIds = await Promise.all(
      encPromiseIds.map((encPromiseId) => decryptDataWithCryptoKey(encPromiseId, masterKey))
    );

    const response: DecryptBatchSuccessResponse = {
      type: "decrypt-batch-success",
      payload: { decryptedPromiseIds },
    };
    workerScope.postMessage(response);
  } catch (error) {
    const response: DecryptBatchErrorResponse = {
      type: "decrypt-batch-error",
      payload: {
        message:
          error instanceof Error
            ? error.message
            : "약속 ID 일괄 복호화 Worker 처리에 실패했습니다.",
      },
    };
    workerScope.postMessage(response);
  }
};
