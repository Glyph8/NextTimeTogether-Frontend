"use client";
import React, { useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";
import { EventClickArg, EventContentArg } from "@fullcalendar/core/index.js";
import { useRouter } from "next/navigation";
import { isSameDay, parseISO } from "date-fns";

// 1. CSS와 다이얼로그 임포트
import "./calendar.css";
import { DayScheduleDialog } from "./components/DayScheduleDialog";
// --- 2. 새로 만든 ScheduleCreateDrawer 임포트 ---
import { ScheduleCreateDrawer } from "./components/ScheduleCreateDrawer";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?:
    | "salmon"
    | "orange"
    | "yellow"
    | "lightPurple"
    | "darkPurple"
    | "blue"
    | string;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [calendarTitle, setCalendarTitle] = useState("");

  // --- 3. 모든 상태를 page.tsx에서 관리 ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // DayScheduleDialog (작은 모달) 상태
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  // ScheduleCreateDrawer (풀스크린 드로워) 상태
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  // ------------------------------------------

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "팀 회의",
      start: "2025-10-20",
      color: "blue",
      allDay: false,
      startTime: "오후 02:00",
      endTime: "오후 03:00",
    },
    {
      id: "2",
      title: "프로젝트 마감",
      start: "2025-10-25",
      color: "salmon",
      allDay: true,
    },
    {
      id: "3",
      title: "멀미공 시험",
      start: "2025-10-20",
      color: "orange",
      allDay: true,
    },
  ]);

  const calendarRef = useRef<FullCalendar>(null);

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.prev();
  };
  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.next();
  };

  // 4. 날짜 클릭 핸들러 (작은 모달 열기)
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date); // 날짜 저장
    setIsScheduleDialogOpen(true); // 작은 모달 열기
  };

  // 5. 이벤트(알약) 클릭 핸들러
  const handleEventClick = (clickInfo: EventClickArg) => {
    // TODO: '일정 수정' 드로워를 여는 로직으로 변경해야 함
    // (지금은 임시로 detail 페이지로 이동)
    // router.push(`/schedules/detail/${clickInfo.event.id}`);

    // (임시) 수정 로직
    alert(`'${clickInfo.event.title}' 수정 드로워 열기 (구현 필요)`);
  };

  const handleDatesSet = (arg: {
    view: { title: React.SetStateAction<string> };
  }) => {
    setCalendarTitle(arg.view.title);
  };

  // DayScheduleDialog에 전달할 이벤트 필터링
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((event) =>
      isSameDay(parseISO(event.start), selectedDate)
    );
  }, [selectedDate, events]);

  // --- 6. DayScheduleDialog가 호출할 함수 (드로워 열기) ---
  const handleOpenCreateDrawer = (date: Date) => {
    // DayScheduleDialog가 이 함수를 호출하면...
    setSelectedDate(date); // 날짜를 다시 확인하고
    setIsCreateDrawerOpen(true); // '일정 등록' 드로워를 엽니다.
  };
  // ---------------------------------------------------

  // TODO: ScheduleCreateDrawer가 호출할 함수 (이벤트 생성)
  // const handleEventCreated = (newEvent: Omit<CalendarEvent, 'id'>) => {
  //   const eventWithId = { ...newEvent, id: Date.now().toString() };
  //   setEvents([...events, eventWithId]);
  // };

  return (
    <>
      {" "}
      <div className="w-full h-full bg-white custom-calendar-container">
        {" "}
        <div className="flex flex-col bg-white rounded-lg shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)] h-full">
          <div className="w-full h-15.5 flex items-center justify-between px-4 py-3 border-b border-gray-200">
            {" "}
            <button onClick={handlePrevClick} className="p-1">
              <ArrowLeft className="w-6 h-6" />{" "}
            </button>{" "}
            <h2 className="text-lg font-bold text-gray-800">
              {calendarTitle}{" "}
            </h2>{" "}
            <button onClick={handleNextClick} className="p-1">
              <ArrowRight className="w-6 h-6" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex-1 p-4 bg-white">
            {" "}
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate="2025-10-01"
              events={events}
              dateClick={handleDateClick} // 4. 날짜 클릭
              eventClick={handleEventClick} // 5. 이벤트 클릭
              headerToolbar={false}
              titleFormat={{ year: "numeric", month: "long" }}
              locale="ko"
              dayHeaderContent={(args) => {
                const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                return dayNames[args.date.getDay()];
              }}
              height="100%"
              eventDisplay="block"
              displayEventEnd={false}
              dayMaxEvents={3}
              moreLinkClick="popover"
              dayHeaderClassNames="custom-day-header"
              dayCellClassNames="custom-day-cell"
              eventClassNames="custom-event-pill"
              dayCellContent={(arg) => {
                const dayNumber = arg.dayNumberText.replace("일", "");
                return <span className="fc-day-number">{dayNumber}</span>;
              }}
              datesSet={handleDatesSet}
              eventContent={renderEventContent}
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* --- 7. 다이얼로그와 드로워 렌더링 --- */}
      {/* 작은 모달 */}
      <DayScheduleDialog
        isOpen={isScheduleDialogOpen}
        setIsOpen={setIsScheduleDialogOpen}
        date={selectedDate}
        events={eventsForSelectedDate}
        // "일정 추가" 누르면 handleOpenCreateDrawer 함수 호출
        onAddScheduleClick={handleOpenCreateDrawer}
      />
      {/* '일정 등록' 드로워 */}
      <ScheduleCreateDrawer
        isOpen={isCreateDrawerOpen}
        setIsOpen={setIsCreateDrawerOpen}
        initialDate={selectedDate}
        // TODO: onEventCreated={handleEventCreated}
      />
    </>
  );
}

// 이벤트 알약 렌더링 함수 (변경 없음)
function renderEventContent(eventInfo: EventContentArg) {
  const color = (eventInfo.event.extendedProps.color as string) || "orange";

  const colorMap: { [key: string]: string } = {
    salmon: "bg-rose-100 text-rose-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    lightPurple: "bg-purple-100 text-purple-700",
    darkPurple: "bg-indigo-100 text-indigo-700",
    blue: "bg-blue-100 text-blue-700",
  };

  const pillClass = colorMap[color] || colorMap["orange"];

  return (
    <div
      className={`truncate text-xs font-medium rounded px-1.5 py-0.5 ${pillClass}`}
    >
      {eventInfo.event.title}
    </div>
  );
}
