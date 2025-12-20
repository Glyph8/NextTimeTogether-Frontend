"use client";

import toast from "react-hot-toast";

import { useState, useMemo } from "react";
// Components
import { MemberCountPalette } from "./when-components/MemberCountPalette";
import { TimeTableGrid } from "./when-components/TimeTableGrid";
import { Button } from "@/components/ui/button/Button";
import TimeSlotDialog from "./when-components/TimeSlotDialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

// Hooks & Utils

import {
  convertApiDataToGridFormat,
  generateDateHeaders,
  convertScheduleIdsToDisabledSlots,
  convertGridToApiPayload,
} from "./when-components/utils";

// Types & Dummy Data (for calendar feature)
import { EncryptedPromiseMemberId } from "@/api/promise-view-create";
import { dummyMyScheduleData } from "./when-components/types";
import { usePromiseTime, useTimeSlotDetail } from "./when-components/use-promise-time";

interface When2MeetProps {
  promiseId: string;
  encMemberIdList: EncryptedPromiseMemberId;
}

export const When2Meet = ({ promiseId, encMemberIdList }: When2MeetProps) => {
  const totalMembers = encMemberIdList.userIds.length;

  // --------------------------------------------------------------------------
  // 1. Server State Management (React Query Custom Hook)
  // --------------------------------------------------------------------------
  // UI는 데이터를 어떻게 가져오는지 알 필요가 없습니다. Hook이 모든 것을 처리합니다.
  const { boardQuery, updateMutation } = usePromiseTime(promiseId);
  const { data: timeBoardData, isLoading: isBoardLoading } = boardQuery;

  // --------------------------------------------------------------------------
  // 2. Data Transformation (Derived State)
  // --------------------------------------------------------------------------
  // API 응답 데이터를 UI 그리드 포맷(number[][])으로 변환
  const { data: groupData, maxCount } = useMemo(
    () => convertApiDataToGridFormat(timeBoardData, totalMembers),
    [timeBoardData, totalMembers]
  );

  // 날짜 헤더 생성 (dates: "11/29", days: "금")
  const { dates, days } = useMemo(() => {
    if (!timeBoardData) return { dates: [], days: [] };
    return generateDateHeaders(
      timeBoardData.timeRange.startDateTime,
      timeBoardData.timeRange.endDateTime
    );
  }, [timeBoardData]);

  // --------------------------------------------------------------------------
  // 3. Local UI State
  // --------------------------------------------------------------------------
  // 내 시간표 선택 상태 (7일 x 30슬롯 boolean)
  const [mySelection, setMySelection] = useState<boolean[][]>(
    Array(7).fill(null).map(() => Array(30).fill(false))
  );

  // 캘린더 일정 (비활성화 슬롯) 상태
  const [disabledSlots, setDisabledSlots] = useState<boolean[][] | undefined>(undefined);

  // 상세 조회 다이얼로그 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState<{
    date: string;     // "2025-11-29"
    time: string;     // "09:00:00"
    dayOfWeek: string;// "금"
  } | null>(null);

  // --------------------------------------------------------------------------
  // 4. On-Demand Data Fetching (Time Slot Detail)
  // --------------------------------------------------------------------------
  // 사용자가 셀을 클릭했을 때만 해당 시간대의 상세 정보(참여자 명단)를 가져옵니다.
  const { data: slotDetailData, isLoading: isSlotLoading } = useTimeSlotDetail(
    promiseId,
    selectedSlotInfo ? { date: selectedSlotInfo.date, time: selectedSlotInfo.time } : null
  );

  // --------------------------------------------------------------------------
  // 5. Event Handlers
  // --------------------------------------------------------------------------

  // [VIEW 모드] 그룹 시간표 셀 클릭 핸들러
  const handleCellClick = (dayIndex: number, timeIndex: number) => {
    if (!timeBoardData) return;

    // 인덱스를 실제 API 요청용 날짜/시간 포맷으로 변환
    const startDate = new Date(timeBoardData.timeRange.startDateTime);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayIndex);
    const dateKey = targetDate.toISOString().split("T")[0]; // "2025-11-29"

    const hour = 9 + Math.floor(timeIndex / 2);
    const minute = timeIndex % 2 === 0 ? 0 : 30;
    const timeKey = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`;

    setSelectedSlotInfo({
      date: dateKey,
      time: timeKey,
      dayOfWeek: days[dayIndex],
    });
    setDialogOpen(true);
  };

  // [SELECT 모드] 저장 버튼 클릭 핸들러
  const handleSave = () => {
    if (!timeBoardData) {
      toast.error("데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // API 전송을 위해 UI용 dates("11/29")가 아닌 ISO dates("2025-11-29") 배열 생성
    const startDate = new Date(timeBoardData.timeRange.startDateTime);
    const isoDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    // 1. Adapter Pattern: UI 데이터(Grid) -> API 데이터(DTO) 변환
    const payload = convertGridToApiPayload(mySelection, isoDates);

    // 2. Mutation: 서버로 데이터 전송
    updateMutation.mutate(payload);
  };

  // [SELECT 모드] 캘린더 불러오기 토글 핸들러 - 삭제 권장
  const handleToggleCalendar = () => {
    if (disabledSlots) {
      setDisabledSlots(undefined);
    } else {
      if (!timeBoardData) return;
      // TODO: 실제로는 useQuery로 내 캘린더 데이터를 가져와야 함 (현재는 더미 데이터)
      const disabled = convertScheduleIdsToDisabledSlots(
        dummyMyScheduleData.result.scheduleIds,
        timeBoardData.timeRange.startDateTime,
        timeBoardData.timeRange.endDateTime
      );
      setDisabledSlots(disabled);
    }
  };

  // --------------------------------------------------------------------------
  // 6. Render
  // --------------------------------------------------------------------------
  if (isBoardLoading) return <DefaultLoading />;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* === 섹션 1: 그룹 시간표 (View Mode) === */}
      <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
        <div className="text-center text-black-1 text-lg font-semibold leading-tight">
          그룹 시간표
        </div>
        <div className="text-center text-gray-2 text-sm font-normal leading-tight">
          시간을 클릭하면 누가 체크했는지 볼 수 있어요.
        </div>
        <MemberCountPalette maxCount={maxCount} />

        <div className="w-full mt-4">
          <TimeTableGrid
            mode="view"
            data={groupData}
            maxMembers={maxCount}
            dates={dates} // "11/29" 형식 (Header 표시용)
            days={days}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* === 컴포넌트: 상세 정보 다이얼로그 === */}
      <TimeSlotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={selectedSlotInfo?.date || ""}
        time={selectedSlotInfo?.time || ""}
        dayOfWeek={selectedSlotInfo?.dayOfWeek || ""}
        availableUsers={slotDetailData?.availableUsers || []}
        unavailableUsers={slotDetailData?.unavailableUsers || []}
        isLoading={isSlotLoading} // Dialog 내부에 로딩 처리가 필요하다면 전달
      />

      <div className="h-2 bg-[#F9F9F9]" />

      {/* === 섹션 2: 내 시간표 (Select Mode) === */}
      <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
        <div className="text-center text-black-1 text-lg font-semibold leading-tight">
          내 시간표
        </div>
        <div className="text-center text-gray-2 text-sm font-normal leading-tight">
          가능한 시간대를 드래그해서 표시해주세요.
        </div>

        <div className="w-full mt-4">
          <TimeTableGrid
            mode="select"
            mySelection={mySelection}
            onChange={setMySelection}
            dates={dates}
            days={days}
            disabledSlots={disabledSlots}
          />
        </div>

        {/* 하단 버튼 그룹 */}
        {/* <div className="flex w-full gap-2 mt-6">
          <button
            className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
            onClick={handleToggleCalendar}
          >
            {disabledSlots ? "캘린더 해제" : "캘린더 불러오기"}
          </button>
        </div> */}

        <div className="w-full mt-2 flex justify-center">
          <Button
            text={updateMutation.isPending ? "저장 중..." : "저장"}
            onClick={handleSave}
            disabled={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};