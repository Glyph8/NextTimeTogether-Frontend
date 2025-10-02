import { UserSignUpDTO } from "@/apis/generated/Api";
import { create } from "zustand";

interface SignupState {
  formData: Partial<UserSignUpDTO>;
  updateFormData: (data: Partial<UserSignUpDTO>) => void;
  reset: () => void; // 회원가입 완료 후 초기화하는 액션
}

const initialState: Partial<UserSignUpDTO> = {
  userId: "",
  email: "",
  password: "",
  nickname: "",
  wrappedDEK: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  formData: initialState,

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  reset: () => {
    set({ formData: initialState });
  },
}));
