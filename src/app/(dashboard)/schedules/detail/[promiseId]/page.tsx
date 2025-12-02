"use client";

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg";
import { useState } from "react";
import { When2Meet } from "./When2Meet";
import { Where2Meet } from "./Where2Meet";
import { useParams, useRouter } from "next/navigation";
import { ScheduleDrawer } from "./components/ScheduleDrawer";
import { WhenConfirmDrawer } from "./components/WhenConfirmDrawer";
import { useQuery } from "@tanstack/react-query";
import { getEncryptedPromiseMemberId } from "@/api/promise-view-create";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

export default function ScheduleDetailPage() {
  const params = useParams<{ promiseId: string }>();
  const promiseId = params.promiseId;
  const router = useRouter();
  const [tab, setTab] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whenConfirmOpen, setWhenConfirmOpen] = useState(false);

  // TODO : 임시로 약속장 권한 처리
  const isMaster = true;
  const { data: encPromiseMemberList, isPending } = useQuery({
    queryKey: ["promiseId", "encPromiseIds"],
    queryFn: async () => {
      console.log("🔵 암호화된 약속 멤버 ID 조회");
      const result = await getEncryptedPromiseMemberId(promiseId);
      // null이나 undefined가 오면 빈 배열로 처리
      return result || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f9f9f9]">
      <ScheduleDrawer
        open={menuOpen}
        setOpen={setMenuOpen}
        isMaster={isMaster}
        promiseId={promiseId}
        onConfirmClick={() => {
          setMenuOpen(false);
          setWhenConfirmOpen(true);
        }}
      />
      {isMaster && (
        <WhenConfirmDrawer
          open={whenConfirmOpen}
          setOpen={setWhenConfirmOpen}
          promiseId={promiseId}
        />
      )}

      <Header
        leftChild={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
          >
            <LeftArrow />
          </button>
        }
        title={"발표 주제 정하기"}
        rightChild={
          <button
            type="button"
            aria-label="메뉴열기"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        }
        setShadow={false}
      />
      <nav
        role="tablist"
        aria-label="일정 장세 탭"
        className="w-full flex h-12 text-base font-medium leading-tight bg-white"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${
                      tab
                        ? "text-main border-main"
                        : "text-[#999999] border-[#D4D4D4]"
                    }  transition-all duration-200`}
          onClick={() => setTab(true)}
        >
          언제
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${
                      tab
                        ? "text-[#999999] border-[#D4D4D4]"
                        : "text-main border-main"
                    }  transition-all duration-200`}
          onClick={() => setTab(false)}
        >
          어디서
        </button>
      </nav>

      {isPending || !encPromiseMemberList ? (
        <DefaultLoading />
      ) : tab ? (
        <When2Meet
          promiseId={promiseId}
          encMemberIdList={encPromiseMemberList}
        />
      ) : (
        <Where2Meet encMemberIdList={encPromiseMemberList} />
      )}
    </div>
  );
}
