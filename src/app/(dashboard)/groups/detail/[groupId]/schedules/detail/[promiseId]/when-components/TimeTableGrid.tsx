"use client";

import React, { useState, useEffect } from "react";

interface TimeTableGridProps {
  mode: "view" | "select";
  data?: number[][]; // [dayIndex][timeIndex] -> count
  mySelection?: boolean[][]; // [dayIndex][timeIndex] -> isSelected
  onChange?: (selection: boolean[][]) => void;
  maxMembers?: number;
  dates?: string[]; // ["11/29", "11/30", ...]
  days?: string[]; // ["금", "토", ...]
  disabledSlots?: boolean[][]; // [dayIndex][timeIndex] -> true = 비활성화 (내 일정 있음)
  onCellClick?: (dayIndex: number, timeIndex: number) => void; // view 모드에서 셀 클릭 시
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DEFAULT_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DEFAULT_DATES = [
  "10/7",
  "10/8",
  "10/9",
  "10/10",
  "10/11",
  "10/12",
  "10/13",
];
const START_TIME = 9;
const END_TIME = 24;
// 30분 단위로 분할 (9:00, 9:30, 10:00, ...)
const TIME_SLOTS = Array.from(
  { length: (END_TIME - START_TIME) * 2 },
  (_, i) => {
    const hour = START_TIME + Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return {
      hour,
      minute,
      label: `${hour}:${minute.toString().padStart(2, "0")}`,
    };
  }
);

export const TimeTableGrid = ({
  mode,
  data,
  mySelection,
  onChange,
  maxMembers = 5,
  dates = DEFAULT_DATES,
  days = DEFAULT_DAYS,
  disabledSlots,
  onCellClick,
  onDragStart,
  onDragEnd,
}: TimeTableGridProps) => {
  const DAYS = days;
  const DATES = dates;
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<{
    day: number;
    time: number;
  } | null>(null);
  const [currentCell, setCurrentCell] = useState<{
    day: number;
    time: number;
  } | null>(null);

  // Initialize selection if not provided
  const [internalSelection, setInternalSelection] = useState<boolean[][]>(
    mySelection ||
    Array(7)
      .fill(null)
      .map(() => Array(TIME_SLOTS.length).fill(false))
  );

  useEffect(() => {
    if (mySelection) {
      setInternalSelection(mySelection);
    }
  }, [mySelection]);

  const handlePointerDown = (
    day: number,
    time: number,
    e: React.PointerEvent
  ) => {
    // 이벤트 전파 방지 (Dialog로 이벤트가 전파되는 것을 막음)
    e.stopPropagation();

    // view 모드에서는 클릭 핸들러 호출
    if (mode === "view") {
      if (onCellClick) {
        onCellClick(day, time);
      }
      return;
    }

    // select 모드
    // 비활성화된 셀은 선택 불가
    if (disabledSlots && disabledSlots[day] && disabledSlots[day][time]) return;

    // 터치 스크롤과의 충돌 방지
    e.preventDefault();

    setIsDragging(true);
    if (onDragStart) onDragStart();
    setStartCell({ day, time });
    setCurrentCell({ day, time });
  };

  const handlePointerEnter = (day: number, time: number) => {
    if (mode !== "select" || !isDragging) return;
    setCurrentCell({ day, time });
  };

  const handlePointerUp = () => {
    if (isDragging) {
      if (onDragEnd) onDragEnd(); // -> 부모가 Polling 재개
    }

    if (mode !== "select" || !isDragging || !startCell || !currentCell) {
      // 드래그 중이 아니었어도 상태 초기화를 위해 리턴 전 cleanup은 필요할 수 있음
      // 여기서는 기존 로직 흐름상 리턴해도 무방하지만,
      // isDragging을 false로 확실히 꺼주는 것이 안전합니다.
      setIsDragging(false);
      return;
    }
    // Apply changes
    const newSelection = internalSelection.map((d) => [...d]);
    const minDay = Math.min(startCell.day, currentCell.day);
    const maxDay = Math.max(startCell.day, currentCell.day);
    const minTime = Math.min(startCell.time, currentCell.time);
    const maxTime = Math.max(startCell.time, currentCell.time);

    // Determine toggle state based on the start cell
    // If start cell was selected, we deselect the range. If not, we select.
    // Actually, standard behavior is usually: if start cell is false, turn all to true. If true, turn all to false.
    const startValue = internalSelection[startCell.day][startCell.time];
    const newValue = !startValue;

    for (let d = minDay; d <= maxDay; d++) {
      for (let t = minTime; t <= maxTime; t++) {
        // 비활성화된 셀은 건너뛸
        if (disabledSlots && disabledSlots[d] && disabledSlots[d][t]) continue;
        newSelection[d][t] = newValue;
      }
    }

    setInternalSelection(newSelection);
    if (onChange) onChange(newSelection);

    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  };

  // Calculate background color
  const getCellStyle = (day: number, time: number) => {
    // 비활성화된 슬롯은 회색으로 표시
    const isDisabled =
      disabledSlots && disabledSlots[day] && disabledSlots[day][time];

    if (mode === "view") {
      if (isDisabled) {
        return {
          backgroundColor: "#E5E5E5", // 회색 (내 일정 있음)
        };
      }
      const count = data ? data[day][time] : 0;
      const opacity = count === 0 ? 0 : count / maxMembers;
      return {
        backgroundColor:
          count === 0 ? "transparent" : `rgba(139, 92, 246, ${opacity})`, // violet-500
      };
    } else {
      // Select mode
      if (isDisabled) {
        return {
          backgroundColor: "#E5E5E5", // 회색 (내 일정 있음)
          cursor: "not-allowed",
        };
      }

      let isSelected = internalSelection[day][time];

      // Apply drag preview
      if (isDragging && startCell && currentCell) {
        const minDay = Math.min(startCell.day, currentCell.day);
        const maxDay = Math.max(startCell.day, currentCell.day);
        const minTime = Math.min(startCell.time, currentCell.time);
        const maxTime = Math.max(startCell.time, currentCell.time);

        if (
          day >= minDay &&
          day <= maxDay &&
          time >= minTime &&
          time <= maxTime
        ) {
          const startValue = internalSelection[startCell.day][startCell.time];
          isSelected = !startValue;
        }
      }

      return {
        backgroundColor: isSelected ? "#FBBF24" : "transparent", // amber-400 for "My" selection (yellowish in image)
      };
    }
  };

  return (
    <div
      className="w-full select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Header Dates */}
      <div className="flex pl-10 mb-2">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className="flex-1 flex flex-col items-center justify-center text-xs text-gray-500"
          >
            <span>{DATES[i]}</span>
            <span>{day}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="relative border-t border-gray-200">
        {TIME_SLOTS.map((slot, timeIndex) => (
          <div
            key={timeIndex}
            className="flex h-8 border-b border-gray-100 border-dashed last:border-b"
          >
            {/* Time Label - 정시만 표시 (30분은 빈값) */}
            <div className="w-10 -mt-2 text-[10px] text-gray-400 text-right pr-2">
              {slot.minute === 0 ? `${slot.hour}:00` : ""}
            </div>
            {/* Cells */}
            {DAYS.map((_, dayIndex) => (
              <div
                key={`${dayIndex}-${timeIndex}`}
                className="flex-1 border-r border-gray-100 border-dashed last:border-r-0 cursor-pointer transition-colors duration-75"
                style={{
                  ...getCellStyle(dayIndex, timeIndex),
                  touchAction: "none",
                }}
                data-day={dayIndex}
                data-time={timeIndex}
                onPointerDown={(e) => handlePointerDown(dayIndex, timeIndex, e)}
                onPointerEnter={() => handlePointerEnter(dayIndex, timeIndex)}
              />
            ))}
          </div>
        ))}
        {/* Last time label for 24:00 */}
        <div className="flex">
          <div className="w-10 -mt-2 text-[10px] text-gray-400 text-right pr-2">
            24:00
          </div>
        </div>
      </div>
    </div>
  );
};
