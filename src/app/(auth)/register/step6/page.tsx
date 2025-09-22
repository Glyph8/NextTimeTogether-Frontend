"use client";
import { Button } from "@/components/ui/button/Button";
import { useState } from "react";
import ConditionInputBar from "../components/ConditionInputBar";
import { useRouter } from "next/navigation";
import { signupRequest } from "@/api/auth";
import { UserSignUpDTO } from "@/apis/generated/Api";

export default function RegisterPhoneNumberPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const signupData:UserSignUpDTO = {
    userId: "123",
    email: "123@naver.com",
    password: "123",
    nickname: "123",
    wrappedDEK: "123"
  }
  /** 추후 number 제출 api 연결 */
  const handleNextStep = async () => {
    await signupRequest(signupData)
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
  const handleSkipForm = () => {
    router.push("/complete-signup");
  };
  /** 추후 전화번호 form대로 가공 */
  // const makePhoneNumberForm = (value:string) => {
  //   const arrString = Array.from(value);
  // if (!/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(inputs)) return false;
  // const digitsOnly = inputs.replace(/[^0-9]/g, ""); // 그냥 숫자만 받게
  // return /^(?:\d{9,11})$/.test(digitsOnly); // 9~11자리로 제한
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
