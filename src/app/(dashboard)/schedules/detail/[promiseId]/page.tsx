"use client";

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg";
import { useState } from "react";
import { When2Meet } from "./When2Meet";
import { Where2Meet } from "./Where2Meet";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ScheduleDrawer } from "./components/ScheduleDrawer";
import { WhenConfirmDrawer } from "./components/WhenConfirmDrawer";
import { useQuery } from "@tanstack/react-query";
import {
  getEncryptedPromiseMemberId,
  getPromiseMemberDetail,
} from "@/api/promise-view-create";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

export default function ScheduleDetailPage() {
  const params = useParams<{ promiseId: string }>();
  const promiseId = params.promiseId;
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "약속 상세";
  const groupId = searchParams.get("groupId");
  const router = useRouter();
  const [tab, setTab] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whenConfirmOpen, setWhenConfirmOpen] = useState(false);

  const decryptedUserId = localStorage.getItem("hashed_user_id_for_manager");

  const { data, isPending } = useQuery({
    queryKey: ["promiseId", "encPromiseIds"],
    queryFn: async () => {
      console.log("🔵 암호화된 약속 멤버 ID 조회");
      const result = await getEncryptedPromiseMemberId(promiseId);

      const decUsersIds = await getPromiseMemberDetail(promiseId, result);
      return {
        encMembers: result || [],
        managerId: decUsersIds.promiseManager, // 매니저 ID도 데이터에 포함
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const isMaster = data?.managerId === decryptedUserId;
  console.log(
    "약속 매니저 아이디 : ",
    data?.managerId,
    "복호화된 유저 아이디 :",
    decryptedUserId,
    "매니저 여부 :",
    isMaster
  );
  const encPromiseMemberList = data?.encMembers;

  const handleBack = () => {
    if (groupId) {
      // groupId가 있으면 그룹 상세 페이지로 이동
      router.push(`/groups/detail/${groupId}`);
    } else {
      // groupId가 없으면 일반적인 뒤로가기 (예외 처리)
      router.back();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f9f9f9]">
      <ScheduleDrawer
        open={menuOpen}
        setOpen={setMenuOpen}
        isMaster={isMaster}
        managerId={data?.managerId ?? ""}
        promiseId={promiseId}
        participants={encPromiseMemberList?.userIds ?? []}
        onConfirmClick={() => {
          setMenuOpen(false);
          setWhenConfirmOpen(true);
        }}
        onConfirmPlace={() => {
          // TODO : 장소 확정 페이지로 이동
          // router.push(`/schedules/confirm-place?promiseId=${promiseId}`);
          const query = `promiseId=${promiseId}${
            groupId ? `&groupId=${groupId}` : ""
          }`;
          router.push(`/schedules/confirm-place?${query}`);
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
          <button type="button" aria-label="뒤로가기" onClick={handleBack}>
            <LeftArrow />
          </button>
        }
        title={title}
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
