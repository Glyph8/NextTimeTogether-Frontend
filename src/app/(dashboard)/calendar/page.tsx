"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";

// useRouter는 현재 사용하지 않으므로 삭제
// import { useRouter } from "next/navigation";
import { format, parseISO, startOfDay } from "date-fns";

import "./calendar.css";
import { DayScheduleDialog } from "./components/DayScheduleDialog";
// ScheduleCreateDrawer 임포트
import { ScheduleCreateDrawer } from "./components/ScheduleCreateDrawer";
import { useCalendarView } from "./hooks/use-calendar-view";
import {
  useCalendarCreate,
  useCalendarResisterBaseInfo,
} from "./hooks/use-calendar-create";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarCreateRequest1,
  CalendarCreateRequest2,
} from "@/apis/generated/Api";
import { createCalendarBaseInfo } from "@/api/calendar";
import { convertToCompactISO, convertToLocalDateTime } from "./utils/date-util";
import { ko } from "date-fns/locale";

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
  place?: string;
  memo?: string;
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

interface ExtendedNewEventData extends NewEventData {
  place?: string;
  memo?: string;
}

export default function CalendarPage() {
  // const router = useRouter(); // 현재 사용하지 않음
  const [calendarTitle, setCalendarTitle] = useState("");

  // 현재 보고 있는 캘린더의 기준 날짜 상태 추가 (초기값: 오늘)
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  const { events: serverEvents, isLoading } = useCalendarView(currentViewDate);

  const { mutateAsync: registerBaseInfo, isPending: isBasePending } =
    useCalendarResisterBaseInfo();
  const { mutateAsync: registerTimeInfo, isPending: isTimePending } =
    useCalendarCreate();
  const isSubmitting = isBasePending || isTimePending;

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

  useEffect(() => {
    if (serverEvents && serverEvents.length > 0) {
      // 서버 데이터를 UI 포맷에 맞게 변환
      const mappedEvents: CalendarEvent[] = serverEvents.map((evt: { start: string; end: string; color: string | undefined; }) => {
        const startDate = parseISO(evt.start);
        const endDate = evt.end ? parseISO(evt.end) : undefined;

        return {
          ...evt,
          // 1) FullCalendar 필수 필드 (이미 Hook에서 start/end는 ISO로 옴)
          start: evt.start,
          end: evt.end,

          // 2) UI 표시용 포맷 생성 (DayScheduleDialog 등에서 사용)
          // 예: "2024-12-12T14:30:00" -> "오후 02:30"
          startTime: format(startDate, "a hh:mm", { locale: ko }),
          endTime: endDate ? format(endDate, "a hh:mm", { locale: ko }) : undefined,

          // 3) 색상 및 스타일 지정 (서버에 색상 정보가 없으므로 클라이언트에서 지정)
          // evt.color 값이 있다면 매핑하고, 없다면 기본값 할당
          backgroundColor: mapColor(evt.color) || "#F9B283", // 기본: 오렌지
          borderColor: mapColor(evt.color) || "#F9B283",
          textColor: "#222",
          allDay: false, // 시간 정보가 있으므로 false (필요시 로직 추가)
        };
      });
      setEvents(mappedEvents);
    }
  }, [serverEvents]);

  // [Helper] 색상 매핑 함수 (컴포넌트 내부 혹은 외부에 정의)
  const mapColor = (colorKey?: string) => {
    const colorHexMap: { [key: string]: string } = {
      salmon: "#FDB0A8",
      orange: "#F9B283",
      yellow: "#FADF84",
      lightPurple: "#B8B3F9",
      darkPurple: "#8668F9",
      blue: "#77ABF8",
    };
    return colorKey ? colorHexMap[colorKey] : undefined;
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
  // const handleEventCreated = (newEvent: NewEventData) => {
  const handleEventCreated = async (newEvent: ExtendedNewEventData) => {
    console.log("🔵 드로워 원본 데이터:", newEvent);

    // TODO : 백엔드 API에 색상 없음.. 색상 hex값 매핑
    // const colorHexMap: { [key: string]: string } = {

    try {
      console.log("🚀 일정 생성 프로세스 시작");

      // ---------------------------------------------------------
      // 1. [준비] 클라이언트 사이드 ID 생성 (Time Format)
      //    서버 ID를 쓰더라도, encStartTimeAndEndTime 값 생성을 위해 이 로직은 필요합니다.
      // ---------------------------------------------------------
      // const formattedStart = convertToCompactISO(
      //   newEvent.start,
      //   newEvent.startTime
      // );

      // // [타입 에러 수정 반영] 종료일이 없으면 시작일로 대체
      // const formattedEnd = convertToCompactISO(
      //   newEvent.end || newEvent.start,
      //   newEvent.endTime,
      //   true
      // );
      const startLocalDateTime = convertToLocalDateTime(
      newEvent.start,
      newEvent.startTime
    );

    const endLocalDateTime = convertToLocalDateTime(
      newEvent.end || newEvent.start,
      newEvent.endTime,
      true
    );

      // "20251129T1430-20251129T1530" 형식의 문자열
      // const generatedTimeFormatId = `${formattedStart}-${formattedEnd}`;

      // ---------------------------------------------------------
      // 2. [요청] 1단계: 기본 정보 등록
      // ---------------------------------------------------------
      const baseInfoBody: CalendarCreateRequest1 = {
        title: newEvent.title,
        content: newEvent.memo || "",
        placeName: newEvent.place || "",
        purpose: "PERSONAL_SCHEDULE",
        placeAddr: "",
        placeInfo: "",
      };

      // 서버 응답 대기
      const baseResponse = await registerBaseInfo(baseInfoBody);
      const finalScheduleId = baseResponse?.result?.scheduleId;

      if (!finalScheduleId) {
        throw new Error("스케줄 ID를 결정할 수 없습니다.");
      }

      // TODO : 아직 암호화 미적용. 추후 암호화 적용
      const combinedEncStr = `${finalScheduleId}${startLocalDateTime}${endLocalDateTime}`;
    
      console.log("🔏 생성된 암호화용 문자열:", combinedEncStr);
      // ---------------------------------------------------------
      // 4. [요청] 2단계: 시간 정보 등록
      // ---------------------------------------------------------
      const timeInfoBody: CalendarCreateRequest2 = {
        timeStampInfo: newEvent.start,
        encStartTimeAndEndTime: combinedEncStr,
      };

      await registerTimeInfo(timeInfoBody);

      console.log("🎉 모든 단계 완료");
      setIsCreateDrawerOpen(false);
    } catch (error) {
      console.error("일정 생성 실패:", error);
      // alert("일정 생성에 실패했습니다."); // 필요 시 주석 해제
    }
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
