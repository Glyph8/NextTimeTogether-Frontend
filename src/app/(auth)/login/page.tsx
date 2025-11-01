"use client";

import { TextInput } from "@/components/shared/Input/TextInput";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useLogin } from "./hooks/use-login";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

export default function LoginPage() {
  const {
    id,
    setId,
    pw,
    setPw,
    handleSubmit,
    isPending,
    error
  } = useLogin();

  if(isPending){
    return <DefaultLoading/>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-white items-center">
      <div className="w-full flex flex-col justify-center items-start gap-5 mt-10">
        <TextInput
          label={"아이디"}
          name="userId"
          data={id}
          setData={setId}
          placeholder={"아이디를 입력해주세요"}
        />
        <TextInput
          label={"비밀번호"}
          name="password"
          data={pw}
          setData={setPw}
          placeholder={"비밀번호를 입력해주세요"}
          isPassword={true}
        />
      </div>
      <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
        {error && <p>{error}</p>}
      </div>
      <Button
        text={"로그인"}
        isSubmit={true}
        disabled={id === "" || pw === ""}
        type="submit"
      />
      <span className="text-center justify-start text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-5">
        타임투게더가 처음이신가요? &nbsp;
        <span className="justify-start text-purple-500 text-sm font-medium font-['Pretendard'] underline leading-tight">
          <Link href="/register/step1">회원가입</Link>
        </span>
      </span>
    </form>
  );
}
