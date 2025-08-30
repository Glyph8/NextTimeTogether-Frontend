"use client"

import Header from "@/components/ui/header/Header";
import Link from "next/link";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg"
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg"
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import Plus from "@/assets/svgs/icons/plus-gray.svg"
import { GroupScheduleItem } from "./GroupScheduleItem";
import { GroupMemberItem } from "./GroupMemberItem";
import { useState } from "react";
import { GroupInviteDialog } from "./GroupInviteDialog";
import { useRouter } from "next/navigation";


export default function DetailGroupPage() {
    const router = useRouter()
    
    const [openOngoing, setOpenOngoing] = useState(true);
    const [openFixed, setOpenFixed] = useState(true);
    const [inviteModal, setInviteModal] = useState(false);

    return (
        <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
            <Header
                leftChild={
                    <Link href={"/groups"}>
                        <ArrowLeft />
                    </Link>
                }
                title={
                        "소프트웨어공학 2조"
                } />
            <div className="flex flex-col justify-center items-center gap-5 text-black-1 pt-7 pb-5">
                {/* <Image src={"https://placehold.co/64x64"} alt="팀" width={64} height={64}
                                    className="border-gray-1 rounded-[8px]" /> */}
                <div className="w-16 h-16 bg-amber-500 border-gray-1 rounded-[8px]" />
                <span className="text-gray-1 text-sm font-normal leading-tight">
                    소프트웨어공학 2조
                </span>
            </div>

            <div className="flex flex-col px-4 gap-4 pb-3">
                <div className="flex justify-between">
                    <div className="justify-start text-black-1 text-lg font-medium leading-tight px-1">
                        내 약속
                    </div>
                    <button onClick={()=>router.push("/schedules/create")}>
                        <Plus />
                    </button>
                </div>
                <div>
                    <button className="flex justify-start items-center text-gray-1 text-sm font-medium leading-none px-1"
                        onClick={() => setOpenOngoing(!openOngoing)}>
                        약속 정하는 중
                        {
                         openOngoing ? <ArrowDown /> : <ArrowUp/>
                        }
                    </button>

                    {openOngoing && (
                        <div className="flex flex-col gap-2">
                            <GroupScheduleItem category={"스터디"} title={"주제 정하기"} place="학교" />
                            <GroupScheduleItem category={"스터디"} title={"내용 정하기"} time="10/12 (토)  09:00~12:00" attendees="온라인" />
                            <GroupScheduleItem category={"식사"} title={"하기"} time="10/12 (토)  09:00~12:00" attendees="오프라인" place="카페온더플랜" />
                        </div>
                    )}

                </div>

                <div>
                    <button className="flex justify-start items-center text-gray-1 text-sm font-medium leading-none px-1"
                        onClick={() => setOpenFixed(!openFixed)}>
                        약속 확정 완료
                        {
                         openFixed ? <ArrowDown /> : <ArrowUp/>
                        }
                    </button>
                    {openFixed && (
                        <div className="flex flex-col gap-2">
                            <GroupScheduleItem category={"스터디"} title={"주제 정하기"} place="학교" />
                            <GroupScheduleItem
                                category={"스터디"}
                                title={"내용 정하기"}
                                time="10/12 (토) 09:00~12:00"
                                attendees="온라인"
                            />
                            <GroupScheduleItem
                                category={"식사"}
                                title={"하기"}
                                time="10/12 (토) 09:00~12:00"
                                attendees="오프라인"
                                place="카페온더플랜"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col px-4 gap-4 pb-7">
                <div className="flex justify-between px-1 py-2">
                    <div className="flex gap-2 items-center">
                        <div className="justify-start text-black-1 text-lg font-medium leading-tight">
                            그룹원
                        </div>
                        <span className="text-gray-2 text-sm font-medium leading-tight">
                            8 / 30
                        </span>
                    </div>
                    <button onClick={() => setInviteModal(true)}>
                        <Plus />
                    </button>
                </div>

                <div className="flex p-4 bg-white gap-2">
                    <GroupMemberItem marker={["사용자"]} name={"김나박이"} />
                    <GroupMemberItem marker={["그룹장"]} name={"가나다람바사아자차카파타하"} />
                    <GroupMemberItem marker={["사용자", "그룹장"]} name="둘다" />
                    <GroupMemberItem name={"먼데이"} />
                </div>
            </div>
            <GroupInviteDialog isOpen={inviteModal} setIsOpen={setInviteModal} />
        </div>
    )
}