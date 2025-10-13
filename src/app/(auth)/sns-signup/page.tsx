"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RadioButton } from "@/components/shared/Input/RadioButton";
import ConditionInputBar from "../register/components/ConditionInputBar";

export default function RegisterForSnsPage() {
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const checkEmailValid = (email: string) => {
    if (email.endsWith(".com")) return true;
    return false;
  };

  const checkWithWarnEmail = {
    warnMessage: "올바른 이메일을 입력해주세요",
    isWarn: !isEmailValid,
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("선택된 값:", event.target.value);
    setGender(event.target.value);
  };
  const router = useRouter();

  const handleNextStep = () => {
    if (checkEmailValid(email)) {
      router.push("/complete-signup");
    } else {
      setIsEmailValid(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col pb-5 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start pt-7 pb-5">
          서비스 이용 전에
          <br />
          정보를 입력해주세요.
        </nav>
        <form className="w-full flex flex-col gap-3 py-4">
          <span className="text-gray-1 text-sm font-normal leading-tight">
            성별
          </span>
          <div className="flex gap-3">
            <RadioButton
              id="male"
              name="gender"
              value="male"
              label="남성"
              checked={gender === "male"}
              handleChange={handleOptionChange}
            />
            <RadioButton
              id="female"
              name="gender"
              value="female"
              label="여성"
              checked={gender === "female"}
              handleChange={handleOptionChange}
            />
          </div>
        </form>

        {/* 추후 직접 작성한 드롭다운 컴포넌트로 대체 */}
        <form className="w-full flex flex-col gap-3 py-4">
          <label
            htmlFor="age"
            className="text-gray-1 text-sm font-normal leading-tight"
          >
            연령대
          </label>
          <select name="age" id="age" className="w-fit">
            <option value="14세 이하">14세 이하</option>
            <option value="15~19세">15~19세</option>
            <option value="20~24세">20~24세</option>
            <option value="25~29세">25~29세</option>
            <option value="30~34세">30~34세</option>
            <option value="35~39세">35~39세</option>
            <option value="40세 이상">40세 이상</option>
          </select>
        </form>
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
