"use client";

import ConditionInputBar from "../components/ConditionInputBar";
import { useRegister } from "./hooks/use-register";

// import { Button } from "@/components/ui/button/Button"; // (주석 해제 필요)

export default function RegisterPhoneNumberPage() {
  // 2. useActionState 대신 신규 훅 사용
  const {
    phoneNumber,
    setPhoneNumber,
    handleSubmit,
    isPending,
    error,
  } = useRegister();

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

      <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
        {error && <p>{error}</p>}
      </div>

      {/* 4. <form> 태그 대신 <div> 또는 React <form> 사용 */}
      {/* 'action' 속성 제거, 'onSubmit' 또는 'onClick' 사용 */}
      <div className="w-full flex flex-col items-center gap-5">
        <button
          type="button" // 5. 'submit'이 아닌 'button'
          className="text-main text-sm font-medium leading-tight underline"
          onClick={() => handleSubmit(true)} // '지금 입력 안할래요' 핸들러
          disabled={isPending}
        >
          지금 입력 안할래요.
        </button>

        <button
          type="button" // 6. 'submit'이 아닌 'button'
          className="w-full h-14 bg-main rounded-xl text-white font-bold disabled:bg-gray-300"
          onClick={() => handleSubmit(false)} // '다음' 핸들러
          disabled={isPending || phoneNumber === ""} // (선택: 폰번호 입력 시만 활성화)
        >
          {isPending ? "가입 요청 중..." : "다음"}
        </button>
        {/* <Button 
          text={isPending ? "가입 요청 중..." : "다음"} 
          onClick={() => handleSubmit(false)} 
          disabled={isPending || phoneNumber === ""} 
        /> */}
      </div>
    </div>
  );
}


// import { useActionState, useState } from "react";
// import ConditionInputBar from "../components/ConditionInputBar";
// import { useSignupStore } from "@/store/signupStore";
// import { register, RegisterActionState } from "./action";

// export default function RegisterPhoneNumberPage() {
//   const { formData } = useSignupStore();
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const initialState: RegisterActionState = {
//     error: null,
//   };
//   const [error, registerAction] = useActionState(register, initialState);

//   return (
//     <div className="flex-1 bg-white flex flex-col pb-4 justify-between items-center">
//       <div className="w-full flex-1 flex flex-col items-center">
//         <nav className="w-full flex flex-col gap-2">
//           <div className="w-full text-black-1 text-xl font-medium leading-8 inline-flex justify-start items-start">
//             휴대폰 번호를
//             <br />
//             입력해주세요.(선택)
//           </div>
//           <div className="self-stretch justify-start text-gray-2 text-sm font-normal leading-tight">
//             그룹 모임 전에 알림톡을 보내드릴게요.
//           </div>
//         </nav>

//         <ConditionInputBar
//           data={phoneNumber}
//           onChange={(value: string) => setPhoneNumber(value)}
//           placeholder="휴대폰 번호를 입력해주세요."
//         />
//       </div>

//       <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
//         {error && <p>{error.error}</p>}
//       </div>
//       <form
//         action={registerAction}
//         className="w-full flex flex-col items-center gap-5"
//       >
//         <input type="hidden" name="userId" value={formData.userId} />
//         <input type="hidden" name="password" value={formData.password} />
//         <input type="hidden" name="email" value={formData.email} />
//         <input type="hidden" name="age" value={formData.age} />
//         <input type="hidden" name="gender" value={formData.gender} />
//         <input type="hidden" name="nickname" value={formData.nickname} />
//         <input
//           type="hidden"
//           name="telephone"
//           value={phoneNumber}
//           // value={formData.telephone || ""}
//         />
//         <button
//           type="submit"
//           className="text-main text-sm font-medium leading-tight underline"
//         >
//           지금 입력 안할래요.
//         </button>

//         <button
//           type="submit"
//           className="w-full h-14 bg-main rounded-xl text-white font-bold" 
//         >
//           다음
//         </button>
//         {/* <Button text={"다음"} isSubmit={true} disabled={phoneNumber === ""} /> */}
//       </form>
//     </div>
//   );
// }
