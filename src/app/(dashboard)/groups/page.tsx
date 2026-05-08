"use client";

import Header from "@/components/ui/header/Header";
import { ExitGroupDialog } from "./(components)/ExitGroupDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnterGroupDialog } from "./(components)/EnterGroupDialog";
import { useDecryptedGroupList } from "./use-group-list";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { GroupItemContainer } from "./(components)/GroupItemContainer";

interface SelectedGroup {
  groupId: string;
  groupName: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const [selectedExitGroup, setSelectedExitGroup] = useState<SelectedGroup | null>(null);
  const [isOpenEnterDialog, setIsOpenEnterDialog] = useState(false);

  const { data, isPending } = useDecryptedGroupList();

  const handleCreateBtn = () => {
    router.push("/groups/create");
  };

  if (isPending) {
    return <DefaultLoading />;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-[#F9F9F9] overflow-hidden">
      <Header title={"그룹 관리"} />

      <div className="w-full h-19 flex justify-end items-center px-4">
        <EnterGroupDialog
          isOpen={isOpenEnterDialog}
          setIsOpen={setIsOpenEnterDialog}
        />
        <ExitGroupDialog
          isOpen={selectedExitGroup !== null}
          setIsOpen={(openOrSetter) => {
            const open =
              typeof openOrSetter === "function"
                ? openOrSetter(selectedExitGroup !== null)
                : openOrSetter;
            if (!open) setSelectedExitGroup(null);
          }}
          groupId={selectedExitGroup?.groupId ?? ""}
          groupName={selectedExitGroup?.groupName ?? ""}
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
        <div className="w-full flex flex-col flex-1 gap-2 px-4 overflow-y-hidden">
          {data && data.length !== 0 ? (
            <div className="flex flex-col overflow-y-scroll pb-4 gap-2">
              {data?.map((group) => (
                <GroupItemContainer
                  key={group.groupId}
                  group={group}
                  onRequestExit={setSelectedExitGroup}
                />
              ))}
            </div>
          ) : (
            <p className="text-center pt-5">참가하고 있는 그룹이 없어요!</p>
          )}
        </div>
      )}
    </div>
  );
}
