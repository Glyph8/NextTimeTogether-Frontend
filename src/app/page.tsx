import Image from "next/image"
import FullLogo from "@/assets/images/logo-full.svg"
export default function Home() {

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center">

      <div className="mb-8">
        <Image
          src={FullLogo}
          alt="앱 로고"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>
      <div className="self-stretch justify-start text-purple-500 text-3xl font-normal font-['KCC-Hanbit'] leading-loose">Time Together</div>
      <p className="justify-start text-neutral-400 text-sm font-medium font-['Pretendard'] leading-tight">
        그룹 일정 관리 앱(설명 추가 필요~~)
      </p>

    </div>
  );
}

