"use client"

import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter()
    const [iu, setId] = useState("");
    const [pw, setPW] = useState("");

    /** 추후 로그인 API 연결 */
    const handleLogin = () =>{
        try{
            // await loginApi(id, pw)
            router.push('/calendar')
        }
        catch{
            console.log("로그인 실패")
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
            
            
            <p className="">
                아이디
            </p>
            <input type="text" placeholder="아이디를 입력해주세요"/>

            <input type="password" placeholder="비밀번호를 입력해주세요" />

            <Button text={"로그인"} disabled={false} onClick={handleLogin}/>

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