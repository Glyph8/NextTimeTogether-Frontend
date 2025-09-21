"use client";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RadioButton } from "@/components/shared/Input/RadioButton";

export default function RegisterGenderAgePage() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("20~24세");
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("선택된 값:", event.target.value);
    setGender(event.target.value);
  };
  const router = useRouter();
  const handleNextStep = () => {
    router.push("/register/step5");
  };

  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
          성별과 연령대를
          <br />
          알려주세요.
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
          <select name="age" id="age" className="w-fit" value={age} onChange={(e)=>setAge(e.target.value)}>
            <option value="14세 이하">14세 이하</option>
            <option value="15~19세">15~19세</option>
            <option value="20~24세">20~24세</option>
            <option value="25~29세">25~29세</option>
            <option value="30~34세">30~34세</option>
            <option value="35~39세">35~39세</option>
            <option value="40세 이상">40세 이상</option>
          </select>
        </form>
      </div>
      <Button text={"다음"} disabled={false} onClick={handleNextStep} />
    </div>
  );
}
