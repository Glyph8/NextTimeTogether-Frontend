"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  format,
  isWithinInterval,
  startOfDay,
  // endOfDay,
  parseISO, // 문자열을 Date로 변환하기 위해 임포트
} from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DayCellContentArg } from "@fullcalendar/core";
import Picker, { PickerValue } from "react-mobile-picker";

// page.tsx로부터 import
import { NewEventData } from "./../page"; // Omit<CalendarEvent, 'id'>
import type { CalendarEvent } from "./../page"; // CalendarEvent

// --- (TimeWheelPicker, CustomSwitch 등 하위 컴포넌트는 변경 없음) ---
const scheduleColors = [
  { name: "salmon", hex: "#FDB0A8" },
  { name: "orange", hex: "#F9B283" },
  { name: "yellow", hex: "#FADF84" },
  { name: "lightPurple", hex: "#B8B3F9" },
  { name: "darkPurple", hex: "#8668F9" },
  { name: "blue", hex: "#77ABF8" },
];
type TimePickerValue = { ampm: string; hour: number; minute: number };
const dateToValueGroups = (date: Date): TimePickerValue => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return { ampm, hour: displayHour, minute };
};
// TimeWheelPicker (변경 없음)
const TimeWheelPicker = ({
  date,
  onTimeChange,
}: {
  date: Date;
  onTimeChange: (newDate: Date) => void;
}) => {
  const optionGroups = {
    ampm: ["오전", "오후"],
    hour: Array.from({ length: 12 }, (_, i) => i + 1),
    minute: Array.from({ length: 60 }, (_, i) => i),
  };
  const [valueGroups, setValueGroups] = useState<TimePickerValue>(
    dateToValueGroups(date)
  );
  useEffect(() => {
    setValueGroups(dateToValueGroups(date));
  }, [date]);
  // const handleChange = (newValueGroup: PickerValue, changedKey: string) => {
  const handleChange = (newValueGroup: PickerValue) => {
    const updatedValue = newValueGroup as TimePickerValue;
    setValueGroups(updatedValue);
    const { ampm, hour, minute } = updatedValue;
    const newHour24 =
      ampm === "오후" && hour !== 12
        ? hour + 12
        : ampm === "오전" && hour === 12
        ? 0
        : hour;
    const newDate = new Date(date);
    newDate.setHours(newHour24, minute);
    onTimeChange(newDate);
  };
  return (
    <div className="my-6 time-wheel-picker-container">
      {" "}
      <Picker
        value={valueGroups}
        onChange={handleChange}
        height={160}
        itemHeight={40}
      >
        {" "}
        <Picker.Column name="ampm">
          {optionGroups.ampm.map((ampm) => (
            <Picker.Item key={ampm} value={ampm}>
              {ampm}
            </Picker.Item>
          ))}
        </Picker.Column>{" "}
        <Picker.Column name="hour">
          {optionGroups.hour.map((hour) => (
            <Picker.Item key={hour} value={hour}>
              {hour}
            </Picker.Item>
          ))}
        </Picker.Column>{" "}
        <Picker.Column name="minute">
          {optionGroups.minute.map((minute) => (
            <Picker.Item key={minute} value={minute}>
              {String(minute).padStart(2, "0")}
            </Picker.Item>
          ))}
        </Picker.Column>{" "}
      </Picker>{" "}
    </div>
  );
};
// CustomSwitch (변경 없음)
const CustomSwitch = ({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <label
      htmlFor={id}
      className="relative inline-flex items-center cursor-pointer"
    >
      {" "}
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />{" "}
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>{" "}
    </label>
  );
};
// --- (하위 컴포넌트 끝) ---

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialDate: Date | null; // 생성 시 초기 날짜
  editingEvent?: CalendarEvent | null; // 수정할 이벤트 데이터
  onEventCreated: (newEvent: NewEventData) => void; // 생성 콜백
  onEventUpdated: (updatedEvent: CalendarEvent) => void; // 수정 콜백
  onEventDeleted: (eventId: string) => void; // 삭제 콜백
}

export function ScheduleCreateDrawer({
  isOpen,
  setIsOpen,
  initialDate,
  editingEvent,
  onEventCreated,
  onEventUpdated,
  onEventDeleted,
}: Props) {
  const isEditMode = !!editingEvent;

  // --- 폼 상태 ---
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(scheduleColors[1].name);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false); // (이 기능은 아직 저장 로직에 반영 X)
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");

  type PickerType =
    | "START_DATE"
    | "START_TIME"
    | "END_DATE"
    | "END_TIME"
    | null;
  const [openPicker, setOpenPicker] = useState<PickerType>(null);
  const calendarRef = useRef<FullCalendar>(null);
  // --- --- ---

  // Date 객체에서 '오전/오후 HH:mm' 형식의 문자열 반환
  const formatTime = (date: Date) => format(date, "a hh:mm", { locale: ko });

  // Date 객체에서 'YYYY-MM-DD' 형식의 문자열 반환
  const formatDateToISO = (date: Date) => format(date, "yyyy-MM-dd");

  // '오전/오후 HH:mm' 형식 문자열과 기준 날짜(Date)를 합쳐 새 Date 객체 반환
  // (수정 모드에서 문자열 -> Date 객체로 변환 시 필요)
  const parseTimeString = (timeString: string, baseDate: Date): Date => {
    const newDate = new Date(baseDate);
    const [amPm, time] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let newHours = hours;
    if (amPm === "오후" && hours !== 12) {
      newHours += 12;
    } else if (amPm === "오전" && hours === 12) {
      newHours = 0; // 오전 12시 -> 0시
    }
    newDate.setHours(newHours, minutes, 0, 0); // 시, 분, 초, 밀리초
    return newDate;
  };

  // 드로워가 열릴 때 폼 상태 초기화
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // --- 수정 모드 ---
        // editingEvent 데이터로 폼 채우기
        const start = parseISO(editingEvent.start); // "YYYY-MM-DD" -> Date
        let end = editingEvent.end ? parseISO(editingEvent.end) : start;

        // allDay 이벤트의 경우 저장 시 +1일 했으므로, 표시할 때는 -1일 해야 원래 종료일
        if (editingEvent.allDay && editingEvent.end) {
          const displayEnd = new Date(end);
          displayEnd.setDate(displayEnd.getDate() - 1);
          end = displayEnd;
        }

        setTitle(editingEvent.title);
        setSelectedColor(editingEvent.color || scheduleColors[1].name);
        setIsAllDay(editingEvent.allDay || false);
        // setPlace(editingEvent.place || ""); // (필요 시 추가)
        // setMemo(editingEvent.memo || ""); // (필요 시 추가)

        if (editingEvent.allDay) {
          setStartDate(start);
          setEndDate(end);
        } else {
          // 시간 정보가 있으면 Date 객체에 반영
          const startTime = editingEvent.startTime
            ? parseTimeString(editingEvent.startTime, start)
            : start;
          const endTime = editingEvent.endTime
            ? parseTimeString(editingEvent.endTime, end)
            : startTime; // 종료 시간이 없으면 시작 시간으로
          setStartDate(startTime);
          setEndDate(endTime);
        }
      } else {
        // --- 생성 모드 ---
        // initialDate (또는 오늘) 기준으로 폼 초기화
        const baseDate = initialDate
          ? startOfDay(initialDate)
          : startOfDay(new Date());
        // 생성 시 기본 시간: 현재 시간 기준 다음 정시
        const now = new Date();
        now.setHours(now.getHours() + 1, 0, 0, 0); // 다음 시간 00분

        const defaultStartDate = new Date(baseDate);
        defaultStartDate.setHours(now.getHours(), now.getMinutes());

        const defaultEndDate = new Date(defaultStartDate);
        defaultEndDate.setHours(defaultStartDate.getHours() + 1); // 1시간 뒤

        setTitle("");
        setSelectedColor(scheduleColors[1].name);
        setIsAllDay(true); // 기본값 '하루 종일'
        setStartDate(baseDate); // 날짜는 선택한 날짜
        setEndDate(baseDate);
        setPlace("");
        setMemo("");
        // (만약 allDay: false가 기본값이면)
        // setStartDate(defaultStartDate);
        // setEndDate(defaultEndDate);
      }
      setOpenPicker(null); // 모든 피커 닫기
    }
  }, [isOpen, initialDate, editingEvent, isEditMode]);

  // '하루 종일' 스위치 변경 시
  useEffect(() => {
    if (isAllDay) {
      // 하루 종일
      setStartDate(startOfDay(startDate));
      setEndDate(startOfDay(endDate));
      setOpenPicker(null); // 시간 피커 닫기
    } else {
      // 시간 설정
      // (기본 시간 설정 - 예: 1시간 간격)
      const newStart = new Date(startDate);
      if (newStart.getHours() === 0 && newStart.getMinutes() === 0) {
        // 00:00 이면 적절한 시간 (예: 오전 9시)으로 설정
        newStart.setHours(9, 0);
      }

      const newEnd = new Date(endDate);
      // 종료 시간이 시작 시간보다 빠르거나 같으면 (하루 종일 -> 시간 설정 시)
      if (newEnd <= newStart) {
        newEnd.setTime(newStart.getTime()); // 시작 시간과 같게
        newEnd.setHours(newStart.getHours() + 1); // 1시간 뒤로 설정
      }

      setStartDate(newStart);
      setEndDate(newEnd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllDay]);

  const isSubmitDisabled = title.trim() === "";

  // --- 저장 / 수정 핸들러 ---
  const handleSave = () => {
    // 1. 종료 날짜 계산 (기존 로직 유지)
    // FullCalendar 표시를 위해 AllDay인 경우 날짜 하루 더하기
    let finalEndDateStr = formatDateToISO(endDate);
    if (isAllDay) {
      const exclusiveEndDate = new Date(endDate);
      exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1);
      finalEndDateStr = formatDateToISO(exclusiveEndDate);
    } 

    // 2. 데이터 구조화 [수정된 부분]
    const eventData: NewEventData = { 
      title: title.trim(),
      start: formatDateToISO(startDate), 
      end: finalEndDateStr,
      color: selectedColor,
      allDay: isAllDay,
      
      // [핵심 수정] isAllDay가 true일 때 undefined가 아니라 '00:00' ~ '23:59'로 강제 할당
      // 현재 포맷(오전/오후 hh:mm)에 맞춰서 문자열을 하드코딩합니다.
      startTime: isAllDay ? "오전 12:00" : formatTime(startDate),
      endTime: isAllDay ? "오후 11:59" : formatTime(endDate),
      
      place: place,
      memo: memo,
    };

    console.log("📤 저장할 이벤트 데이터:", eventData);

    if (isEditMode && editingEvent) {
      // --- 수정 ---
      onEventUpdated({
        ...eventData,
        id: editingEvent.id, 
      });
    } else {
      // --- 생성 ---
      onEventCreated(eventData);
    }
  };

  // --- 삭제 핸들러 ---
  const handleDelete = () => {
    if (isEditMode) {
      // TODO: "정말 삭제하시겠습니까?" 확인 모달 추가하면 좋음
      onEventDeleted(editingEvent.id);
    }
  };

  const formatDateForDisplay = (date: Date) =>
    format(date, "M월 d일 (E)", { locale: ko });

  // 미니 캘린더 날짜 선택 핸들러
  const handleDateSelect = (clickInfo: DateClickArg) => {
    const clickedDate = startOfDay(clickInfo.date);
    if (openPicker === "START_DATE") {
      setStartDate(clickedDate);
      if (clickedDate > endDate) setEndDate(clickedDate);
      setOpenPicker(null);
    } else if (openPicker === "END_DATE") {
      if (clickedDate < startDate) {
        // 종료일을 시작일보다 앞으로 찍으면
        setStartDate(clickedDate); // 시작일도 같이 변경
        setEndDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
      setOpenPicker(null);
    }
  };

  const togglePicker = (picker: PickerType) => {
    setOpenPicker((current) => (current === picker ? null : picker));
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DrawerContent className="h-dvh max-h-dvh flex flex-col bg-white">
        <DrawerHeader className="flex items-center justify-between p-4 h-16 border-b border-gray-100 flex-shrink-0">
          <DrawerClose asChild>
            <button className="p-2 text-gray-500">
              {/* X 버튼 SVG (피그마 참고) */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DrawerClose>
          <DrawerTitle className="text-lg font-bold">
            {isEditMode ? "일정 수정" : "일정 등록"}
          </DrawerTitle>
          {/* 삭제 버튼 (수정 모드에서만 보임) */}
          <div className="w-10">
            {isEditMode && (
              <button onClick={handleDelete} className="text-sm text-red-500">
                삭제
              </button>
            )}
          </div>
        </DrawerHeader>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 제목 */}
          <div className="flex items-center border-b border-gray-200 pb-2">
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-semibold placeholder-gray-300 focus:outline-none"
            />
            {title.trim() && (
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: scheduleColors.find(
                    (c) => c.name === selectedColor
                  )?.hex,
                }}
              />
            )}
          </div>
          {/* 시작 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 w-16">시작</span>
            <button
              onClick={() => togglePicker("START_DATE")}
              className={cn(
                "flex-1 text-left font-semibold text-lg",
                openPicker === "START_DATE" && "text-purple-600"
              )}
            >
              {formatDateForDisplay(startDate)}
            </button>
            {!isAllDay && (
              <button
                onClick={() => togglePicker("START_TIME")}
                className={cn(
                  "font-bold text-lg",
                  openPicker === "START_TIME"
                    ? "text-purple-600 ring-2 ring-purple-200 rounded"
                    : "text-gray-700"
                )}
              >
                {formatTime(startDate)}
              </button>
            )}
          </div>
          {/* 종료 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 w-16">종료</span>
            <button
              onClick={() => togglePicker("END_DATE")}
              className={cn(
                "flex-1 text-left font-semibold text-lg",
                openPicker === "END_DATE" && "text-purple-600"
              )}
            >
              {formatDateForDisplay(endDate)}
            </button>
            {!isAllDay && (
              <button
                onClick={() => togglePicker("END_TIME")}
                className={cn(
                  "font-bold text-lg",
                  openPicker === "END_TIME"
                    ? "text-purple-600 ring-2 ring-purple-200 rounded"
                    : "text-gray-700"
                )}
              >
                {formatTime(endDate)}
              </button>
            )}
          </div>

          {/* 피커 렌더링 영역 */}
          {(openPicker === "START_DATE" || openPicker === "END_DATE") && (
            <div className="calendar-with-toggles-container inline-calendar-container my-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4 px-2">
                <label
                  htmlFor="drawer-all-day"
                  className="text-lg cursor-pointer font-semibold flex items-center"
                >
                  <span className="mr-2 text-purple-600">하루 종일</span>
                  <CustomSwitch
                    id="drawer-all-day"
                    checked={isAllDay}
                    onChange={setIsAllDay}
                  />
                </label>
                <label
                  htmlFor="drawer-repeat"
                  className="text-lg cursor-pointer font-semibold flex items-center"
                >
                  <span className="mr-2">매주 반복</span>
                  <CustomSwitch
                    id="drawer-repeat"
                    checked={isRepeat}
                    onChange={setIsRepeat}
                  />
                </label>
              </div>

              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={openPicker === "START_DATE" ? startDate : endDate}
                dateClick={handleDateSelect}
                headerToolbar={{ start: "", center: "title", end: "prev,next" }}
                titleFormat={{ year: "numeric", month: "long" }}
                buttonText={{ prev: "<", next: ">" }}
                locale="ko"
                dayHeaderFormat={{ weekday: "narrow" }}
                height="auto"
                viewClassNames="minimal-calendar-view"
                dayHeaderClassNames="minimal-calendar-header"
                dayCellClassNames="minimal-calendar-cell"
                showNonCurrentDates={false}
                dayCellDidMount={(arg) => {
                  const date = startOfDay(arg.date);
                  const cellEl = arg.el;
                  const isToday = cellEl.classList.contains("fc-day-today");
                  const isInRange = isWithinInterval(date, {
                    start: startOfDay(startDate),
                    end: startOfDay(endDate),
                  });
                  const isStartDate =
                    date.toDateString() === startDate.toDateString();
                  const isEndDate =
                    date.toDateString() === endDate.toDateString();
                  // 오늘 날짜에는 선택 관련 클래스 추가하지 않음
                  if (!isToday) {
                    if (isInRange) cellEl.classList.add("in-range");
                    else cellEl.classList.remove("in-range");
                    if (isStartDate) cellEl.classList.add("range-start");
                    else cellEl.classList.remove("range-start");
                    if (isEndDate) cellEl.classList.add("range-end");
                    else cellEl.classList.remove("range-end");
                    if (isStartDate && isEndDate)
                      cellEl.classList.add("single-date");
                    else cellEl.classList.remove("single-date");
                  } else {
                    cellEl.classList.remove("in-range");
                    cellEl.classList.remove("range-start");
                    cellEl.classList.remove("range-end");
                    cellEl.classList.remove("single-date");
                  }
                }}
                dayCellContent={(arg: DayCellContentArg) => {
                  const dayNumber = arg.dayNumberText.replace("일", "");
                  return <span className="date-number">{dayNumber}</span>;
                }}
              />
            </div>
          )}
          {(openPicker === "START_TIME" || openPicker === "END_TIME") && (
            <TimeWheelPicker
              date={openPicker === "START_TIME" ? startDate : endDate}
              onTimeChange={(newDate) => {
                if (openPicker === "START_TIME") {
                  setStartDate(newDate);
                  // 시작 시간 변경 시 종료 시간이 따라오도록
                  if (newDate >= endDate) {
                    const newEndDate = new Date(newDate);
                    newEndDate.setHours(newDate.getHours() + 1);
                    setEndDate(newEndDate);
                  }
                } else {
                  // END_TIME
                  if (newDate <= startDate) {
                    // 종료 시간을 시작 시간보다 앞으로 설정 시
                    setEndDate(startDate); // 시작 시간과 같게
                  } else {
                    setEndDate(newDate);
                  }
                }
              }}
            />
          )}

          {/* 장소 */}
          <div className="border-b border-gray-200 py-2">
            <input
              type="text"
              placeholder="장소"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full text-lg placeholder-gray-300 focus:outline-none"
            />
          </div>
          {/* 메모 */}
          <div className="border-b border-gray-200 py-2">
            <textarea
              placeholder="메모"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full text-lg placeholder-gray-300 focus:outline-none resize-none h-24"
            />
          </div>
          {/* 색상 팔레트 */}
          {title.trim() && (
            <div className="flex space-x-3 py-2">
              {scheduleColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2"
                      : "hover:scale-110",
                    `ring-[${color.hex}]` // (Tailwind JIT가 동적 클래스를 감지 못할 수 있으므로 style 사용)
                  )}
                  style={{
                    backgroundColor: color.hex,
                    borderColor: color.hex,
                  }}
                />
              ))}
            </div>
          )}
        </main>

        <DrawerFooter className="p-4 shadow-inner-top flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={isSubmitDisabled}
            className={cn(
              "w-full py-4 text-white text-lg font-bold rounded-lg",
              isSubmitDisabled
                ? "bg-gray-300"
                : "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {isEditMode ? "수정" : "등록"}
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
