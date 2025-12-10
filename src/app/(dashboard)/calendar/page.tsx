"use client";
import React, { useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";

// useRouter는 현재 사용하지 않으므로 삭제
// import { useRouter } from "next/navigation";
import { parseISO, startOfDay } from "date-fns";

import "./calendar.css";
import { DayScheduleDialog } from "./components/DayScheduleDialog";
// ScheduleCreateDrawer 임포트
import { ScheduleCreateDrawer } from "./components/ScheduleCreateDrawer";
import { useCalendarView } from "./hooks/use-calendar-view";
import { useCalendarResisterBaseInfo } from "./hooks/use-calendar-create";
import { useMutation } from "@tanstack/react-query";
import { CalendarCreateRequest1 } from "@/apis/generated/Api";
import { createCalendarBaseInfo } from "@/api/calendar";

// CalendarEvent 인터페이스에 startTime, endTime이 string | undefined 일 수 있으므로
// Omit을 사용할 때를 대비해 명확히 정의합니다.
// (기존 코드와 동일하게 유지)
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601 날짜 문자열 (예: "2025-10-20")
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
  // allDay가 false일 때 사용되는 상세 시간 정보
  startTime?: string; // 예: "오후 02:00"
  endTime?: string; // 예: "오후 03:00"

  // FullCalendar 색상 속성 (동적으로 추가)
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  // --- ScheduleCreateDrawer와 데이터 연동을 위한 추가 필드 ---
  // (실제로는 start/end/allDay로 FullCalendar에 전달하지만,
  //  수정/생성 시 폼 데이터를 채우기 위해 Date 객체를 저장해두는 것이 편합니다.)
  //  하지만 여기서는 간단하게 유지하기 위해 기존 필드만 사용하겠습니다.
  //  대신, start/end를 Date 객체로 파싱해서 사용해야 합니다.
}

// ScheduleCreateDrawer로 전달할 이벤트 데이터 타입 (id가 없는 버전)
export type NewEventData = Omit<CalendarEvent, "id">;

export default function CalendarPage() {
  // const router = useRouter(); // 현재 사용하지 않음
  const [calendarTitle, setCalendarTitle] = useState("");

  // 현재 보고 있는 캘린더의 기준 날짜 상태 추가 (초기값: 오늘)
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  const { events: serverEvents, isLoading } = useCalendarView(currentViewDate);
  
  const {mutate:registerBaseInfo, isPending }= useCalendarResisterBaseInfo();

  // --- 모든 상태를 page.tsx에서 관리 ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // DayScheduleDialog (작은 모달) 상태
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  // ScheduleCreateDrawer (풀스크린 드로워) 상태
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  // --- 수정할 이벤트를 저장할 상태 ---
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  // ---------------------------------

  // 이벤트 데이터
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const calendarRef = useRef<FullCalendar>(null);

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.prev();
  };
  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.next();
  };

  // 날짜 클릭 핸들러 (작은 모달 열기)
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date); // 날짜 저장
    setIsScheduleDialogOpen(true); // 작은 모달 열기
  };

  // 이벤트 클릭 핸들러 (다이얼로그에서만 사용)
  const handleEventClickFromDialog = (event: CalendarEvent) => {
    setEditingEvent(event); // 수정할 이벤트 설정
    setIsCreateDrawerOpen(true); // 드로워 열기 (수정 모드)
  };

  const handleDatesSet = (arg: {
    view: { title: React.SetStateAction<string> };
  }) => {
    setCalendarTitle(arg.view.title);
  };

  // DayScheduleDialog에 전달할 이벤트 필터링
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDayStart = startOfDay(selectedDate);

    return events.filter((event) => {
      const eventStart = startOfDay(parseISO(event.start));
      // FullCalendar의 end는 exclusive이므로 -1일 해야 실제 종료일
      const eventEnd = event.end
        ? startOfDay(
            new Date(parseISO(event.end).getTime() - 24 * 60 * 60 * 1000)
          )
        : eventStart;

      // 선택한 날짜가 이벤트 범위에 포함되는지 확인
      return selectedDayStart >= eventStart && selectedDayStart <= eventEnd;
    });
  }, [selectedDate, events]);

  // DayScheduleDialog가 호출할 함수 (드로워 열기 - '생성' 모드)
  const handleOpenCreateDrawer = (date: Date) => {
    setEditingEvent(null); // 수정 모드 해제
    setSelectedDate(date); // 선택된 날짜 설정 (드로워 초기값)
    setIsCreateDrawerOpen(true); // '일정 등록' 드로워 열기
  };

  // --- CRUD 핸들러 ---

  // ScheduleCreateDrawer가 호출할 함수 (이벤트 생성)
  const handleEventCreated = (newEvent: NewEventData) => {
    console.log("🔵 Received newEvent from drawer:", newEvent);

    // 색상 hex값 매핑
    const colorHexMap: { [key: string]: string } = {
      salmon: "#FDB0A8",
      orange: "#F9B283",
      yellow: "#FADF84",
      lightPurple: "#B8B3F9",
      darkPurple: "#8668F9",
      blue: "#77ABF8",
    };
    // FullCalendar 표준 형식으로 이벤트 생성
    const eventWithId: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      allDay: true, // 명시적으로 true 설정
      color: newEvent.color, // 내부 참조용
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      backgroundColor: colorHexMap[newEvent.color || "orange"],
      borderColor: colorHexMap[newEvent.color || "orange"],
      textColor: "#222",
    };

    console.log("🟢 Created eventWithId:", eventWithId);
    console.log("📅 FullCalendar format check:");
    console.log("  - start:", eventWithId.start);
    console.log("  - end:", eventWithId.end);
    console.log("  - allDay:", eventWithId.allDay);
    console.log("  - backgroundColor:", eventWithId.backgroundColor);

    const newEvents = [...events, eventWithId];
    console.log("📊 All events:", newEvents);
    setEvents(newEvents);

    // FullCalendar API로 이벤트 확인
    setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        const fcEvents = calendarApi.getEvents();
        console.log("🔍 FullCalendar events:", fcEvents);
        fcEvents.forEach((e) => {
          console.log(
            `  Event: ${e.title}, start: ${e.start}, end: ${e.end}, allDay: ${e.allDay}`
          );
        });
      }
    }, 100);

    setIsCreateDrawerOpen(false); // 드로워 닫기
  };

  // ScheduleCreateDrawer가 호출할 함수 (이벤트 수정)
  const handleEventUpdated = (updatedEvent: CalendarEvent) => {
    // 색상 hex값 매핑
    const colorHexMap: { [key: string]: string } = {
      salmon: "#FDB0A8",
      orange: "#F9B283",
      yellow: "#FADF84",
      lightPurple: "#B8B3F9",
      darkPurple: "#8668F9",
      blue: "#77ABF8",
    };
    const updatedEventWithColor = {
      ...updatedEvent,
      backgroundColor: colorHexMap[updatedEvent.color || "orange"],
      borderColor: colorHexMap[updatedEvent.color || "orange"],
      textColor: "#222",
    };
    setEvents(
      events.map((e) => (e.id === updatedEvent.id ? updatedEventWithColor : e))
    );
    setIsCreateDrawerOpen(false); // 드로워 닫기
  };

  // ScheduleCreateDrawer가 호출할 함수 (이벤트 삭제)
  const handleEventDeleted = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setIsCreateDrawerOpen(false); // 드로워 닫기
  };

  // --- 드로워 닫기 처리 ---
  const handleDrawerOpenChange = (open: boolean) => {
    setIsCreateDrawerOpen(open);
    if (!open) {
      // 드로워가 닫힐 때 (X 버튼, 바깥 클릭, 저장/수정/삭제 완료 등)
      // 수정 상태를 초기화
      setEditingEvent(null);
    }
  };

   

  return (
    <>
      <div className="w-full h-full bg-white custom-calendar-container">
        <div className="flex flex-col bg-white rounded-lg shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)] h-full">
          <div className="w-full h-15.5 flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button onClick={handlePrevClick} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">{calendarTitle}</h2>
            <button onClick={handleNextClick} className="p-1">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 p-4 bg-white">
            <FullCalendar
              key={events.length}
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              headerToolbar={false}
              titleFormat={{ year: "numeric", month: "long" }}
              locale="ko"
              dayHeaderContent={(args) => {
                const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                return dayNames[args.date.getDay()];
              }}
              height="100%"
              displayEventEnd={false}
              displayEventTime={false}
              dayMaxEvents={3}
              moreLinkClick="popover"
              dayHeaderClassNames="custom-day-header"
              dayCellClassNames="custom-day-cell"
              dayCellContent={(arg) => {
                const dayNumber = arg.dayNumberText.replace("일", "");
                return <span className="fc-day-number">{dayNumber}</span>;
              }}
              datesSet={handleDatesSet}
              eventContent={(eventInfo) => {
                return (
                  <div
                    style={{
                      backgroundColor: eventInfo.event.backgroundColor,
                      borderRadius: "4px",
                      padding: "2px 4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.75rem",
                      color: "#222",
                    }}
                  >
                    {eventInfo.event.title}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* --- 다이얼로그와 드로워 렌더링 --- */}

      {/* 작은 모달 */}
      <DayScheduleDialog
        isOpen={isScheduleDialogOpen}
        setIsOpen={setIsScheduleDialogOpen}
        date={selectedDate}
        events={eventsForSelectedDate}
        onAddScheduleClick={handleOpenCreateDrawer}
        onEventClick={handleEventClickFromDialog}
      />

      {/* '일정 등록/수정' 드로워 */}
      <ScheduleCreateDrawer
        isOpen={isCreateDrawerOpen}
        setIsOpen={handleDrawerOpenChange} // 수정된 핸들러 사용
        initialDate={selectedDate}
        editingEvent={editingEvent} // 수정할 이벤트 전달
        onEventCreated={handleEventCreated} // 생성 핸들러
        onEventUpdated={handleEventUpdated} // 수정 핸들러
        onEventDeleted={handleEventDeleted} // 삭제 핸들러
      />
    </>
  );
}
