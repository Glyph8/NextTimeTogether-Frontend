"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
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
import dayGridPlugin from "@fullcalendar/daygrid"; // DayCellContentArg 여기서 가져오지 않음
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
// --- 1. DayCellContentArg 임포트 경로 수정 ---
import { DayCellContentArg } from "@fullcalendar/core"; // core에서 가져옴
import Picker, { PickerValue } from "react-mobile-picker";

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
  const handleChange = (newValueGroup: PickerValue, changedKey: string) => {
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

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialDate: Date | null;
}

export function ScheduleCreateDrawer({
  isOpen,
  setIsOpen,
  initialDate,
}: Props) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(scheduleColors[1].name);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [isRepeat, setIsRepeat] = useState(false);
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

  useEffect(() => {
    if (isOpen) {
      /* ... 초기화 로직 ... */
    }
  }, [isOpen, initialDate]);
  useEffect(() => {
    /* ... isAllDay 변경 로직 ... */
  }, [isAllDay]);

  const isSubmitDisabled = title.trim() === "";
  const handleSave = () => {
    /* ... 저장 로직 ... */
  };
  const formatDate = (date: Date) =>
    format(date, "M월 d일 (E)", { locale: ko });
  const formatTime = (date: Date) => format(date, "a hh:mm", { locale: ko });

  const handleDateSelect = (clickInfo: DateClickArg) => {
    const clickedDate = startOfDay(clickInfo.date);
    if (openPicker === "START_DATE") {
      setStartDate(clickedDate);
      if (clickedDate > endDate) setEndDate(clickedDate);
      setOpenPicker(null);
    } else if (openPicker === "END_DATE") {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-dvh max-h-dvh flex flex-col bg-white">
        <DrawerHeader className="flex items-center justify-between p-4 h-16 border-b border-gray-100 flex-shrink-0">
          <DrawerClose asChild>
            <button className="p-2"> {/* X 버튼 SVG */} </button>
          </DrawerClose>
          <DrawerTitle className="text-lg font-bold">일정 등록</DrawerTitle>
          <div className="w-10"></div>
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
              {formatDate(startDate)}
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
              {formatDate(endDate)}
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
            <div className="calendar-with-toggles-container my-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4 px-2">
                <label
                  htmlFor="drawer-all-day"
                  className="text-lg cursor-pointer font-semibold flex items-center"
                >
                  {" "}
                  <span className="mr-2 text-purple-600">하루 종일</span>{" "}
                  <CustomSwitch
                    id="drawer-all-day"
                    checked={isAllDay}
                    onChange={setIsAllDay}
                  />{" "}
                </label>
                <label
                  htmlFor="drawer-repeat"
                  className="text-lg cursor-pointer font-semibold flex items-center"
                >
                  {" "}
                  <span className="mr-2">매주 반복</span>{" "}
                  <CustomSwitch
                    id="drawer-repeat"
                    checked={isRepeat}
                    onChange={setIsRepeat}
                  />{" "}
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
                  const isInRange = isWithinInterval(date, {
                    start: startOfDay(startDate),
                    end: startOfDay(endDate),
                  });
                  const isStartDate =
                    date.toDateString() === startDate.toDateString();
                  const isEndDate =
                    date.toDateString() === endDate.toDateString();
                  if (isInRange) cellEl.classList.add("in-range");
                  else cellEl.classList.remove("in-range");
                  if (isStartDate) cellEl.classList.add("range-start");
                  else cellEl.classList.remove("range-start");
                  if (isEndDate) cellEl.classList.add("range-end");
                  else cellEl.classList.remove("range-end");
                  if (isStartDate && isEndDate)
                    cellEl.classList.add("single-date");
                  else cellEl.classList.remove("single-date");
                }}
                // --- 2. dayCellContent 타입 적용 ---
                dayCellContent={(arg: DayCellContentArg) => {
                  // @fullcalendar/core에서 가져온 타입 사용
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
                if (openPicker === "START_TIME") setStartDate(newDate);
                else setEndDate(newDate);
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
              {" "}
              {scheduleColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2"
                      : "hover:scale-110",
                    `ring-[${color.hex}]`
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}{" "}
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
            등록
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
