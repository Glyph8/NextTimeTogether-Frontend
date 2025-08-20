"use client"

import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter()
    const [id, setId] = useState("");
    const [pw, setPW] = useState("");
    const [loginReady, setLoginReady] = useState(false)
    const [warnMsg, setWarnMsg] = useState("");
    /** 추후 로그인 API 연결 */
    const handleLogin = () => {
        try {
            // await loginApi(id, pw)
            router.push('/calendar')
        }
        catch {
            console.log("로그인 실패")
        }
    }

    return (
        <div className="flex flex-col bg-white items-center">

            <div className="w-full flex flex-col justify-center items-start gap-5 mt-10">
                <div className="w-full">
                    <p className="w-full text-gray-1 text-sm leading-tight">
                        아이디
                    </p>
                    <input type="text" placeholder="아이디를 입력해주세요"
                        className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                        focus:border-b-main" 
                        onChange={(e)=>{
                            setId(e.target.value);
                            if(id !== "" && pw !== "")
                                setLoginReady(true);
                        }}/>
                </div>

                <div className="w-full">
                    <p className="text-gray-1 text-sm leading-tight">
                        비밀번호
                    </p>
                    <input type="password" placeholder="비밀번호를 입력해주세요"
                        className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                         focus:border-b-main"
                         onChange={(e)=>{
                            setPW(e.target.value)
                        if(id !== "" && pw !== "")
                                setLoginReady(true);
                        }} />
                </div>
            </div>

            <div className="flex justify-center items-center text-center w-full h-20 text-highlight-1 text-sm font-medium leading-tight">
                {warnMsg}아이디 또는 비밀번호를 확인해주세요
            </div>

            <Button text={"로그인"} disabled={!loginReady} onClick={handleLogin} />

            <span className="text-center justify-start text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-5">
                타임투게더가 처음이신가요? &nbsp;
                <span className="justify-start text-purple-500 text-sm font-medium font-['Pretendard'] underline leading-tight"
                >
                    <Link href="/register">
                        회원가입
                    </Link>
                </span>
            </span>
        </div>
    )
}