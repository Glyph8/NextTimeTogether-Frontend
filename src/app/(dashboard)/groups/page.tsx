"use client"

import Header from "@/components/ui/header/Header";
import { GroupItem } from "./GroupItem";
import { ExitGroupDialog } from "./ExitGroupDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
    const router = useRouter();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const handleCreateBtn = () => {
        router.push("/groups/create");
    }
    return (
        <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
            <Header title={
                <h1 className="text-center text-lg font-medium leading-tight">
                    그룹 관리
                </h1>
            } />

            <div className="w-full h-19 flex justify-end items-center px-4">
                <button className="inline-flex w-30 px-5 py-2.5 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight"
                    onClick={handleCreateBtn}>
                    그룹 만들기
                </button>
            </div>

            <div className="w-full flex flex-col gap-2 px-4">
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenDialog} />
                <GroupItem image={"https://placehold.co/64x64"} title={"팀1"} description={"2024-2학기 소프트웨어공학 팀플"}
                    members={"김OO, 김OO, 박OO, 이OO"} setIsOpen={setIsOpenDialog} />
            </div>
            <ExitGroupDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
        </div>
    )
}