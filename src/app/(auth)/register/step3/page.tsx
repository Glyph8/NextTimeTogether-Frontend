"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useSignupStore } from "@/store/signupStore";
import { nicknameSchema } from "@/lib/schemas/signupSchema";

const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]+$/;

const isLengthOk = (data: string) => data.length >= 2 && data.length <= 20;
const hasValidChars = (data: string) => data.length > 0 && NICKNAME_REGEX.test(data);

export default function RegisterNickNamePage() {
  const { updateFormData } = useSignupStore();
  const [nickName, setNickName] = useState("");
  const router = useRouter();

  const conditionsNickName = [
    { title: "2-20자 이내", isFullfilled: isLengthOk },
    { title: "영어, 한글, 숫자만 사용", isFullfilled: hasValidChars },
  ];

  const canProceed = nicknameSchema.safeParse(nickName).success;

  const handleNextStep = () => {
    if (!canProceed) return;
    updateFormData({ nickname: nickName });
    router.push("/register/step4");
  };

  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
          닉네임을
          <br />
          입력해주세요.
        </nav>
        <ConditionInputBar
          data={nickName}
          conditions={conditionsNickName}
          onChange={setNickName}
          placeholder="닉네임을 입력해주세요."
        />
      </div>
      <Button text={"다음"} disabled={!canProceed} onClick={handleNextStep} />
    </div>
  );
}
