type DecryptBatchRequest = {
  type: "decrypt-batch";
  payload: {
    encPromiseIds: string[];
  };
};

type DecryptBatchWorkerResponse =
  | {
      type: "decrypt-batch-success";
      payload: {
        decryptedPromiseIds: string[];
      };
    }
  | {
      type: "decrypt-batch-error";
      payload: {
        message: string;
      };
    };

export async function decryptPromiseIdsWithWorker(
  encPromiseIds: string[]
): Promise<string[]> {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    throw new Error("Web Worker를 사용할 수 없는 환경입니다.");
  }

  return await new Promise<string[]>((resolve, reject) => {
    const worker = new Worker(
      new URL("../../../workers/promise-id-decrypt.worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event: MessageEvent<DecryptBatchWorkerResponse>) => {
      const { data } = event;
      if (!data) return;

      if (data.type === "decrypt-batch-success") {
        worker.terminate();
        resolve(data.payload.decryptedPromiseIds);
        return;
      }

      if (data.type === "decrypt-batch-error") {
        worker.terminate();
        reject(new Error(data.payload.message));
      }
    };

    worker.onerror = () => {
      worker.terminate();
      reject(new Error("약속 ID Worker 초기화에 실패했습니다."));
    };

    const request: DecryptBatchRequest = {
      type: "decrypt-batch",
      payload: { encPromiseIds },
    };
    worker.postMessage(request);
  });
}
