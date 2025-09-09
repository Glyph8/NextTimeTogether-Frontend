"use client";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useRouter } from "next/navigation";

export default function RegisterPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");
  const router = useRouter();
  const handleNextStep = () => {
    router.push("/register/step3");
  };

  const conditionsPW = [
    {
      title: "8-20자 이내 ",
      isFullfilled: (data: string) => {
        return data.length < 20 && data.length > 8;
      },
    },
    {
      title: "영어 대문자, 영어 소문자, 숫자 모두 사용",
      isFullfilled: (data: string) => {
        return data.length < 20 && data.length > 8;
      },
    },
  ];

  const conditionsPW2 = [
    {
      title: "비밀번호 일치",
      isFullfilled: (data: string) => {
        return password === data && data !== "";
      },
    },
  ];

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
          onChange={(value: string) => {
            setPassword(value);
          }}
          placeholder="비밀번호를 입력해주세요."
          isPassword={true}
        />
        <ConditionInputBar
          data={passwordRe}
          conditions={conditionsPW2}
          onChange={(value: string) => {
            setPasswordRe(value);
          }}
          placeholder="비밀번호를 한 번 더 입력해주세요."
          isPassword={true}
        />
      </div>
      <Button text={"다음"} disabled={false} onClick={handleNextStep} />
    </div>
  );
}
