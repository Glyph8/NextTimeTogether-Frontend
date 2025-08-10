import FullLogo from "@/assets/svgs/images/logo-full.svg"
import Link from "next/link";
export default function Home() {

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full text-center p-4">

        <div className="h-fit mb-24">
            {/* <Image
              src={FullLogo}
              alt="앱 로고"
              width={120}
              height={120}
              className="mx-auto"
            /> */}
            <FullLogo/>
          <div className="text-purple-500 text-3xl font-normal font-['KCC-Hanbit'] leading-tight">
            Time Together
          </div>
          <p className="text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight mt-3">
            그룹 일정 관리 앱(설명 추가 필요~~)
          </p>
        </div>


        <div className="flex justify-center items-center w-full h-12 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-neutral-200 
      text-center text-stone-500 text-base font-medium font-['Pretendard'] leading-tight"
      >
        <Link href="/login">
          아이디로 로그인
          </Link>
        </div>

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

    </main>
  );
}

