"use client";

import { useAuthStore } from "@/store/auth.store";
import { clearAllGroupLookupCache } from "@/utils/client/group-lookup";

export const clearClientAuthState = () => {
  useAuthStore.getState().clearAccessToken();
  clearAllGroupLookupCache();
  try {
    localStorage.removeItem("encrypted_user_id");
    localStorage.removeItem("pseudo_id_index_key");
    localStorage.removeItem("hashed_user_id_for_manager");
  } catch (error) {
    console.warn("[AuthCleanup] Failed to clear localStorage auth artifacts.", error);
  }
};
