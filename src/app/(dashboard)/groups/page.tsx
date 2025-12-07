"use client";

import Header from "@/components/ui/header/Header";
import { GroupItem } from "./(components)/GroupItem";
import { ExitGroupDialog } from "./(components)/ExitGroupDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnterGroupDialog } from "./(components)/EnterGroupDialog";
import { useDecryptedGroupList } from "./use-group-list";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

export default function GroupsPage() {
  const router = useRouter();
  const [isOpenExitDialog, setIsOpenExitDialog] = useState(false);
  const [isOpenEnterDialog, setIsOpenEnterDialog] = useState(false);

  const { data, isPending } = useDecryptedGroupList();

  const handleCreateBtn = () => {
    router.push("/groups/create");
  };

  if (isPending) {
    return <DefaultLoading/>;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
      <Header title={"그룹 관리"} />

      <div className="w-full h-19 flex justify-end items-center px-4">
        {/* TODO : EnterGroupDialog 필요한가? join과 연결 하거나 지우기 */}
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
      </div>

      {isPending ? (
        <DefaultLoading />
      ) : (
        <div className="w-full flex flex-col gap-2 px-4">
          {data && data.length !== 0 ? (
            data.map((group) => {
              return (
                <GroupItem
                  key={group.groupId}
                  groupId={group.groupId}
                  // image={group.groupImg ?? ''}
                  image={
                    "https://res.cloudinary.com/dg1apjunc/image/upload/v1764595919/samples/cloudinary-icon.png"
                  }
                  title={group.groupName}
                  description={group.explanation ?? "123"}
                  // members={group.encUserId.join(',')}
                  members={group.userIds.join(", ")}
                  setIsOpen={setIsOpenExitDialog}
                />
              );
            })
          ) : (
            <p className="text-center pt-5">참가하고 있는 그룹이 없어요!</p>
          )}
        </div>
      )}
    </div>
  );
}
