"use client";

import Header from "@/components/ui/header/Header";
import { GroupItem } from "./(components)/GroupItem";
import { ExitGroupDialog } from "./(components)/ExitGroupDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnterGroupDialog } from "./(components)/EnterGroupDialog";
import { useQuery } from "@tanstack/react-query";
import { getGroupListAction } from "./action";

export default function GroupsPage() {
  const router = useRouter();
  const [isOpenExitDialog, setIsOpenExitDialog] = useState(false);
  const [isOpenEnterDialog, setIsOpenEnterDialog] = useState(false);

  const { data, isPending} = useQuery({
    queryKey: ["groupList"], // 이 쿼리를 식별하는 고유한 키
    queryFn: async () => {
      // 서버 액션을 호출하고, 실제 데이터 부분만 반환
      const result = await getGroupListAction();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const handleCreateBtn = () => {
    router.push("/groups/create");
  };
  const handleJoinBtn = () => {
    setIsOpenEnterDialog(true);
  };

  if (isPending) {
    return <div>그룹 리스트 데이터 로딩 중</div>;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
      <Header title={"그룹 관리"} />

      <div className="w-full h-19 flex justify-end items-center px-4">
        <EnterGroupDialog
          isOpen={isOpenEnterDialog}
          setIsOpen={setIsOpenEnterDialog}
        />
        <ExitGroupDialog
          isOpen={isOpenExitDialog}
          setIsOpen={setIsOpenExitDialog}
        />
        <button
          className="inline-flex w-30 px-5 py-2.5 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight"
          onClick={handleCreateBtn}
        >
          그룹 만들기
        </button>

        <button
          className="inline-flex w-[40%] px-5 py-2.5 mx-2 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight"
          onClick={handleJoinBtn}
        >
          임시 초대 수락 버튼
        </button>
      </div>

      <div className="w-full flex flex-col gap-2 px-4">
        {data &&
          data.map((group) => {
            return <GroupItem
            key={group.groupId}
              image={"https://placehold.co/64x64"}
              title={group.groupName}
              description={"2024-2학기 소프트웨어공학 팀플"}
              members={group.encUserId.join(',')}
              setIsOpen={setIsOpenExitDialog}
            />;
          })}
      </div>
    </div>
  );
}
