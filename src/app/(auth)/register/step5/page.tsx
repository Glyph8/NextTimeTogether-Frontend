"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";

export default function RegisterMailPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const router = useRouter();

  const checkEmailValid = (email: string) => {
    if (email.endsWith(".com")) return true;
    return false;
  };

  const handleNextStep = () => {
    if (checkEmailValid(email)) {
      router.push("/register/step6");
    } else {
      setIsEmailValid(false);
    }
  };

  const checkWithWarnEmail = {
    warnMessage: "올바른 이메일을 입력해주세요",
    isWarn: !isEmailValid,
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
          }}
          placeholder="이메일을 입력해주세요"
          checkWithWarn={checkWithWarnEmail}
        />
      </div>
      <Button text={"다음"} disabled={false} onClick={handleNextStep} />
    </div>
  );
}
