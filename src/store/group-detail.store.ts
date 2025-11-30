import { DecryptedGroupInfo } from "@/app/(dashboard)/groups/use-group-list";
import { create } from "zustand";

interface GroupStore {
  // 선택된 그룹의 복호화된 정보 (메모리 캐시)
  selectedGroup: DecryptedGroupInfo | null;
  groupKey: CryptoKey | null;
  // 액션
  setGroup: (group: DecryptedGroupInfo, groupKey:CryptoKey | null) => void;
  clearGroup: () => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  selectedGroup: null,
  groupKey: null,
  
  setGroup: (group, key) => set({ selectedGroup: group, groupKey: key }),
  clearGroup: () => set({ selectedGroup: null , groupKey: null}),
}));
