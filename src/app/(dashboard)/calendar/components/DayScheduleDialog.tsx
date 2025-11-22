"use client";

import React from "react";
// --- 1. useRouter 삭제 ---
// import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  date: Date | null;
  events: CalendarEvent[];
  // --- 2. '일정 추가' 클릭 시 호출될 콜백 함수 prop 추가 ---
  onAddScheduleClick: (date: Date) => void;
  // --- 일정 클릭 시 수정 드로워 열기 ---
  onEventClick: (event: CalendarEvent) => void;
}

export function DayScheduleDialog({
  isOpen,
  setIsOpen,
  date,
  events,
  onAddScheduleClick, // 3. prop 받기
  onEventClick,
}: Props) {
  // --- 4. useRouter 삭제 ---
  // const router = useRouter();

  if (!date) return null;

  const formattedDate = format(date, "M월 d일 (E)", { locale: ko });

  // --- 5. 핸들러 수정 ---
  const handleAddSchedule = () => {
    // router.push 대신,
    onAddScheduleClick(date); // 1. 부모에게 알림
    setIsOpen(false); // 2. 자신(모달)은 닫음
  };
  // --- --- --- --- ---

  const getEventColorDot = (color?: string) => {
    const colorMap: { [key: string]: string } = {
      salmon: "bg-rose-400",
      orange: "bg-orange-400",
      yellow: "bg-yellow-400",
      lightPurple: "bg-purple-400",
      darkPurple: "bg-indigo-500",
      blue: "bg-blue-500",
      default: "bg-orange-400",
    };

    const eventColor = color
      ? colorMap[color] || colorMap["default"]
      : colorMap["default"];

    return (
      <div
        className={`w-2.5 h-2.5 rounded-full ${eventColor} mr-3 flex-shrink-0 mt-1`}
      ></div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px] w-[90%] rounded-lg"
        showCloseButton={false}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-bold text-center text-gray-900">
            {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[280px] space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="flex cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => {
                  onEventClick(event);
                  setIsOpen(false);
                }}
              >
                {getEventColorDot(event.color)}
                <div>
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {event.allDay
                      ? "하루 종일"
                      : event.startTime && event.endTime
                      ? `${event.startTime} ~ ${event.endTime}`
                      : event.startTime
                      ? event.startTime
                      : "시간 정보 없음"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">일정이 없습니다.</p>
          )}
        </div>

        <DialogFooter className="border-t border-gray-100 pt-6 mt-2">
          {/* 이제 이 버튼은 handleAddSchedule을 호출 (수정된 로직) */}
          <button
            onClick={handleAddSchedule}
            className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            일정 추가
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
