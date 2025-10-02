"use client";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useRouter } from "next/navigation";
import { signupRequest } from "@/api/auth";
import { UserSignUpDTO } from "@/apis/generated/Api";
import { useSignupStore } from "@/store/signupStore";
import { userSignUpSchema } from "@/lib/schemas/signupSchema";

export default function RegisterPhoneNumberPage() {
  const { formData, updateFormData } = useSignupStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const isFormValid = (formData: Partial<UserSignUpDTO>): boolean => {
    // safeParse는 유효성 검사를 시도하고, 성공/실패 여부와 결과를 객체로 반환합니다.
    // (에러를 throw하는 parse와 달리 안전합니다)
    const result = userSignUpSchema.safeParse(formData);

    if (!result.success) {
      console.log("유효성 검사 실패", formData);
      return false;
    }

    console.log("유효성 검사 성공!", result.data);
    return true;
  };
  const handleNextStep = async () => {
    updateFormData({ telephone: phoneNumber });
    if (!isFormValid(formData)) return;
    await signupRequest(formData as UserSignUpDTO)
      .then((res) => {
        // 에러 응답이 와도 main 진입하는 문제 해결 필요
        console.log("회원가입 성공 res : ", res);
        if (res) router.push("/complete-signup");
        else alert("회원가입에서 문제 발생. 토큰 관련 오류 추정");
      })
      .catch((err) => {
        console.log("회원가입 실패", err);
      });
  };

  /** number 제출 skip! */
  const handleSkipForm = async () => {
    if (!isFormValid(formData)) return;
    await signupRequest(formData as UserSignUpDTO)
      .then((res) => {
        // 에러 응답이 와도 main 진입하는 문제 해결 필요
        console.log("회원가입 성공 res : ", res);
        if (res) router.push("/complete-signup");
        else alert("회원가입에서 문제 발생. 토큰 관련 오류 추정");
      })
      .catch((err) => {
        console.log("회원가입 실패", err);
      });
  };

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
      <div className="w-full flex flex-col items-center gap-5">
        <button
          type="submit"
          className="text-main text-sm font-medium leading-tight underline"
          onClick={handleSkipForm}
        >
          지금 입력 안할래요.
        </button>
        <Button text={"다음"} disabled={false} onClick={handleNextStep} />
      </div>
    </div>
  );
}
