"use client";
import { Button } from "@/components/ui/button/Button";
import { useActionState, useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
// import { signupRequest } from "@/api/auth";
// import { UserSignUpDTO } from "@/apis/generated/Api";
import { useSignupStore } from "@/store/signupStore";
// import { userSignUpSchema } from "@/lib/schemas/signupSchema";
import { register, RegisterActionState } from "./action";

export default function RegisterPhoneNumberPage() {
  const { formData } = useSignupStore();
  const [phoneNumber, setPhoneNumber] = useState("");

  const initialState: RegisterActionState = {
    error: null,
  };
  const [error, registerAction] = useActionState(register, initialState);

  // const isFormValid = (formData: Partial<UserSignUpDTO>): boolean => {
  //   const result = userSignUpSchema.safeParse(formData);
  //   if (!result.success) {
  //     console.log("유효성 검사 실패", formData);
  //     return false;
  //   }
  //   console.log("유효성 검사 성공!", result.data);
  //   return true;
  // };

  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full flex flex-col gap-2">
          <div className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
            휴대폰 번호를
            <br />
            입력해주세요.(선택)
          </div>
          <div className="self-stretch justify-start text-gray-2 text-sm font-normal leading-tight">
            그룹 모임 전에 알림톡을 보내드릴게요.
          </div>
        </nav>

        <ConditionInputBar
          data={phoneNumber}
          onChange={(value: string) => setPhoneNumber(value)}
          placeholder="휴대폰 번호를 입력해주세요."
        />
      </div>

      <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
        {error && <p>{error.error}</p>}
      </div>
      <form
        action={registerAction}
        className="w-full flex flex-col items-center gap-5"
      >
        <input type="hidden" name="userId" value={formData.userId} />
        <input type="hidden" name="password" value={formData.password} />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="nickname" value={formData.nickname} />
        <input
          type="hidden"
          name="telephone"
          value={formData.telephone || ""}
        />
        <button
          type="submit"
          className="text-main text-sm font-medium leading-tight underline"
        >
          지금 입력 안할래요.
        </button>

        <Button text={"다음"} isSubmit={true} />
      </form>
    </div>
  );
}
