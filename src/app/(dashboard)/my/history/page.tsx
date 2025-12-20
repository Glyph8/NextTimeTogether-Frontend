"use client";

import Search from "@/assets/svgs/icons/search.svg";
import Header from "@/components/ui/header/Header";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ScheduleItem } from "../../appointment/components/ScheduleItem";
import { useSchedules } from "../../appointment/hooks/useSchedules";
import { generateThreeMonthsRange } from "./utils/histroy-range";
import { RatingDialog } from "./components/RatingDialog";
import Link from "next/link";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";
import { UnratedScheduleItem } from "./components/UnratedScheduleItem";

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  // 상태 관리
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [selectedScheduleIsRated, setSelectedScheduleIsRated] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const month3 = generateThreeMonthsRange();

  // 2. 약속(스케줄) 리스트 조회 [핵심 변경 사항]
  const { data: schedulesData, isPending: isSchedulesLoading } = useSchedules({
    keyword: keyword,
    targetDates: month3, // 만약 특정 날짜들만 조회하고 싶다면 담아서 사용 (없으면 이번 달 전체)
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setKeyword(inputValue);
    }
  };

  if (isSchedulesLoading) {
    return <DefaultLoading />;
  }

  const scheduleList =
    schedulesData?.result?.promiseResDTOList ||
    (Array.isArray(schedulesData?.result) ? schedulesData.result : []) ||
    [];

  return (
    <div className="flex flex-col w-full flex-1 bg-gray-1">
      {!!selectedScheduleId && (
        <RatingDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          scheduleId={selectedScheduleId ?? ""}
          isRated={selectedScheduleIsRated}
          onRateSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
          }}
        />
      )}

      <Header
        leftChild={
          <Link href={"/my"}>
            <ArrowLeft />
          </Link>
        }
        title={"히스토리"} />

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
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {scheduleList.length > 0 ? (
          scheduleList.map((schedule: any) => (
            <>
              {
                schedule.isRated ? (
                  <ScheduleItem
                    key={schedule.scheduleId} // 고유 ID 사용 확인
                    type={schedule.purpose || "약속"}
                    title={schedule.title}
                    date={schedule.date || "날짜 미정"} // DTO에 date 필드가 있는지 확인 필요
                    setIsOpen={() => {
                      setIsOpenDialog(true);
                      setSelectedScheduleId(schedule.scheduleId);
                      setSelectedScheduleIsRated(schedule.isRated);
                    }}
                  />
                ) : (
                  <UnratedScheduleItem
                    key={schedule.scheduleId} // 고유 ID 사용 확인
                    type={schedule.purpose || "약속"}
                    title={schedule.title}
                    date={schedule.date || "날짜 미정"} // DTO에 date 필드가 있는지 확인 필요
                    setIsOpen={() => {
                      setIsOpenDialog(true);
                      setSelectedScheduleId(schedule.scheduleId);
                      setSelectedScheduleIsRated(schedule.isRated);
                    }}
                  />
                )
              }
            </>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            약속 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
