"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useSignupStore } from "@/store/signupStore";
import { emailSchema } from "@/lib/schemas/signupSchema";

export default function RegisterMailPage() {
  const { updateFormData } = useSignupStore();
  const [email, setEmail] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  const isEmailValid = emailSchema.safeParse(email).success;
  // 사용자가 한 번이라도 다음 버튼을 누르거나 입력을 비웠다면 경고 노출.
  const showWarning = hasInteracted && !isEmailValid;

  const handleNextStep = () => {
    if (!isEmailValid) {
      setHasInteracted(true);
      return;
    }
    updateFormData({ email });
    router.push("/register/step6");
  };

  const checkWithWarnEmail = {
    warnMessage: "올바른 이메일을 입력해주세요.",
    isWarn: showWarning,
  };

  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full flex flex-col gap-2">
          <div className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
            이메일을
            <br />
            입력해주세요.
          </div>
          <div className="self-stretch justify-start text-gray-2 text-sm font-normal leading-tight">
            비밀번호 찾기에 이용되는 정보예요.
          </div>
        </nav>

        <ConditionInputBar
          data={email}
          onChange={(value: string) => {
            setEmail(value);
            if (hasInteracted) setHasInteracted(false);
          }}
          placeholder="이메일을 입력해주세요"
          checkWithWarn={checkWithWarnEmail}
        />
      </div>
      <Button text={"다음"} disabled={!isEmailValid} onClick={handleNextStep} />
    </div>
  );
}
