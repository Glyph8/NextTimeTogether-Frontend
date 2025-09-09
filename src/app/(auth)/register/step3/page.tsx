"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";

export default function RegisterNickNamePage() {
  const [nickName, setNickName] = useState("");
  const router = useRouter();
  const handleNextStep = () => {
    router.push("/register/step4");
  };

  const conditionsNickName = [
    {
      title: "20자 이내 ",
      isFullfilled: (data: string) => {
        return data.length < 20;
      },
    },
    {
      title: "영어, 한글, 숫자만 사용",
      isFullfilled: (data: string) => {
        return data.length < 20 && data.length > 8;
      },
    },
  ];

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
          onChange={(value: string) => {
            setNickName(value);
          }}
          placeholder="닉네임을 입력해주세요."
        />
      </div>
      <Button text={"다음"} disabled={false} onClick={handleNextStep} />
    </div>
  );
}
