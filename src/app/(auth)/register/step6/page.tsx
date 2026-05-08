"use client";

import ConditionInputBar from "../components/ConditionInputBar";
import { useRegister } from "./hooks/use-register";
import { telephoneSchema } from "@/lib/schemas/signupSchema";

export default function RegisterPhoneNumberPage() {
  const {
    phoneNumber,
    setPhoneNumber,
    handleSubmit,
    isPending,
    error,
  } = useRegister();

  // 빈 문자열은 통과(선택 입력), 입력했다면 010-XXXX-XXXX 형식 요구.
  const isPhoneValid = telephoneSchema.safeParse(phoneNumber).success;
  const showWarning = phoneNumber.length > 0 && !isPhoneValid;

  const checkWithWarnPhone = {
    warnMessage: "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)",
    isWarn: showWarning,
  };

  const canSubmitWithPhone = phoneNumber.length > 0 && isPhoneValid;

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
          placeholder="010-1234-5678"
          checkWithWarn={checkWithWarnPhone}
        />
      </div>

      <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
        {error && <p>{error}</p>}
      </div>

      <div className="w-full flex flex-col items-center gap-5">
        <button
          type="button"
          className="text-main text-sm font-medium leading-tight underline"
          onClick={() => handleSubmit(true)}
          disabled={isPending}
        >
          지금 입력 안할래요.
        </button>

        <button
          type="button"
          className="w-full h-14 bg-main rounded-xl text-white font-bold disabled:bg-gray-300"
          onClick={() => handleSubmit(false)}
          disabled={isPending || !canSubmitWithPhone}
        >
          {isPending ? "가입 요청 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
