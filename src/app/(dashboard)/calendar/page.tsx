"use client";

import toast from "react-hot-toast";
import React, { useRef, useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";

import { useRouter } from "next/navigation";
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
import { CalendarCreateRequest1, CalendarCreateRequest2 } from "@/apis/generated/Api";
import { convertToLocalDateTime, generateMonthDates, parseScheduleIdToDates } from "./utils/date-util";
import { ko } from "date-fns/locale";
import { useSchedules } from "../appointment/hooks/useSchedules";
import { useQueryClient } from "@tanstack/react-query";
import { updateCalendarSchedule } from "@/api/calendar";
import { mapColor } from "./utils/calendar-helper";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { extractScheduleList } from "@/utils/schedule/extract-schedule-list";



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

  eventType?: 'PERSONAL' | 'APPOINTMENT'; // 캘린더 일정인지 약속인지 구분
}

// ScheduleCreateDrawer로 전달할 이벤트 데이터 타입 (id가 없는 버전)
export type NewEventData = Omit<CalendarEvent, "id">;

interface ExtendedNewEventData extends NewEventData {
  place?: string;
  memo?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [calendarTitle, setCalendarTitle] = useState("");
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  // UI 상태 관리
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // 2. 데이터 조회
  const { events: serverEvents, isLoading: isEventsLoading } = useCalendarView(currentViewDate); //
  const { data: schedulesData, isPending: isSchedulesLoading } = useSchedules({
    targetDates: generateMonthDates(currentViewDate),
  });

  const { mutateAsync: registerBaseInfo } = useCalendarResisterBaseInfo();
  const { mutateAsync: registerTimeInfo } = useCalendarCreate();


  // 3. 약속 리스트 추출 (scheduleList)
  const scheduleList = extractScheduleList(schedulesData);

  const events = useMemo(() => {
    let mergedEvents: CalendarEvent[] = [];

    // 1) 개인 일정 (serverEvents) 매핑
    if (serverEvents && serverEvents.length > 0) {
      const mappedPersonalEvents = serverEvents.map((evt: any) => {
        const startDate = parseISO(evt.start);
        const endDate = evt.end ? parseISO(evt.end) : undefined;

        return {
          ...evt,
          start: evt.start,
          end: evt.end,
          startTime: format(startDate, "a hh:mm", { locale: ko }),
          endTime: endDate ? format(endDate, "a hh:mm", { locale: ko }) : undefined,
          backgroundColor: mapColor(evt.color) || "#F9B283",
          borderColor: mapColor(evt.color) || "#F9B283",
          textColor: "#222",
          allDay: false,
          eventType: 'PERSONAL',
        };
      });
      mergedEvents = [...mergedEvents, ...mappedPersonalEvents];
    }

    // 2) 약속/모임 일정 (scheduleList) 매핑
    if (scheduleList && scheduleList.length > 0) {
      const mappedScheduleList: CalendarEvent[] = scheduleList
        .map((sch): CalendarEvent | null => {
          if (!sch.scheduleId) return null;

          // ID 파싱 (예: "20251220T0900-...")
          const { start, end } = parseScheduleIdToDates(sch.scheduleId); //

          if (!start) return null; // 파싱 실패 시 제외

          const startDate = parseISO(start);
          const endDate = end ? parseISO(end) : undefined;

          return {
            id: sch.scheduleId,
            title: sch.title ?? "",
            start: start,
            end: end ?? undefined,
            startTime: format(startDate, "a hh:mm", { locale: ko }),
            endTime: endDate ? format(endDate, "a hh:mm", { locale: ko }) : undefined,
            // 약속은 파란색 계열로 표시
            color: "blue",
            backgroundColor: "#77ABF8",
            borderColor: "#77ABF8",
            textColor: "#222",
            allDay: false,
            memo: sch.purpose || "",
            place: "", // 필요 시 데이터 매핑
            eventType: 'APPOINTMENT',
          };
        })
        .filter((evt): evt is CalendarEvent => evt !== null);

      mergedEvents = [...mergedEvents, ...mappedScheduleList];
    }

    return mergedEvents;
  }, [serverEvents, scheduleList]);

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
    if (event.eventType === 'APPOINTMENT') {
      // 1. 약속(모임) 일정이면 상세 페이지로 이동
      // ID가 "20251220T0900-..." 형식이므로 URL에 그대로 사용하거나 
      // 만약 백엔드에서 별도의 숫자 ID를 준다면 그것을 써야 합니다.
      // 현재 코드상으로는 scheduleId가 유일한 식별자입니다.
      router.push(`/appointment/${event.id}/detail`);
      setIsScheduleDialogOpen(false); // 다이얼로그 닫기
    } else {
      // 2. 개인 일정이면 기존처럼 수정 드로워 오픈
      setEditingEvent(event);
      setIsCreateDrawerOpen(true);
      // setIsScheduleDialogOpen(false); // (선택사항) 드로워 열 때 모달 닫고 싶으면 주석 해제
    }
  };

 const handleDatesSet = (arg: {
  view: { 
    title: React.SetStateAction<string>;
    currentStart: Date; // FullCalendar가 제공하는 현재 뷰의 시작 날짜
  };
}) => {
  setCalendarTitle(arg.view.title);
  
  // 🔥 추가: 현재 보고 있는 달의 날짜로 상태 업데이트
  setCurrentViewDate(arg.view.currentStart);
};

  // DayScheduleDialog에 전달할 이벤트 필터링
  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];

    // 선택한 날짜의 시작 시간 (00:00:00)
    const targetDate = startOfDay(selectedDate);

    return events.filter((event) => {
      // 이벤트 시작 날짜 (00:00:00)
      const eventStart = startOfDay(parseISO(event.start));

      let eventEnd = eventStart; // 종료일이 없으면 시작일과 동일하게 간주

      if (event.end) {
        const parsedEnd = parseISO(event.end);

        if (event.allDay) {
          // [Case 1] 하루 종일(allDay) 이벤트
          // FullCalendar는 종료일을 '다음날 00:00'으로 잡으므로 하루를 빼줘야 실제 종료일이 됨
          // 예: 12일 하루 종일 -> start: 12일, end: 13일 -> 13일에서 1ms를 빼서 12일로 만듦
          eventEnd = startOfDay(new Date(parsedEnd.getTime() - 1));
        } else {
          // [Case 2] 시간 지정 이벤트 (약속 포함)
          // 종료일이 같은 날이거나 다른 날일 수 있음. 날짜 그대로 사용해야 함.
          // 예: 12일 09:00 ~ 12일 11:00 -> start: 12일, end: 12일
          eventEnd = startOfDay(parsedEnd);
        }
      }

      // 비교: 선택한 날짜가 [시작일]과 [종료일] 범위 내에 있는지 (Start <= Target <= End)
      return targetDate.getTime() >= eventStart.getTime() &&
        targetDate.getTime() <= eventEnd.getTime();
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
      toast.error("일정 생성에 실패했습니다.");
    }
  };

  // ScheduleCreateDrawer가 호출할 함수 (이벤트 수정)
  const handleEventUpdated = async (updatedEvent: CalendarEvent) => {
    try {
      // 1. 서버에 수정 요청 (API 함수와 훅이 필요합니다)
      await updateCalendarSchedule(updatedEvent);
      console.log("수정 요청 보냄:", updatedEvent);

      // 2. 데이터 갱신 (성공 시 캘린더 다시 불러오기)
      await queryClient.invalidateQueries({ queryKey: ["calendarIds"] });

      // 3. 성공 후 드로워 닫기
      setIsCreateDrawerOpen(false);
      toast.success("일정이 수정되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("일정 수정 실패");
    }
  };

  // ScheduleCreateDrawer가 호출할 함수 (이벤트 삭제)
  const handleEventDeleted = async (eventId: string) => {
    try {
      // 1) 서버에 삭제 요청 API 호출 (예시)
      // await deleteSchedule(eventId); TODO : 삭제 api 없는데?

      console.log("삭제 요청 완료:", eventId);

      // 2) 성공 시 'calendarIds' 쿼리 무효화 -> 데이터를 다시 받아와서 UI가 자동 갱신됨
      await queryClient.invalidateQueries({ queryKey: ["calendarIds"] });

      // 3) 드로워 닫기
      setIsCreateDrawerOpen(false);

    } catch (error) {
      console.error("삭제 실패", error);
      toast.error("일정 삭제에 실패했습니다.");
    }
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

  // 로딩 상태 통합
  const isLoading = isEventsLoading || isSchedulesLoading;

  if (isLoading) {
    return <DefaultLoading />;
  }

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
              key={events.length} // 리렌더링 유발 가능
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
