"use client";
import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-gray.svg";
import ArrowRight from "@/assets/svgs/icons/arrow-right-gray.svg";
import { EventClickArg } from "@fullcalendar/core/index.js";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
}

export default function CalendarPage() {
  // const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarTitle, setCalendarTitle] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "팀 회의",
      start: "2025-09-20",
      color: "#3b82f6",
    },
    {
      id: "2",
      title: "프로젝트 마감",
      start: "2025-09-25",
      end: "2025-09-27",
      color: "#ef4444",
    },
    {
      id: "3",
      title: "휴가",
      start: "2025-09-28",
      end: "2025-09-30",
      color: "#10b981",
    },
  ]);

  // (1) FullCalendar 컴포넌트를 참조할 ref 생성
  const calendarRef = useRef<FullCalendar>(null);

  // (2) 이전/다음 버튼 클릭 핸들러 생성
  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };
  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt("일정 제목을 입력하세요:");
    if (title) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title,
        start: arg.dateStr,
        end: arg.dateStr + 1,
        color: "#8b5cf6",
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  // datesSet 이벤트 핸들러: 달력 날짜가 변경될 때마다 실행됩니다.
  const handleDatesSet = (arg: {
    view: { title: React.SetStateAction<string> };
  }) => {
    // arg.view.title 에 현재 달력의 제목이 들어있습니다. (예: "2025년 8월")
    // 이 값을 우리 state에 업데이트합니다.
    setCalendarTitle(arg.view.title);
  };

  return (
    <div className="w-full h-full bg-white custom-calendar-container">
      <div className="flex flex-col bg-white rounded-lg shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)] h-full">
        {/* --- ▼▼▼ 직접 만드는 커스텀 헤더 ▼▼▼ --- */}
        <div className="w-full h-15.5 flex items-center justify-between px-4 py-3 border-b border-gray-200">
          {/* 이전 달 버튼 */}
          <button
            onClick={handlePrevClick}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {/* 현재 날짜 Title */}
          <h2 className="text-lg font-bold text-gray-800">
            {calendarTitle}
            {/* {`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`} */}
          </h2>
          {/* 다음 달 버튼 */}
          <button
            onClick={handleNextClick}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-4 bg-white">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={false} // (5) 기본 헤더는 완전히 숨김
            titleFormat={{ year: "numeric", month: "long" }}
            dayHeaderFormat={{ weekday: "short" }}
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
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
            dayCellClassNames="hover:bg-white cursor-pointer transition-colors"
            dayHeaderClassNames="line-height bg-white h-9.5 text-xs text-gray-1 font-medium leading-10 py-2"
            eventBackgroundColor="transparent"
            eventBorderColor="transparent"
            eventTextColor="#ffffff"
            /* --- ▼▼▼ 셀 커스터마이징 ▼▼▼ --- */
            dayCellContent={(arg) => {
              // (4) 날짜 숫자만 표시하도록 가공
              const dayNumber = arg.dayNumberText.replace("일", "");
              return <span className="fc-day-number">{dayNumber}</span>;
            }}
            datesSet={handleDatesSet}
          />
        </div>
      </div>
    </div>
  );
}
