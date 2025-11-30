import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { TimeApiResponse } from "../when-components/types";
import { getDayOfWeek } from "../when-components/utils";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface WhenConfirmDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timeData: TimeApiResponse;
}

export const WhenConfirmDrawer = ({
  open,
  setOpen,
  timeData,
}: WhenConfirmDrawerProps) => {
  // 날짜 목록 생성
  const dateOptions = timeData.result.availableTimes.map((day) => {
    const [, month, date] = day.date.split("-");
    const dayOfWeek = getDayOfWeek(day.date);
    return {
      value: day.date,
      label: `${parseInt(month)}/${parseInt(date)} ${dayOfWeek}`,
    };
  });

  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.value || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("23:00");

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);

  // 시간 추천 관련 상태
  const [recommendStep, setRecommendStep] = useState<
    "main" | "duration" | "result"
  >("main");
  const [selectedDuration, setSelectedDuration] = useState("120"); // 분 단위 (기본 2시간)
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    number | null
  >(null);

  const dateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  // Duration 옵션 (30분 ~ 3시간 30분)
  const durationOptions = [
    { value: "30", label: "30분" },
    { value: "60", label: "1시간" },
    { value: "90", label: "1시간 30분" },
    { value: "120", label: "2시간" },
    { value: "150", label: "2시간 30분" },
    { value: "180", label: "3시간" },
    { value: "210", label: "3시간 30분" },
  ];

  // 시간 옵션 생성 (30분 단위, 09:00 ~ 24:00)
  const timeOptions = [];
  for (let hour = 9; hour <= 24; hour++) {
    for (const minute of [0, 30]) {
      // 24:30은 없으므로 24:00까지만
      if (hour === 24 && minute === 30) continue;

      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      const displayHour = hour === 24 ? 0 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? "오전" : "오후";
      const label = `${displayHour === 0 ? 12 : displayHour}:${String(
        minute
      ).padStart(2, "0")} ${period}`;
      timeOptions.push({ value: time, label });
    }
  }

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (
        startTimeRef.current &&
        !startTimeRef.current.contains(event.target as Node)
      ) {
        setIsStartTimeOpen(false);
      }
      if (
        endTimeRef.current &&
        !endTimeRef.current.contains(event.target as Node)
      ) {
        setIsEndTimeOpen(false);
      }
      if (
        durationRef.current &&
        !durationRef.current.contains(event.target as Node)
      ) {
        setIsDurationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTimeLabel = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "오전" : "오후";
    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
  };

  // 시간 추천 알고리즘
  const calculateRecommendations = () => {
    const durationMinutes = parseInt(selectedDuration);
    // 전체 멤버 수는 dummyMemberData에서 가져와야 하지만, 임시로 8명으로 설정
    const totalMembers = 8;
    const recommendations: Array<{
      date: string;
      startTime: string;
      endTime: string;
      score: number;
      availableCount: number;
    }> = [];

    // 각 날짜별로 탐색
    timeData.result.availableTimes.forEach((dayData) => {
      const timeSlots = dayData.times;

      // 연속된 시간대 탐색
      for (let i = 0; i < timeSlots.length; i++) {
        const startSlot = timeSlots[i];
        const startTime = startSlot.times.substring(0, 5); // "09:00:00" -> "09:00"
        const [startHour, startMinute] = startTime.split(":").map(Number);

        // duration에 필요한 슬롯 수 계산 (30분 단위)
        const requiredSlots = durationMinutes / 30;

        // 해당 구간의 모든 슬롯을 확인할 수 있는지 체크
        if (i + requiredSlots > timeSlots.length) break;

        // 연속된 슬롯들의 최소 가능 인원 찾기
        let minAvailableCount = totalMembers;
        let isValidRange = true;

        for (let j = 0; j < requiredSlots; j++) {
          const currentSlot = timeSlots[i + j];
          if (!currentSlot) {
            isValidRange = false;
            break;
          }

          if (currentSlot.count < minAvailableCount) {
            minAvailableCount = currentSlot.count;
          }
        }

        if (!isValidRange) continue;

        // 종료 시간 계산
        const endMinutes = startHour * 60 + startMinute + durationMinutes;
        const endHour = Math.floor(endMinutes / 60);
        const endMinute = endMinutes % 60;
        const endTime = `${String(endHour).padStart(2, "0")}:${String(
          endMinute
        ).padStart(2, "0")}`;

        // 점수 계산 (비율 기반)
        const score = (minAvailableCount / totalMembers) * 100;

        recommendations.push({
          date: dayData.date,
          startTime,
          endTime,
          score,
          availableCount: minAvailableCount,
        });
      }
    });

    // 점수 내림차순 정렬, 동점이면 이른 시간 우선
    recommendations.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    return recommendations.slice(0, 5); // 상위 5개
  };

  // 추천 결과 계산
  const recommendations =
    recommendStep === "result" ? calculateRecommendations() : [];

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      <DrawerContent className="h-[70vh] bg-white px-6 pb-8 flex flex-col">
        <DrawerDescription className="sr-only">
          약속 일시를 확정하는 화면입니다. 날짜와 시간을 선택할 수 있습니다.
        </DrawerDescription>

        <div className="flex flex-col gap-6 mt-6 flex-1 min-h-0 overflow-hidden">
          {/* 제목 */}
          <DrawerTitle className="text-center text-xl font-semibold">
            {recommendStep === "duration"
              ? "몇 시간과 약속인가요?"
              : "일시 확정하기"}
          </DrawerTitle>

          {/* Step 1: Main - 날짜/시간 선택 */}
          {recommendStep === "main" && (
            <>
              {/* 날짜 선택 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">날짜</label>
                <div className="relative" ref={dateRef}>
                  <button
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                  >
                    <span className="text-sm">
                      {
                        dateOptions.find((opt) => opt.value === selectedDate)
                          ?.label
                      }
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isDateOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDateOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {dateOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedDate(option.value);
                            setIsDateOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                            selectedDate === option.value
                              ? "bg-purple-50 text-purple-600 font-medium"
                              : ""
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
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">시간</label>
                  <button
                    onClick={() => setRecommendStep("duration")}
                    className="text-xs text-purple-600 px-3 py-1 border border-purple-600 rounded hover:bg-purple-50 transition-colors"
                  >
                    시간 추천
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* 시작 시간 */}
                  <div className="relative flex-1" ref={startTimeRef}>
                    <button
                      onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm">{getTimeLabel(startTime)}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isStartTimeOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isStartTimeOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {timeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setStartTime(option.value);
                              setIsStartTimeOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                              startTime === option.value
                                ? "bg-purple-50 text-purple-600 font-medium"
                                : ""
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-gray-400">~</span>

                  {/* 종료 시간 */}
                  <div className="relative flex-1" ref={endTimeRef}>
                    <button
                      onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                    >
                      <span className="text-sm">{getTimeLabel(endTime)}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isEndTimeOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isEndTimeOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {timeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setEndTime(option.value);
                              setIsEndTimeOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                              endTime === option.value
                                ? "bg-purple-50 text-purple-600 font-medium"
                                : ""
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 공백 */}
              <div className="flex-1" />

              {/* 확인 버튼 */}
              <button
                onClick={() => {
                  console.log("확정:", { selectedDate, startTime, endTime });
                  setOpen(false);
                }}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                확인
              </button>
            </>
          )}

          {/* Step 2: Duration - 약속 시간 길이 선택 */}
          {recommendStep === "duration" && (
            <>
              <div className="flex flex-col gap-4">
                <label className="text-sm text-gray-600">시간</label>
                <div className="relative" ref={durationRef}>
                  <button
                    onClick={() => setIsDurationOpen(!isDurationOpen)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
                  >
                    <span className="text-sm">
                      {
                        durationOptions.find(
                          (opt) => opt.value === selectedDuration
                        )?.label
                      }
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isDurationOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDurationOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {durationOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedDuration(option.value);
                            setIsDurationOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                            selectedDuration === option.value
                              ? "bg-purple-50 text-purple-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1" />

              <button
                onClick={() => setRecommendStep("result")}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                시간 추천
              </button>
            </>
          )}

          {/* Step 3: Result - 추천 결과 */}
          {recommendStep === "result" && (
            <>
              <p className="text-sm text-gray-600 text-center">
                그룹원들의 우선순위를 고려한 시간이에요
              </p>

              <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
                {recommendations.map((rec, index) => {
                  const dateLabel = dateOptions.find(
                    (opt) => opt.value === rec.date
                  )?.label;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedRecommendation(index)}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRecommendation === index
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedRecommendation === index}
                        onChange={() => setSelectedRecommendation(index)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{index + 1}순위</span>
                          {rec.score === 100 && (
                            <span className="text-pink-500">👥</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {dateLabel} {getTimeLabel(rec.startTime)}~
                          {getTimeLabel(rec.endTime)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {rec.availableCount}명 가능
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  if (selectedRecommendation !== null) {
                    const selected = recommendations[selectedRecommendation];
                    setSelectedDate(selected.date);
                    setStartTime(selected.startTime);
                    setEndTime(selected.endTime);
                    setRecommendStep("main");
                    setSelectedRecommendation(null);
                  }
                }}
                disabled={selectedRecommendation === null}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                확인
              </button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
