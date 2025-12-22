import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button/Button"; // 기존 버튼 컴포넌트 재사용
import { getDayOfWeek } from "../when-components/utils";
import { usePromiseTime } from "../when-components/use-promise-time";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { ChevronDown, Clock, Calendar as CalendarIcon, X } from "lucide-react"; // 아이콘 추가 (없으면 설치 필요)
import { TimeCell } from "@/api/when2meet";

interface WhenConfirmDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  promiseId: string;
}

export const WhenConfirmDrawer = ({
  open,
  setOpen,
  promiseId,
}: WhenConfirmDrawerProps) => {
  // 1. Server State (React Query)
  const { boardQuery, confirmMutation } = usePromiseTime(promiseId);
  const { data: timeBoardData, isLoading } = boardQuery;

  // 2. UI State
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);

  // Recommendation State
  const [recommendStep, setRecommendStep] = useState<
    "main" | "duration" | "result"
  >("main");
  const [selectedDuration, setSelectedDuration] = useState("120"); // 120분(2시간) 기본
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    number | null
  >(null);

  // Refs for Outside Click Detection
  const dateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  // 3. Derived Data (Data Transformation)
  const dateOptions = useMemo(() => {
    if (!timeBoardData?.availableTimes) return [];

    // API 데이터가 배열인지 확인 후 매핑
    const timesArray = Array.isArray(timeBoardData.availableTimes)
      ? timeBoardData.availableTimes
      : [timeBoardData.availableTimes];

    return timesArray.map((day) => {
      const [, month, date] = day.date.split("-");
      const dayOfWeek = getDayOfWeek(day.date);
      return {
        value: day.date,
        label: `${parseInt(month)}월 ${parseInt(date)}일 (${dayOfWeek})`,
      };
    });
  }, [timeBoardData]);

  // 초기값 설정
  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].value);
    }
  }, [dateOptions, selectedDate]);

  // 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dateRef.current && !dateRef.current.contains(target))
        setIsDateOpen(false);
      if (startTimeRef.current && !startTimeRef.current.contains(target))
        setIsStartTimeOpen(false);
      if (endTimeRef.current && !endTimeRef.current.contains(target))
        setIsEndTimeOpen(false);
      if (durationRef.current && !durationRef.current.contains(target))
        setIsDurationOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 시간 옵션 생성 (09:00 ~ 24:00, 30분 단위)
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 9; hour <= 24; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 24 && minute === 30) continue;
        const timeStr = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;

        // UI 표시용 라벨 (오전/오후)
        const displayHour = hour === 24 ? 0 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 && hour !== 24 ? "오전" : "오후";
        const label = `${displayHour === 0 ? 12 : displayHour}:${String(
          minute
        ).padStart(2, "0")} ${period}`;

        options.push({ value: timeStr, label });
      }
    }
    return options;
  }, []);

  const getTimeLabel = (time: string) => {
    const option = timeOptions.find((opt) => opt.value === time);
    return option ? option.label : time;
  };

  // 4. Recommendation Algorithm
  const calculateRecommendations = () => {
    if (!timeBoardData) return [];

    const durationMinutes = parseInt(selectedDuration);
    // TODO: 전체 멤버 수를 API에서 받아오거나 상위 컴포넌트에서 전달받아야 정확함.
    // 현재는 데이터 내 최대 count를 기준으로 추정
    let maxFoundMembers = 0;

    const timesArray = Array.isArray(timeBoardData.availableTimes)
      ? timeBoardData.availableTimes
      : [timeBoardData.availableTimes];

    // 전체 멤버 수 추정 (데이터 순회)
    timesArray.forEach((day) =>
      day.times.forEach((t: TimeCell) => {
        if (t.count > maxFoundMembers) maxFoundMembers = t.count;
      })
    );
    const totalMembers = maxFoundMembers || 1; // 0나누기 방지

    const recs: Array<{
      date: string;
      startTime: string;
      endTime: string;
      score: number;
      availableCount: number;
    }> = [];

    timesArray.forEach((dayData) => {
      const timeSlots = dayData.times; // [{times: "09:00:00", count: 3}, ...]

      // 슬롯 순회
      for (let i = 0; i < timeSlots.length; i++) {
        const startSlot = timeSlots[i];
        const currentStartTime = startSlot.times.substring(0, 5); // "09:00"
        const [startH, startM] = currentStartTime.split(":").map(Number);

        // 필요한 슬롯 개수 (30분 단위)
        const requiredSlots = durationMinutes / 30;

        // 범위 초과 체크
        if (i + requiredSlots > timeSlots.length) break;

        // 해당 구간의 최소 가능 인원(병목) 찾기
        let minAvailableCount = totalMembers;
        let isValidRange = true;

        for (let j = 0; j < requiredSlots; j++) {
          const slot = timeSlots[i + j];

          // 연속성 체크 (시간이 이어지는지) - 데이터가 정렬되어 있다고 가정
          // 엄밀히 하려면 이전 슬롯 시간 + 30분 == 현재 슬롯 시간 체크 필요
          if (!slot) {
            isValidRange = false;
            break;
          }

          if (slot.count < minAvailableCount) {
            minAvailableCount = slot.count;
          }
        }

        if (!isValidRange) continue;

        // 종료 시간 계산
        const endMinutesTotal = startH * 60 + startM + durationMinutes;
        const endH = Math.floor(endMinutesTotal / 60);
        const endM = endMinutesTotal % 60;
        const currentEndTime = `${String(endH).padStart(2, "0")}:${String(
          endM
        ).padStart(2, "0")}`;

        // 점수: (가능인원 / 전체인원) * 100
        const score = (minAvailableCount / totalMembers) * 100;

        recs.push({
          date: dayData.date,
          startTime: currentStartTime,
          endTime: currentEndTime,
          score: Math.round(score),
          availableCount: minAvailableCount,
        });
      }
    });

    // 정렬: 점수 높은순 -> 날짜 빠른순 -> 시간 빠른순
    recs.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    return recs.slice(0, 5); // Top 5
  };

  const recommendations =
    recommendStep === "result" ? calculateRecommendations() : [];

  // Duration Options
  const durationOptions = [
    { value: "30", label: "30분" },
    { value: "60", label: "1시간" },
    { value: "90", label: "1시간 30분" },
    { value: "120", label: "2시간" },
    { value: "150", label: "2시간 30분" },
    { value: "180", label: "3시간" },
  ];

  // 5. Handlers
  const handleConfirm = () => {
    // 1. 시작 일시 포맷팅 (YYYY-MM-DDTHH:mm:ss)
    const startDateTime = `${selectedDate}T${startTime}:00`;

    // 2. 종료 시간 포맷팅 (HH:mm:ss)
    // endTime 상태는 "HH:mm" 형태이므로 뒤에 초(:00)를 붙여줍니다.
    const endTimePart = `${endTime}:00`;

    // 3. 최종 문자열 결합 (시작일시-종료시간)
    // 예: "2025-06-21T09:00:00-09:30:00"
    const finalString = `${startDateTime}-${endTimePart}`;

    console.log("🔵 약속 확정 요청 데이터:", finalString);

    // Mutation 실행
    confirmMutation.mutate(finalString);

    setOpen(false);
  };

  const handleApplyRecommendation = () => {
    if (selectedRecommendation !== null) {
      const selected = recommendations[selectedRecommendation];
      setSelectedDate(selected.date);
      setStartTime(selected.startTime);
      setEndTime(selected.endTime);

      setRecommendStep("main");
      setSelectedRecommendation(null);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75vh] bg-white flex flex-col rounded-t-2xl">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-2 text-center">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            {recommendStep === "duration" ? "예상 소요 시간" : "약속 시간 확정"}
          </DrawerTitle>
          <DrawerDescription className="text-gray-500 text-sm mt-1">
            {recommendStep === "result"
              ? "참여율이 가장 높은 시간대를 추천해드려요."
              : "모두가 만족할 수 있는 시간을 선택해주세요."}
          </DrawerDescription>

          {/* 닫기 버튼 */}
          <DrawerClose className="absolute right-4 top-6 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </DrawerClose>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <DefaultLoading />
            </div>
          ) : (
            <>
              {/* === Step 1: Main Selection === */}
              {recommendStep === "main" && (
                <div className="flex flex-col gap-6">
                  {/* 날짜 선택 */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" /> 날짜
                    </label>
                    <div className="relative" ref={dateRef}>
                      <button
                        onClick={() => setIsDateOpen(!isDateOpen)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex justify-between items-center hover:border-purple-300 transition-all focus:outline-none focus:ring-2 focus:ring-purple-100"
                      >
                        <span className="text-gray-800 font-medium">
                          {dateOptions.find((opt) => opt.value === selectedDate)
                            ?.label || "날짜 선택"}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isDateOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDateOpen && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                          {dateOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedDate(option.value);
                                setIsDateOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition-colors ${
                                selectedDate === option.value
                                  ? "text-purple-600 font-bold bg-purple-50"
                                  : "text-gray-600"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 시간 선택 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 시간
                      </label>
                      <button
                        onClick={() => setRecommendStep("duration")}
                        className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
                      >
                        ✨ 시간 추천 받기
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 시작 시간 */}
                      <div className="relative flex-1" ref={startTimeRef}>
                        <button
                          onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {getTimeLabel(startTime)}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {isStartTimeOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {timeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  setStartTime(opt.value);
                                  setIsStartTimeOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                  startTime === opt.value
                                    ? "text-purple-600 font-bold"
                                    : ""
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-gray-300">~</span>

                      {/* 종료 시간 */}
                      <div className="relative flex-1" ref={endTimeRef}>
                        <button
                          onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {getTimeLabel(endTime)}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {isEndTimeOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {timeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  setEndTime(opt.value);
                                  setIsEndTimeOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                  endTime === opt.value
                                    ? "text-purple-600 font-bold"
                                    : ""
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 2: Duration Selection === */}
              {recommendStep === "duration" && (
                <div className="flex flex-col gap-6 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      소요 시간
                    </label>
                    <div className="relative" ref={durationRef}>
                      <button
                        onClick={() => setIsDurationOpen(!isDurationOpen)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex justify-between items-center shadow-sm"
                      >
                        <span className="text-gray-800 font-medium">
                          {
                            durationOptions.find(
                              (opt) => opt.value === selectedDuration
                            )?.label
                          }
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isDurationOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isDurationOpen && (
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                          {durationOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedDuration(option.value);
                                setIsDurationOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition-colors ${
                                selectedDuration === option.value
                                  ? "text-purple-600 font-bold bg-purple-50"
                                  : "text-gray-600"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    약속 진행 시간을 기준으로 최적의 시간을 찾아드려요.
                  </p>
                </div>
              )}

              {/* === Step 3: Result Selection === */}
              {recommendStep === "result" && (
                <div className="flex flex-col gap-3 mt-2 h-full">
                  {recommendations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                      <span className="text-2xl">😢</span>
                      <p>조건에 맞는 시간이 없어요.</p>
                      <Button
                        text="다시 설정하기"
                        onClick={() => setRecommendStep("duration")}
                        className="mt-4 w-auto px-6 h-10 text-sm"
                      />
                    </div>
                  ) : (
                    recommendations.map((rec, index) => {
                      const dateLabel = dateOptions.find(
                        (opt) => opt.value === rec.date
                      )?.label;
                      const isSelected = selectedRecommendation === index;

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedRecommendation(index)}
                          className={`relative flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 
                            ${
                              isSelected
                                ? "border-purple-500 bg-purple-50 shadow-md transform scale-[1.01]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                          {/* Badge */}
                          <div
                            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span className="text-xs font-bold">
                              {index + 1}순위
                            </span>
                            <span className="text-[10px] font-semibold">
                              {rec.score}%
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">
                              {dateLabel}
                            </div>
                            <div className="text-gray-600 text-xs mt-0.5">
                              {getTimeLabel(rec.startTime)} ~{" "}
                              {getTimeLabel(rec.endTime)}
                            </div>
                          </div>

                          {/* Radio Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${
                              isSelected
                                ? "border-purple-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-8 pt-4 bg-white border-t border-gray-50">
          {recommendStep === "main" && (
            <Button
              text={
                confirmMutation.isPending
                  ? "확정 중..."
                  : "이 시간으로 확정하기"
              }
              onClick={handleConfirm}
              disabled={confirmMutation.isPending || selectedDate === ""}
              className="w-full h-12 text-base font-bold shadow-lg shadow-purple-200"
            />
          )}

          {recommendStep === "duration" && (
            <div className="flex gap-3">
              <button
                onClick={() => setRecommendStep("main")}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <Button
                text="시간 추천 받기"
                onClick={() => setRecommendStep("result")}
                className="flex-[2] h-12 text-base font-bold"
              />
            </div>
          )}

          {recommendStep === "result" && recommendations.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => setRecommendStep("duration")}
                className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              >
                다시 선택
              </button>
              <Button
                text="선택 완료"
                onClick={handleApplyRecommendation}
                disabled={selectedRecommendation === null}
                className="flex-[2] h-12 text-base font-bold"
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
