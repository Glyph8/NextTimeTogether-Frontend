// store/useGroupStore.ts
import { DecryptedGroupInfo } from "@/app/(dashboard)/groups/use-group-list";
import { create } from "zustand";

interface GroupStore {
  // 선택된 그룹의 복호화된 정보 (메모리 캐시)
  selectedGroup: DecryptedGroupInfo | null;

  // 액션
  setGroup: (group: DecryptedGroupInfo) => void;
  clearGroup: () => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  selectedGroup: null,
  setGroup: (group) => set({ selectedGroup: group }),
  clearGroup: () => set({ selectedGroup: null }),
}));
