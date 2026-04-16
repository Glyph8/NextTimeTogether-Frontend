import { arrayBufferToBase64, base64ToArrayBuffer } from "@/utils/client/helper";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";

type LongTaskSummary = {
  longTaskCount: number;
  longTaskTotalDurationMs: number;
};

export type CryptoBenchmarkInput = {
  payloadCount: number;
  payloadSizeBytes: number;
};

export type CryptoBenchmarkResult = {
  payloadCount: number;
  payloadSizeBytes: number;
  totalInputBytes: number;
  mainThreadDurationMs: number;
  workerDurationMs: number;
  mainThreadLongTasks: LongTaskSummary;
  workerLongTasks: LongTaskSummary;
};

type WorkerResponse =
  | { id: string; ok: true; durationMs: number; processedCount: number }
  | { id: string; ok: false; error: string };

function createPayload(index: number, size: number): string {
  const prefix = `payload-${index}-`;
  const fillSize = Math.max(size - prefix.length, 0);
  return `${prefix}${"x".repeat(fillSize)}`;
}

async function createDecryptKey(): Promise<{ key: CryptoKey; keyBase64: string }> {
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  const keyBase64 = arrayBufferToBase64(rawKey.buffer);
  const key = await crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
  return { key, keyBase64 };
}

async function prepareEncryptedList(
  payloadCount: number,
  payloadSizeBytes: number,
  key: CryptoKey
): Promise<string[]> {
  const plainList = Array.from({ length: payloadCount }, (_, idx) =>
    createPayload(idx, payloadSizeBytes)
  );

  return Promise.all(plainList.map((plainText) => encryptDataClient(plainText, key)));
}

async function decryptOnMainThread(
  encryptedList: string[],
  keyBase64: string
): Promise<void> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    base64ToArrayBuffer(keyBase64),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  await Promise.all(
    encryptedList.map(async (encrypted) => {
      const combined = base64ToArrayBuffer(encrypted);
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ciphertext);
    })
  );
}

async function runWithLongTaskMeasure(action: () => Promise<void>): Promise<{
  durationMs: number;
  longTasks: LongTaskSummary;
}> {
  let longTaskCount = 0;
  let longTaskTotalDurationMs = 0;
  let observer: PerformanceObserver | undefined;

  if (typeof PerformanceObserver !== "undefined") {
    observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        longTaskCount += 1;
        longTaskTotalDurationMs += entry.duration;
      }
    });
    observer.observe({ entryTypes: ["longtask"] });
  }

  const started = performance.now();
  await action();
  const durationMs = performance.now() - started;

  observer?.disconnect();

  return {
    durationMs,
    longTasks: {
      longTaskCount,
      longTaskTotalDurationMs,
    },
  };
}

function runWorkerDecrypt(encryptedList: string[], keyBase64: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./crypto-benchmark-worker.ts", import.meta.url), {
      type: "module",
    });
    const requestId = crypto.randomUUID();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      if (response.id !== requestId) return;
      worker.terminate();

      if (!response.ok) {
        reject(new Error(response.error));
        return;
      }

      resolve(response.durationMs);
    };

    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(event.message || "worker error"));
    };

    worker.postMessage({
      id: requestId,
      encryptedList,
      keyBase64,
    });
  });
}

export async function runCryptoBenchmark(
  input: CryptoBenchmarkInput
): Promise<CryptoBenchmarkResult> {
  const { payloadCount, payloadSizeBytes } = input;
  const { key, keyBase64 } = await createDecryptKey();
  const encryptedList = await prepareEncryptedList(payloadCount, payloadSizeBytes, key);

  const mainThread = await runWithLongTaskMeasure(async () => {
    await decryptOnMainThread(encryptedList, keyBase64);
  });

  const workerMeasure = await runWithLongTaskMeasure(async () => {
    await runWorkerDecrypt(encryptedList, keyBase64);
  });

  return {
    payloadCount,
    payloadSizeBytes,
    totalInputBytes: payloadCount * payloadSizeBytes,
    mainThreadDurationMs: mainThread.durationMs,
    workerDurationMs: workerMeasure.durationMs,
    mainThreadLongTasks: mainThread.longTasks,
    workerLongTasks: workerMeasure.longTasks,
  };
}

