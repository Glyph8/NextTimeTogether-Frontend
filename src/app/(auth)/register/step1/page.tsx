"use client";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import { Button } from "@/components/ui/button/Button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// import { LoginFormInputs, loginSchema } from "@/schemas/loginSchemas";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SubmitHandler, useForm } from "react-hook-form";

export default function RegisterIDPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  /** 회원 가입 api 갖춰졌는지 불명. 확정 후 재개 */
  const [isDup, setIsDup] = useState(true);
  const handleDupCheck = () => {
    toast("다른 아이디를 사용해주세요.");
    setIsDup(false);
  };
  const handleNextStep = () => {
    console.log(id);
    router.push("/register/step2");
  };

  //   const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
  //     console.log("유효성 검사 통과!", data);
  //   };
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors, isSubmitting },
  //   } = useForm<LoginFormInputs>({
  //     // 1. 추론된 타입을 제네릭으로 전달합니다.
  //     resolver: zodResolver(loginSchema), // 2. zodResolver를 사용하여 스키마를 연동합니다.
  //     mode: "onBlur", // (선택사항) 포커스가 해제될 때 유효성 검사를 실행합니다.
  //   });
  return (
    <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
      <div className="w-full flex-1 flex flex-col items-center">
        <nav className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
          안녕하세요.
          <br />
          아이디를 입력해주세요.
        </nav>

        <div className="w-full flex-1 flex flex-col py-5 gap-2">
          <div className="w-full flex justify-between items-center border-b-1 border-gray-3 focus-within:border-b-main">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              className="w-full placeholder-gray-2 text-base font-medium leading-11.5 "
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
            <div className="flex gap-3 items-center">
              {id !== "" && (
                <button
                  className="right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                  onClick={() => setId("")}
                >
                  <XWhite />
                </button>
              )}

              <button
                className="w-17 h-7 px-2 py-1 border border-gray-3 rounded-[8px] 
          text-[#999999] text-sm font-medium leading-tight whitespace-nowrap"
                onClick={handleDupCheck}
              >
                중복 확인
              </button>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-sm font-medium leading-tight text-gray-2">
            <span className={`flex gap-1 ${id.length <= 20 && "text-main"}`}>
              20자 이내 <Check className="w-4 h-4 " />
            </span>
            <span className={`flex gap-1 ${id.length <= 20 && "text-main"}`}>
              영어, 숫자, 언더바(_)만 사용 <Check className="w-4 h-4 " />
            </span>
            <span className={`flex gap-1 ${!isDup && "text-main"}`}>
              중복 확인 <Check className="w-4 h-4 " />
            </span>
          </span>
        </div>
      </div>
      <Button text={"다음"} disabled={false} onClick={handleNextStep} />
    </div>
  );
}
