"use client";

import { useAuthStore } from "@/store/auth.store";

export const clearClientAuthState = () => {
  useAuthStore.getState().clearAccessToken();

  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("encrypted_user_id");
  localStorage.removeItem("pseudo_id_index_key");
  localStorage.removeItem("hashed_user_id_for_manager");
};
