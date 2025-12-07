import { create } from "zustand";
import { PromiseView2Response, PromiseView4Response } from "@/apis/generated/Api"; 

export type PromiseInfo = PromiseView2Response | PromiseView4Response;

interface PromiseStore {
  selectedPromise: PromiseInfo | null;
  promiseKey: CryptoKey | string | null;
  setPromise: (promiseInfo: PromiseInfo, promiseKey: CryptoKey | string | null) => void;
  clearPromise: () => void;
}

export const usePromiseStore = create<PromiseStore>((set) => ({
  selectedPromise: null,
  promiseKey: null,

  setPromise: (promiseInfo, key) => set({ selectedPromise: promiseInfo, promiseKey: key }),
  clearPromise: () => set({ selectedPromise: null, promiseKey: null }),
}));