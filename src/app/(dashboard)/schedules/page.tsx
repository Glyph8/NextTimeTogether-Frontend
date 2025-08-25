"use client"

import Search from "@/assets/svgs/icons/search.svg";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";
import { useState } from "react";
import { ScheduleItem } from "./ScheduleItem";
import { TeamItem } from "./TeamItem";
import { scheduleList, teamList } from "./constants";
import { ScheduleDialog } from "./ScheduleDialog";

export default function SchedulePage() {
    const [filterArray, setFilterArray] = useState([
        {
            category: "전체",
            isSelected: true,
        },
        {
            category: "약속 제목",
            isSelected: true,
        },
        {
            category: "참여 인원",
            isSelected: true,
        }
        , {
            category: "장소",
            isSelected: true,
        }
    ]);

    const [conditionOpen, setConditionOpen] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [switches, setSwitches] = useState(
        Array(teamList.length).fill(false)
    );
    const toggleAllValue = switches.every(Boolean);

    const toggleAll = (value: boolean) => {
        setSwitches(Array(switches.length).fill(value));
    };

    const toggleOne = (id: number) => {
        setSwitches((prev) => {
            const copy = [...prev];
            copy[id] = !copy[id];
            return copy;
        });
    };


    return (
        <div className="flex flex-col w-full flex-1 bg-gray-1">
                <ScheduleDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />

            <div className="flex flex-col w-full bg-[#F9F9F9] px-4 py-4 gap-2.5">
                <div className="w-full h-11 flex justify-start items-center py-1.5 px-2 gap-3 bg-white rounded-[32px]
                focus:border-b-main">
                    <Search className="w-6 h-6" />
                    <input placeholder="키워드로 검색할 수 있어요." className="w-full focus:border-main focus:border-1" />
                </div>
                <button className="flex items-center" onClick={() => setConditionOpen(!conditionOpen)}>
                    <p className="text-gray-1 text-sm font-medium leading-none">
                        검색 조건
                    </p>
                    {
                        conditionOpen ? <ArrowUp className="w-6 h-6" /> : <ArrowDown className="w-6 h-6" />
                    }
                </button>
                {/* map으로 리팩토링할 것 */}
                {
                    conditionOpen && (
                        <div className="flex w-full gap-2">
                            <button className="flex">
                                <Checked />
                                <p>
                                    전체
                                </p>
                            </button>
                            <button className="flex">
                                <Checked />
                                <p>
                                    약속 제목
                                </p>
                            </button>
                            <button className="flex">
                                <Checked />
                                <p>
                                    참여 인원
                                </p>
                            </button>
                            <button className="flex">
                                <Unchecked />
                                <p>
                                    장소
                                </p>
                            </button>
                        </div>
                    )
                }
            </div>

            <div className="flex-1 flex flex-row bg-white">
                <div className="flex flex-col border-r-1 border-[#F1F1F1] px-5 py-4 gap-4">
                    {
                        true ? (
                            <button className="bg-white rounded-lg outline-1 outline-offset-[-1px] outline-main px-2 py-1 text-sm text-main font-medium leading-tight"
                            >
                                전체
                            </button>
                        ) : (
                            <button className="bg-white rounded-lg outline-1 outline-offset-[-1px] outline-gray-3 px-2 py-1 text-sm text-gray-3 font-medium leading-tight"
                            >
                                전체
                            </button>
                        )
                    }

                    <div className="flex flex-col gap-2">
                        {
                            teamList.map((team) => {
                                return <TeamItem isSelected={false} title={team.title} image={team.image} key={team.title} />
                            })
                        }
                    </div>
                </div>

                <div className="flex flex-col">
                    {
                        scheduleList.map((schedule) => {
                            return <ScheduleItem type={schedule.type} title={schedule.title} date={schedule.date} setIsOpen={setIsOpenDialog} key={schedule.title} />
                        })
                    }
                </div>
            </div>

        </div>
    )
}