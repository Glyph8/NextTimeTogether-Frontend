"use client"

import Search from "@/assets/svgs/icons/search.svg";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";
import { useEffect, useState } from "react"; // useMemo 제거 (현재 사용 안함)
import Header from "@/components/ui/header/Header";
import { useDecryptedGroupList } from "../groups/use-group-list";
import { useSchedules } from "./hooks/useSchedules";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { ScheduleDialog } from "./components/ScheduleDialog";
import { ScheduleItem } from "./components/ScheduleItem";
import { TeamItem } from "./components/TeamItem";
import { DEFAULT_IMAGE } from "@/constants";


type FilterType = "전체" | "약속 제목" | "참여 인원" | "장소";

export default function SchedulePage() {
    const [conditionOpen, setConditionOpen] = useState(false);
    const [isOpenDialog, setIsOpenDialog] = useState(false);

    // 상태 관리
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

    const [keyword, setKeyword] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");

    // 현재는 훅 내부에서 자동으로 이번 달을 사용하도록 처리해둠. 추후 날짜 범위 선택 방법 추가 필요
    // const [currentDate, setCurrentDate] = useState(new Date()); 
    // 1. 그룹 리스트 조회
    const { data: groupList, isPending: isGroupsLoading } = useDecryptedGroupList();

    // 2. 약속(스케줄) 리스트 조회 [핵심 변경 사항]
    const { data: schedulesData, isPending: isSchedulesLoading } = useSchedules({
        groupId: selectedGroupId,
        keyword: keyword,
        // targetDates: [] // 만약 특정 날짜들만 조회하고 싶다면 담아서 사용 (없으면 이번 달 전체)
    });

    const isValidUrl = (url: string) => {
        try {
            return url.startsWith('http') || url.startsWith('/');
        } catch {
            return false;
        }
    };

    const [filterArray, setFilterArray] = useState<{ category: FilterType, isSelected: boolean }[]>([
        { category: "전체", isSelected: true },
        { category: "약속 제목", isSelected: true },
        { category: "참여 인원", isSelected: true },
        { category: "장소", isSelected: true }
    ]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setKeyword(inputValue);
        }
    };

    if (isSchedulesLoading) {
        return <DefaultLoading />;
    }

    const scheduleList = schedulesData?.result?.promiseResDTOList ||
        (Array.isArray(schedulesData?.result) ? schedulesData.result : []) ||
        [];

    return (
        <div className="flex flex-col w-full flex-1 bg-gray-1">
            <ScheduleDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} scheduleId={selectedScheduleId ?? ""} />
            <Header title={"약속 일정"} />

            <div className="flex flex-col w-full bg-[#F9F9F9] px-4 py-4 gap-2.5">
                <div className="w-full h-11 flex justify-start items-center py-1.5 px-2 gap-3 bg-white rounded-[32px] focus-within:border-b-main border border-transparent">
                    <Search className="w-6 h-6" />
                    <input
                        placeholder="키워드로 검색할 수 있어요."
                        className="w-full outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <button className="flex items-center" onClick={() => setConditionOpen(!conditionOpen)}>
                    <p className="text-gray-1 text-sm font-medium leading-none">검색 조건</p>
                    {conditionOpen ? <ArrowUp className="w-6 h-6" /> : <ArrowDown className="w-6 h-6" />}
                </button>
                {conditionOpen && (
                    <div className="flex w-full gap-2">
                        {filterArray.map((filter, idx) => (
                            <button key={idx} className="flex items-center gap-1">
                                {filter.isSelected ? <Checked className="w-6 h-6" /> : <Unchecked className="w-6 h-6" />}
                                <p>{filter.category}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-row bg-white">
                <div className="flex flex-col items-center border-r-1 border-[#F1F1F1] px-5 py-4 gap-4 w-[120px] min-w-[120px]">
                    <button
                        className={`bg-white rounded-lg outline-1 outline-offset-[-1px] ${selectedGroupId === null ? "outline-main text-main" : "outline-gray-3 text-gray-3"} px-2 py-1 text-sm font-medium leading-tight`}
                        onClick={() => setSelectedGroupId(null)}
                    >
                        전체
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        {isGroupsLoading ? (
                            <div className="text-xs text-center text-gray-400">Loading...</div>
                        ) : (
                            groupList?.map((group) => (
                                <div key={group.groupId} onClick={() => setSelectedGroupId(group.groupId)}>
                                    <TeamItem
                                        isSelected={selectedGroupId === group.groupId}
                                        title={group.groupName}
                                        image={isValidUrl(group.groupImg) ? group.groupImg : DEFAULT_IMAGE}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 오른쪽 메인: 약속 리스트 */}
                <div className="flex flex-col flex-1 p-4">
                    {scheduleList.length > 0 ? (
                        scheduleList.map((schedule: any) => (
                            <ScheduleItem
                                key={schedule.scheduleId} // 고유 ID 사용 확인
                                type={schedule.purpose || "약속"}
                                title={schedule.title}
                                date={schedule.date || "날짜 미정"} // DTO에 date 필드가 있는지 확인 필요
                                setIsOpen={() => {
                                    setIsOpenDialog(true);
                                    setSelectedScheduleId(schedule.scheduleId);
                                }}
                            />
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            약속 일정이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}