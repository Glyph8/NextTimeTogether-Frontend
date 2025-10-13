"use client";

import FullLogo from "@/assets/pngs/logo-full.png";
import NaverLogo from "@/assets/pngs/naver.png";
import KakaoLogo from "@/assets/pngs/kakao.png";
import GoogleLogo from "@/assets/pngs/google.png";
import Link from "next/link";
import Image from "next/image";
import LoginItem from "./components/LoginItem";

export default function Home() {
  const loginList = [
    {
      icon: NaverLogo,
      text: "네이버",
      route: "/sns-signup",
    },
    { icon: KakaoLogo, text: "카카오", route: "/sns-signup" },
    { icon: GoogleLogo, text: "구글", route: "/sns-signup" },
    { icon: "none", text: "아이디", route: "/login" },
  ];
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full text-center p-4">
        <div className="h-fit mb-24">
          <Image src={FullLogo} alt="로고" className="object-cover mx-auto" />
          <div className="text-purple-500 text-3xl font-normal font-['KCC-Hanbit'] leading-tight">
            Time Together
          </div>
          <p className="text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-3">
            시간 조율 걱정 없이 <br />
            그룹 모임을 편하고 빠르게
          </p>
        </div>

        <nav className="w-full flex flex-col justify-center items-center gap-2">
          {loginList.map((item) => (
            <LoginItem
              icon={item.icon}
              text={item.text}
              route={item.route}
              key={item.text}
            />
          ))}
        </nav>

        {/* <div
          className="flex justify-center items-center w-full max-w-200 h-12 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-neutral-200 
      text-center text-stone-500 text-base font-medium font-['Pretendard'] leading-tight"
        >
          <Link href="/login">아이디로 로그인</Link>
        </div> */}

        <span className="text-center justify-start text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-5">
          타임투게더가 처음이신가요? &nbsp;
          <span className="justify-start text-purple-500 text-sm font-medium font-['Pretendard'] underline leading-tight">
            <Link href="/register/step1">회원가입</Link>
          </span>
        </span>
      </div>
    </main>
  );
}
