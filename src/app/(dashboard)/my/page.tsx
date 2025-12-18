"use client";

import Header from "@/components/ui/header/Header";
import { DEFAULT_IMAGE } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { CldImage } from "next-cloudinary";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/api/auth";
import toast from "react-hot-toast";

export default function MyPage() {
  const router = useRouter();
  const userId = useAuthStore.getState().userId;
  const handleHistory = () => {
    router.push("/my/history");
  };

  const handleLogout = () => {
    logoutRequest().then(() => {
      toast("로그아웃 되었습니다.");
      useAuthStore.getState().clearAccessToken();
      router.push("/login");
    });
  };

  const handleUpdateProfile = () => {
    toast.error("아직 구현되지 않은 기능입니다.");
  };

  return (
    <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
      <Header title={"마이페이지"} />
      <div className="flex flex-col w-full bg-[#F9F9F9] py-4 gap-2.5">
        <div className="w-full flex gap-4 bg-white p-4 items-center justify-start">
          <CldImage
            src={DEFAULT_IMAGE}
            alt="image"
            width="64"
            height="64"
            className="border-gray-1 rounded-[8px]"
            crop="fill"
          />
          <p className="text-[18px] ">{userId ?? "사용자"} 님</p>
        </div>
        <div className="w-full flex flex-col bg-white">
          <div className="p-4 flex justify-between items-center h-13">
            <p className="text-base text-black">내 약속 기록</p>
            <button onClick={handleHistory}>
              <ArrowRight />
            </button>
          </div>
          <div className="p-4 flex justify-between items-center h-13">
            <p className="text-base text-black">프로필 변경</p>
            <button onClick={handleUpdateProfile}>
              <ArrowRight />
            </button>
          </div>
          <div className="p-4 flex justify-between items-center h-13">
            <p className="text-base text-black">로그아웃</p>
            <button onClick={handleLogout}>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
