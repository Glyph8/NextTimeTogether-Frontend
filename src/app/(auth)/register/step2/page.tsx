"use client";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/store/signupStore";
import { passwordSchema } from "@/lib/schemas/signupSchema";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;

const isLengthOk = (data: string) => data.length >= 8 && data.length <= 20;
const hasRequiredChars = (data: string) => PASSWORD_REGEX.test(data);

export default function RegisterPasswordPage() {
  const { updateFormData } = useSignupStore();
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");
  const router = useRouter();

  // zod 스키마와 정확히 일치하는 두 가지 조건을 분리하여 노출.
  const conditionsPW = [
    { title: "8-20자 이내", isFullfilled: isLengthOk },
    {
      title: "영어 대/소문자, 숫자 모두 사용",
      isFullfilled: hasRequiredChars,
    },
  ];

  const conditionsPW2 = [
    {
      title: "비밀번호 일치",
      isFullfilled: (data: string) => password === data && data !== "",
    },
  ];

  const isPasswordValid = passwordSchema.safeParse(password).success;
  const isMatch = password !== "" && password === passwordRe;
  const canProceed = isPasswordValid && isMatch;

  const handleNextStep = () => {
    if (!canProceed) return;
    updateFormData({ password });
    router.push("/register/step3");
  };

  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full pb-5 text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
          비밀번호를
          <br />
          입력해주세요.
        </nav>
        <ConditionInputBar
          data={password}
          conditions={conditionsPW}
          onChange={setPassword}
          placeholder="비밀번호를 입력해주세요."
          isPassword={true}
        />
        <ConditionInputBar
          data={passwordRe}
          conditions={conditionsPW2}
          onChange={setPasswordRe}
          placeholder="비밀번호를 한 번 더 입력해주세요."
          isPassword={true}
        />
      </div>
      <Button text={"다음"} disabled={!canProceed} onClick={handleNextStep} />
    </div>
  );
}
