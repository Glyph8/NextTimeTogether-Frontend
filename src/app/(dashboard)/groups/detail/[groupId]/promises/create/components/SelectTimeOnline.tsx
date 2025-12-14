import React, { useState } from "react";
import DateTimePicker from "./DateTimePicker";
import { DateTimeValue, SchedulePeriod } from "../hooks/use-create-promise";

type FieldType = "start" | "end";

interface SelectScheduleProps {
  schedule: SchedulePeriod;
  onScheduleChange: (type: FieldType, value: DateTimeValue) => void;
}

export default function SelectSchedule({ schedule, onScheduleChange }: SelectScheduleProps) {
  const [focusedField, setFocusedField] = useState<FieldType>("start");

  // 현재 포커스에 따른 하이라이팅 로직
  const isHighlighted = (field: FieldType) => {
    if (focusedField === field) return true;
    if (focusedField === "end" && field === "start") return true; // 종료 설정 중일 때 시작은 이미 완료됨
    return false;
  };

  // 날짜+시간 포맷팅 헬퍼
  const formatDisplay = (val: DateTimeValue) => {
    return `${val.year}. ${val.month}. ${val.day}. ${val.ampm} ${val.hour}:${val.minute}`;
  };

  return (
    <div className="py-4">
      <nav className="text-black-1 text-xl font-medium leading-8 pb-5">
        <p>약속 시간을</p>
        <p>설정해주세요.</p>
      </nav>

      {/* 탭 영역 */}
      <div className="flex flex-col gap-4">
        {/* 시작 시간 탭 */}
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setFocusedField("start")}
        >
          <span className="text-sm text-gray-500">시작</span>
          <span className={`text-lg font-medium transition-colors ${
            isHighlighted("start") ? "text-main" : "text-gray-400"
          }`}>
            {formatDisplay(schedule.start)}
          </span>
        </div>

        {/* 종료 시간 탭 */}
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setFocusedField("end")}
        >
          <span className="text-sm text-gray-500">종료</span>
          <span className={`text-lg font-medium transition-colors ${
            isHighlighted("end") ? "text-main" : "text-gray-400"
          }`}>
            {formatDisplay(schedule.end)}
          </span>
        </div>
      </div>

      {/* 통합 휠 피커 영역 */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <DateTimePicker
          value={schedule[focusedField]} // 현재 포커스된 데이터(Start or End) 전체를 전달
          onChange={(newValue) => onScheduleChange(focusedField, newValue)}
        />
      </div>
    </div>
  );
}