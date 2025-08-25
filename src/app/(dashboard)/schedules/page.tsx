"use client"

import Search from "@/assets/svgs/icons/search.svg";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";
import { useState } from "react";
import { ScheduleItem } from "./ScheduleItem";

export default function SchedulePage() {
    const [conditionOpen, setConditionOpen] = useState(false);
    return (
        <div className="flex flex-col w-full flex-1 bg-gray-1">
            <div className="flex flex-col w-full bg-[#F9F9F9] px-4 py-4 gap-2.5">
                <div className="w-full h-11 flex justify-start items-center py-1.5 px-2 gap-3 bg-white rounded-[32px]">
                    <Search className="w-6 h-6" />
                    <input placeholder="키워드로 검색할 수 있어요." />
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
                                <Checked/>
                                <p>
                                    전체
                                </p>
                            </button>
                            <button className="flex">
                                <Checked/>
                                <p>
                                    약속 제목
                                </p>
                            </button>
                            <button className="flex">
                                <Checked/>
                                <p>
                                    참여 인원
                                </p>
                            </button>
                            <button className="flex">
                                <Unchecked/>
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
                    <button className="bg-white rounded-lg outline-1 outline-offset-[-1px] outline-neutral-200 px-2 py-1 text-sm text-gray-3 font-medium leading-tight">
                        전체
                    </button>

                    <div className="flex flex-col gap-2">
                        <button className="flex flex-col">
                            <div className="w-10 h-10 bg-stone-50 rounded-lg border border-neutral-200" />
                            <p>
                                팀 1
                            </p>
                        </button>

                        <button className="flex flex-col">
                            <div className="w-10 h-10 bg-stone-50 rounded-lg border border-neutral-200" />
                            <p>
                                팀 1
                            </p>
                        </button>

                        <button className="flex flex-col">
                            <div className="w-10 h-10 bg-stone-50 rounded-lg border border-neutral-200" />
                            <p>
                                팀 1
                            </p>
                        </button>
                    </div>

                </div>

                <div className="flex flex-col">
                    <ScheduleItem type={"스터디"} title={"합주"} date={"5/4 (토)  09:00~12:00"} />
                    <ScheduleItem type={"스터디"} title={"합주"} date={"5/4 (토)  09:00~12:00"} />
                    <ScheduleItem type={"스터디"} title={"합주"} date={"5/4 (토)  09:00~12:00"} />
                    <ScheduleItem type={"스터디"} title={"합주"} date={"5/4 (토)  09:00~12:00"} />
                </div>
            </div>

        </div>
    )
}