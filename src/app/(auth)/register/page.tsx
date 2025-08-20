"use client"

import { Button } from "@/components/ui/button/Button";
import { useState } from "react";

export default function RegisterPage() {
    const [id, setId] = useState("");
    /** 회원 가입 api 갖춰졌는지 불명. 확정 후 재개 */
    const handleNextStep = () => {
        console.log(id);
    }
    return (
        <div className="bg-white flex flex-col p-4">
            <div className="text-black-1 text-xl font-medium leading-loose">
                안녕하세요.<br/>
                아이디를 입력해주세요.
            </div>
             <input type="text" placeholder="아이디를 입력해주세요"
                        className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                        focus:border-b-main" 
                        onChange={(e)=>{
                            setId(e.target.value);
                        }}/>
            <Button text={"다음"} disabled={false} onClick={handleNextStep}/>
        </div>
    )
}