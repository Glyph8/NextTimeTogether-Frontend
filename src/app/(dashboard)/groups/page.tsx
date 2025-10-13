"use client"

import Header from "@/components/ui/header/Header";
import { GroupItem } from "./GroupItem";
import { ExitGroupDialog } from "./ExitGroupDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnterGroupDialog } from "./EnterGroupDialog";

export default function GroupsPage() {
    const router = useRouter();
    const [isOpenExitDialog, setIsOpenExitDialog] = useState(false);
    const [isOpenEnterDialog, setIsOpenEnterDialog] = useState(false);
    const handleCreateBtn = () => {
        router.push("/groups/create");
    }
    const handleJoinBtn = () =>{
        setIsOpenEnterDialog(true);
    }
    return (
        <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
            <Header title={
                    "그룹 관리"
            } />

            <div className="w-full h-19 flex justify-end items-center px-4">
                <button className="inline-flex w-30 px-5 py-2.5 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight"
                    onClick={handleCreateBtn}>
                    그룹 만들기
                </button>

                <button className="inline-flex w-[40%] px-5 py-2.5 mx-2 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight"
                    onClick={handleJoinBtn}>
                    임시 초대 수락 버튼
                </button>
            </div>

            <div className="w-full flex flex-col gap-2 px-4">
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenExitDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenExitDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenExitDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenExitDialog} />
            </div>
            <EnterGroupDialog isOpen={isOpenEnterDialog} setIsOpen={setIsOpenEnterDialog} />
            <ExitGroupDialog isOpen={isOpenExitDialog} setIsOpen={setIsOpenExitDialog} />
        </div>
    )
}