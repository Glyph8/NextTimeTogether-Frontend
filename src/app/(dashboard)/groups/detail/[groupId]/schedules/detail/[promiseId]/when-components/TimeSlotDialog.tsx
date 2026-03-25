"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";

interface TimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string; // "2025-11-29"
  time: string; // "18:00:00"
  dayOfWeek: string; // "금"
  availableUsers: string[];
  unavailableUsers: string[];
  isLoading: boolean;
}

export default function TimeSlotDialog({
  open,
  onOpenChange,
  date,
  time,
  dayOfWeek,
  availableUsers,
  unavailableUsers,
  isLoading,
}: TimeSlotDialogProps) {
  // "2025-11-29" -> "10/13"
  const formatDate = (dateStr: string) => {
    const [, month, day] = dateStr.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  };

  // "18:00:00" -> "09:00"
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  if (isLoading) {
    return <DefaultLoading isFullScreen={false} />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="w-[90vw] max-w-lg rounded-2xl p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="pt-6 pb-4 px-6">
          <DialogTitle className="text-center text-lg font-semibold">
            {formatDate(date)} ({dayOfWeek}) {formatTime(time)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            해당 시간대에 가능한 사람과 불가능한 사람 목록을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* Body - 좌우 배치 */}
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 시간 돼요 섹션 */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                시간 돼요
              </h3>
              <div className="space-y-2 overflow-y-auto max-h-60">
                {availableUsers.length === 0 ? (
                  <p className="text-sm text-gray-400">없음</p>
                ) : (
                  availableUsers.map((user, index) => (
                    <div
                      key={`available-${index}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">👤</span>
                      </div>
                      <span className="text-sm truncate">{user}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 시간 안 돼요 섹션 */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                시간 안 돼요
              </h3>
              <div className="space-y-2 overflow-y-auto max-h-60">
                {unavailableUsers.length === 0 ? (
                  <p className="text-sm text-gray-400">없음</p>
                ) : (
                  unavailableUsers.map((user, index) => (
                    <div
                      key={`unavailable-${index}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">👤</span>
                      </div>
                      <span className="text-sm text-gray-500 truncate">
                        {user}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 확인 버튼 */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            확인
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
