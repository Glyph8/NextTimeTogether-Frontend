"use client";
import React, { useRef, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";
import { EventClickArg } from "@fullcalendar/core/index.js";
// useRouter는 현재 사용하지 않으므로 삭제
// import { useRouter } from "next/navigation";
import { parseISO, startOfDay, endOfDay } from "date-fns";

import "./calendar.css";
import { DayScheduleDialog } from "./components/DayScheduleDialog";
// ScheduleCreateDrawer 임포트
import { ScheduleCreateDrawer } from "./components/ScheduleCreateDrawer";

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

  // --- 모든 상태를 page.tsx에서 관리 ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // DayScheduleDialog (작은 모달) 상태
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  // ScheduleCreateDrawer (풀스크린 드로워) 상태
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  // --- 수정할 이벤트를 저장할 상태 ---
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  // ---------------------------------

  // 색상 hex값 매핑
  const colorHexMap: { [key: string]: string } = {
    salmon: "#FDB0A8",
    orange: "#F9B283",
    yellow: "#FADF84",
    lightPurple: "#B8B3F9",
    darkPurple: "#8668F9",
    blue: "#77ABF8",
  };

  // 이벤트 데이터에 FullCalendar 색상 속성 추가
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "팀 회의",
      start: "2025-10-20",
      color: "blue",
      allDay: false,
      startTime: "오후 02:00",
      endTime: "오후 03:00",
      backgroundColor: colorHexMap["blue"],
      borderColor: colorHexMap["blue"],
      textColor: "#222",
    },
    {
      id: "2",
      title: "프로젝트 마감",
      start: "2025-10-25",
      color: "salmon",
      allDay: true,
      backgroundColor: colorHexMap["salmon"],
      borderColor: colorHexMap["salmon"],
      textColor: "#222",
    },
    {
      id: "3",
      title: "멀미공 시험",
      start: "2025-10-20",
      color: "orange",
      allDay: true,
      backgroundColor: colorHexMap["orange"],
      borderColor: colorHexMap["orange"],
      textColor: "#222",
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

  // 날짜 클릭 핸들러 (작은 모달 열기)
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date); // 날짜 저장
    setIsScheduleDialogOpen(true); // 작은 모달 열기
  };

  // 이벤트(알약) 클릭 핸들러 (수정 드로워 열기)
  const handleEventClick = (clickInfo: EventClickArg) => {
    //
    // alert(`'${clickInfo.event.title}' 수정 드로워 열기 (구현 필요)`);

    // 전체 events 배열에서 id로 실제 이벤트 객체 찾기
    const eventToEdit = events.find((e) => e.id === clickInfo.event.id);

    if (eventToEdit) {
      setEditingEvent(eventToEdit); // 수정할 이벤트 설정
      setIsCreateDrawerOpen(true); // 드로워 열기 (수정 모드)
    }
  };

  const handleDatesSet = (arg: {
    view: { title: React.SetStateAction<string> };
  }) => {
    setCalendarTitle(arg.view.title);
  };

  // DayScheduleDialog에 전달할 이벤트 필터링 (선택한 날짜가 이벤트의 start~end 범위에 포함될 때도 표시)
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((event) => {
      const startDate = parseISO(event.start);
      // end가 없으면 단일 일정, end가 있으면 범위 일정
      const endDate = event.end ? parseISO(event.end) : startDate;
      // 선택한 날짜가 start~end 사이에 포함되는지 확인
      return (
        selectedDate >= startOfDay(startDate) &&
        selectedDate <= endOfDay(endDate)
      );
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
    // 색상 hex값 매핑
    const colorHexMap: { [key: string]: string } = {
      salmon: "#FDB0A8",
      orange: "#F9B283",
      yellow: "#FADF84",
      lightPurple: "#B8B3F9",
      darkPurple: "#8668F9",
      blue: "#77ABF8",
    };
    const eventWithId: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(), // 임시 고유 ID
      backgroundColor: colorHexMap[newEvent.color || "orange"],
      borderColor: colorHexMap[newEvent.color || "orange"],
      textColor: "#222",
    };
    setEvents([...events, eventWithId]);
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
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              // initialDate="2025-10-01" // 삭제 (오늘 날짜 기준으로 열림)
              events={events}
              dateClick={handleDateClick} // 날짜 클릭
              eventClick={handleEventClick} // 이벤트 클릭
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
