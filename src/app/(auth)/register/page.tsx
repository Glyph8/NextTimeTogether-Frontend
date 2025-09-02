"use client"

import { Button } from "@/components/ui/button/Button";
import { LoginFormInputs, loginSchema } from "@/schemas/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({ // 1. 추론된 타입을 제네릭으로 전달합니다.
        resolver: zodResolver(loginSchema), // 2. zodResolver를 사용하여 스키마를 연동합니다.
        mode: 'onBlur', // (선택사항) 포커스가 해제될 때 유효성 검사를 실행합니다.
    });

    const [id, setId] = useState("");
    /** 회원 가입 api 갖춰졌는지 불명. 확정 후 재개 */
    const handleNextStep = () => {
        console.log(id);
    }

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        console.log('유효성 검사 통과!', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white flex flex-col p-4">
                <label htmlFor="id" className="text-black-1 text-xl font-medium leading-loose">
                    안녕하세요.<br />
                    아이디를 입력해주세요.
                </label>
                <input type="text" placeholder="아이디를 입력해주세요"
                    className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                        focus:border-b-main"
                    onChange={(e) => {
                        setId(e.target.value);
                    }} />
                <Button text={"다음"} disabled={false} onClick={handleNextStep} />


                <label htmlFor="password" className="text-black-1 text-xl font-medium leading-loose">
                    비밀번호를 입력해주세요.
                </label>
                <input type="password" placeholder="비밀번호를 입력해주세요"
                    {...register('password')}
                    className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                        focus:border-b-main"
                    onChange={(e) => {
                        setId(e.target.value);
                    }} />
                {errors.email && <p>{errors.email.message}</p>}
                <input type="password" placeholder="비밀번호를 한번 더 입력해주세요"
                    {...register('password')}
                    className="w-full placeholder-gray-2 text-base font-medium leading-11.5 border-b-1 border-gray-3
                        focus:border-b-main"
                    onChange={(e) => {
                        setId(e.target.value);
                    }} />
                {errors.password && <p>{errors.password.message}</p>}
                <Button text={"다음"} disabled={isSubmitting} onClick={handleNextStep} />
            </div>
        </form>

    )
}