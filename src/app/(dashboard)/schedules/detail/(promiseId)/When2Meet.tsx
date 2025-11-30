import { useState, useMemo } from "react";
import { MemberCountPalette } from "./when-components/MemberCountPalette";
import { TimeTableGrid } from "./when-components/TimeTableGrid";
import { Button } from "@/components/ui/button/Button";
import TimeSlotDialog from "./when-components/TimeSlotDialog";
import {
  TimeApiResponse,
  dummyMyScheduleData,
  dummyMemberData,
  dummyTimeUsersData,
} from "./when-components/types";
import {
  convertApiDataToGridFormat,
  generateDateHeaders,
  convertScheduleIdsToDisabledSlots,
} from "./when-components/utils";

interface When2MeetProps {
  promiseId: string;
  timeData: TimeApiResponse;
}

export const When2Meet = ({ promiseId, timeData }: When2MeetProps) => {
  // 전체 멤버 수 계산 (API: /promise/member/{promiseId})
  const totalMembers = useMemo(() => dummyMemberData.result.userIds.length, []);

  // Convert API data to grid format
  const { data: groupData, maxCount } = useMemo(
    () => convertApiDataToGridFormat(timeData, totalMembers),
    [timeData, totalMembers]
  );

  const { dates, days } = useMemo(
    () =>
      generateDateHeaders(
        timeData.result.timeRange.startDateTime,
        timeData.result.timeRange.endDateTime
      ),
    [timeData]
  );

  // State for my schedule (30분 단위, 9:00~24:00 = 30 slots)
  const [mySelection, setMySelection] = useState<boolean[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(30).fill(false))
  );

  // State for disabled slots (내 캘린더 일정)
  const [disabledSlots, setDisabledSlots] = useState<boolean[][] | undefined>(
    undefined
  );

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    dayIndex: number;
    timeIndex: number;
  } | null>(null);

  // Handle cell click in group timetable
  const handleCellClick = (dayIndex: number, timeIndex: number) => {
    // dummyTimeUsersData에서 해당 시간대의 사용자 정보 조회
    const dateStr = timeData.result.timeRange.startDateTime;
    const startDate = new Date(dateStr);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayIndex);
    const dateKey = targetDate.toISOString().split("T")[0]; // "2025-11-29"

    // timeIndex를 시간으로 변환 (9:00 = 0, 9:30 = 1, ...)
    const hour = 9 + Math.floor(timeIndex / 2);
    const minute = timeIndex % 2 === 0 ? 0 : 30;
    const timeKey = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`;

    const key = `${dateKey}_${timeKey}`;
    const userData = dummyTimeUsersData[key];

    // 데이터가 있을 때만 다이얼로그 열기 (count > 0인 시간대만)
    if (userData) {
      setSelectedSlot({ dayIndex, timeIndex });
      setDialogOpen(true);
    }
  };

  // Get dialog data
  const getDialogData = () => {
    if (!selectedSlot) {
      return {
        date: "",
        time: "",
        dayOfWeek: "",
        availableUsers: [],
        unavailableUsers: [],
      };
    }

    const { dayIndex, timeIndex } = selectedSlot;

    // 날짜 계산
    const dateStr = timeData.result.timeRange.startDateTime;
    const startDate = new Date(dateStr);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayIndex);
    const dateKey = targetDate.toISOString().split("T")[0]; // "2025-11-29"

    // 시간 계산
    const hour = 9 + Math.floor(timeIndex / 2);
    const minute = timeIndex % 2 === 0 ? 0 : 30;
    const timeKey = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:00`;

    const key = `${dateKey}_${timeKey}`;
    const userData = dummyTimeUsersData[key];

    return {
      date: dateKey,
      time: timeKey,
      dayOfWeek: days[dayIndex],
      availableUsers: userData?.result.availableUsers || [],
      unavailableUsers: userData?.result.unavailableUsers || [],
    };
  };

  const dialogData = getDialogData();

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Group Schedule Section */}
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
            dates={dates}
            days={days}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* Time Slot Dialog */}
      <TimeSlotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={dialogData.date}
        time={dialogData.time}
        dayOfWeek={dialogData.dayOfWeek}
        availableUsers={dialogData.availableUsers}
        unavailableUsers={dialogData.unavailableUsers}
      />

      <div className="h-2 bg-[#F9F9F9]" />

      {/* My Schedule Section */}
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

        <div className="flex w-full gap-2 mt-6">
          <button
            className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50"
            onClick={() => {
              // 토글: 이미 불러온 상태면 해제, 아니면 불러오기
              if (disabledSlots) {
                setDisabledSlots(undefined);
              } else {
                const disabled = convertScheduleIdsToDisabledSlots(
                  dummyMyScheduleData.result.scheduleIds,
                  timeData.result.timeRange.startDateTime,
                  timeData.result.timeRange.endDateTime
                );
                setDisabledSlots(disabled);
              }
            }}
          >
            {disabledSlots ? "캘린더 해제" : "캘린더 불러오기"}
          </button>
          <button className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50">
            우선순위 설정하기
          </button>
        </div>

        <div className="w-full mt-2 flex justify-center">
          <Button
            text="저장"
            onClick={() => console.log("Save", mySelection)}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
