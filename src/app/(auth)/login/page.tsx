"use client";

import { TextInput } from "@/components/shared/Input/TextInput";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { login, LoginActionState } from "./action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const initialState: LoginActionState = {
    error: null,
    success: null,
  };
  const [state, loginAction] = useActionState(login, initialState);
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // --- useEffect를 사용하여 성공 시 리다이렉트 처리 ---
  useEffect(() => {
    if (state.success && state.accessToken) {
      localStorage.setItem("access_token", state.accessToken);
      router.push("/calendar");
    }
  }, [state, router]);

  return (
    <form action={loginAction} className="flex flex-col bg-white items-center">
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
        {state.error && <p>{state.error}</p>}
      </div>

      <Button
        text={"로그인"}
        isSubmit={true}
        disabled={id === "" || pw === ""}
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
