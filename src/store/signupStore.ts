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
};

export const useSignupStore = create<SignupState>((set) => ({
  formData: initialState,

  // updateFormData: (data) => {
  //   set((state) => ({
  //     formData: { ...state.formData, ...data },
  //   }));
  // },
 updateFormData: (data) => {
    set((state) => {
      // 1. 기존 상태와 새로 들어온 데이터를 병합하여 새로운 상태를 만듭니다.
      const newFormData = { ...state.formData, ...data };

      // 2. 테스트를 위해 콘솔에 새로운 상태를 출력합니다.
      console.log("Zustand formData updated:", newFormData);

      // 3. 새로운 상태를 반환하여 스토어를 업데이트합니다.
      return { formData: newFormData };
    });
  },


  reset: () => {
    set({ formData: initialState });
  },
}));
