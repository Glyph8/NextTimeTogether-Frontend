"use client";

import Header from "@/components/ui/header/Header";
import { DEFAULT_IMAGE } from "@/constants";
import { CldImage } from "next-cloudinary";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/api/auth";
import toast from "react-hot-toast";
import { useMemberName } from "../groups/detail/[groupId]/(components)/GroupMemberItemContainer";
import { clearClientAuthState } from "@/lib/clearClientAuthState";
import { clearAuthCookies } from "@/app/(auth)/login/refresh.action";

export default function MyPage() {
  const router = useRouter();
  // const userId = useAuthStore.getState().userId;
  const userId = localStorage.getItem("hashed_user_id_for_manager");

  const { data: memberName } = useMemberName(userId || '');

  const handleHistory = () => {
    router.push("/my/history");
  };

  const handleLogout = () => {
    // 1) 서버 로그아웃 + RT 쿠키 클리어를 병렬로 실행 (Zustand의 AT는 securityWorker가 즉시 읽으므로 클리어 전에 호출되어야 함)
    Promise.allSettled([logoutRequest(), clearAuthCookies()]).then(async (results) => {
      const [backendResult, cookieResult] = results;
      const hasFailure =
        backendResult.status === "rejected" || cookieResult.status === "rejected";

      if (backendResult.status === "rejected") {
        console.warn("[Logout] backend logout failed:", backendResult.reason);
      }
      if (cookieResult.status === "rejected") {
        console.warn("[Logout] cookie cleanup failed:", cookieResult.reason);
      }

      // 2) Zustand(AT/userId), localStorage, IndexedDB MasterKey 정리
      await clearClientAuthState();

      if (hasFailure) {
        toast.error("일부 로그아웃 처리가 실패하여 로그인 페이지로 이동합니다.");
      } else {
        toast("로그아웃 되었습니다.");
      }
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
          <p className="text-[18px] ">{memberName ?? "사용자"} 님</p>
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
