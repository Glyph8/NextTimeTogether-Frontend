import Image from "next/image"
import WhiteLogo from "@/assets/images/logo-white.svg"

export default function Splash() {
  return (
    <div className="min-h-screen bg-gradient-highlight overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 md:w-1/2 h-1/2">
          {/* <Image
            src={WhiteLogo}
            alt="앱 로고"
            sizes="(max-width: 768px) 100vw, (max-height: 1268px) 50vw, 33vw "
            className="object-cover mx-auto rounded-full"
          /> */}
          <WhiteLogo/>
        </div>
      </div>
    </div>
  );
}