"use client";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import { Button } from "@/components/ui/button/Button";
import { useSignupStore } from "@/store/signupStore";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { userIdSchema } from "@/lib/schemas/signupSchema";

export default function RegisterIDPage() {
  const router = useRouter();
  const { updateFormData } = useSignupStore();
  const [id, setId] = useState("");
  // 백엔드 중복 확인 API 가 정식 도입되면 이 상태는 서버 응답으로 갱신.
  // 현재는 사용자가 "중복 확인" 버튼을 눌러 자가 확인했음을 명시할 때만 통과.
  const [hasCheckedDup, setHasCheckedDup] = useState(false);

  const isLenOk = id.length >= 5 && id.length <= 20;
  const isCharsOk = /^[a-zA-Z0-9_]+$/.test(id);
  const canProceed = isLenOk && isCharsOk && hasCheckedDup;

  const handleDupCheck = () => {
    // zod 스키마로 형식부터 검증.
    const parsed = userIdSchema.safeParse(id);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "아이디 형식이 올바르지 않습니다.");
      setHasCheckedDup(false);
      return;
    }
    // 백엔드 중복 확인 API 가 없으므로 임시로 형식만 통과시킨다.
    // 정식 도입 시 await checkUserIdDuplication(id) 형태로 교체.
    toast.success("사용 가능한 아이디입니다.");
    setHasCheckedDup(true);
  };

  const handleNextStep = () => {
    updateFormData({ userId: id });
    router.push("/register/step2");
  };

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
              name="userId"
              placeholder="아이디를 입력해주세요"
              className="w-full placeholder-gray-2 text-base font-medium leading-11.5 "
              onChange={(e) => {
                setId(e.target.value);
                // 입력값이 바뀌면 이전 중복 확인은 무효.
                if (hasCheckedDup) setHasCheckedDup(false);
              }}
              value={id}
            />
            <div className="flex gap-3 items-center">
              {id !== "" && (
                <button
                  type="button"
                  className="right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                  onClick={() => {
                    setId("");
                    setHasCheckedDup(false);
                  }}
                >
                  <XWhite />
                </button>
              )}

              <button
                type="button"
                className="w-17 h-7 px-2 py-1 border border-gray-3 rounded-[8px]
          text-[#999999] text-sm font-medium leading-tight whitespace-nowrap"
                onClick={handleDupCheck}
              >
                중복 확인
              </button>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-sm font-medium leading-tight text-gray-2">
            <span className={`flex gap-1 ${isLenOk && "text-main"}`}>
              5-20자 이내 <Check className="w-4 h-4 " />
            </span>
            <span className={`flex gap-1 ${isCharsOk && "text-main"}`}>
              영어, 숫자, 언더바(_)만 사용 <Check className="w-4 h-4 " />
            </span>
            <span className={`flex gap-1 ${hasCheckedDup && "text-main"}`}>
              중복 확인 <Check className="w-4 h-4 " />
            </span>
          </span>
        </div>
      </div>
      <Button text={"다음"} disabled={!canProceed} onClick={handleNextStep} />
    </div>
  );
}
