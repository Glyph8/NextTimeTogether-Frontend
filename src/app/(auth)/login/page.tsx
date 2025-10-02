"use client";

import { loginRequest } from "@/api/auth";
import { TextInput } from "@/components/shared/Input/TextInput";
import { Button } from "@/components/ui/button/Button";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/crypto/auth/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPW] = useState("");
  const [warnMsg, setWarnMsg] = useState("");

  const getMaskterkey = async (id: string, pw: string) => {
    return await deriveMasterKeyPBKDF2(id, pw);
  };

  const getHashedId = async (id: string, masterKey: ArrayBuffer) => {
    const encryptedId = hmacSha256Truncated(masterKey, id, 128);
    return encryptedId;
  };

  const getHashedPw = async (pw: string, maskterKey: ArrayBuffer) => {
    const envryptedPw = hashPassword(maskterKey, pw);
  };

  const handleLogin = async () => {
    const masterKey = deriveMasterKeyPBKDF2(id, pw);

    await loginRequest(id, pw)
      .then((res) => {
        // 에러 응답이 와도 main 진입하는 문제 해결 필요
        console.log("로그인 성공 res : ", res);
        if (res) router.push("/calendar");
        else alert("로그인에서 문제 발생. 토큰 관련 오류 추정");
      })
      .catch((err) => {
        console.log("로그인 실패", err);
        setWarnMsg("일치하지 않는 ID, 비밀번호 입니다.");
      });
  };

  return (
    <div className="flex flex-col bg-white items-center">
      <div className="w-full flex flex-col justify-center items-start gap-5 mt-10">
        <TextInput
          label={"아이디"}
          data={id}
          setData={setId}
          placeholder={"아이디를 입력해주세요"}
        />
        <TextInput
          label={"비밀번호"}
          data={pw}
          setData={setPW}
          placeholder={"비밀번호를 입력해주세요"}
          isPassword={true}
        />
      </div>
      <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
        {warnMsg}
      </div>
      <Button
        text={"로그인"}
        disabled={id === "" || pw === ""}
        onClick={handleLogin}
      />
      <span className="text-center justify-start text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-5">
        타임투게더가 처음이신가요? &nbsp;
        <span className="justify-start text-purple-500 text-sm font-medium font-['Pretendard'] underline leading-tight">
          <Link href="/register/step1">회원가입</Link>
        </span>
      </span>
    </div>
  );
}
