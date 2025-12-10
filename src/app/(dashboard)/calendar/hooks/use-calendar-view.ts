import { getCalendarInfoList, getEncTimeStampList } from "@/api/calendar";
import { useAuthStore } from "@/store/auth.store";
import { generateMonthDates, parseScheduleIdToDates } from "../utils/date-util";
import { useQuery } from "@tanstack/react-query";
import { CalendarViewRequest2 } from "@/apis/generated/Api";

// TODO : 실제 데이터 받아보기 전까지 모름,,
export interface CalendarDetail {
  scheduleId: string
  title: string
  start: string
  end: string
  content: string
  placeName: string
}

export const useCalendarView = (date: Date) => {
  const userId = useAuthStore((state) => state.userId);

  // 1. 조회할 날짜 범위 생성
  const timeStampInfoList = generateMonthDates(date);

  // 2. [Query 1] 스케줄 ID 목록 조회 (암호화된 타임스탬프 리스트)
  const { data: idListData, isLoading: isIdLoading } = useQuery({
    queryKey: ["calendarIds", userId, date.getFullYear(), date.getMonth()],
    queryFn: async () => {
      return await getEncTimeStampList({ timeStampInfoList });
    },
    enabled: !!userId, // 유저 ID가 있을 때만 실행
    staleTime: 1000 * 60 * 5,
  });

  // Query 1의 결과에서 ID 배열 추출
  // (API 응답 구조에 따라 경로가 다를 수 있으니 확인 필요. 예시: result.encTimeStampList)
  const scheduleIds: string[] = idListData?.result?.encTimeStampList || [];

  // 3. [Query 2] 상세 일정 조회 (Dependent Query)
  // Query 1이 성공해서 scheduleIds가 있을 때만 실행됩니다.
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["calendarEvents", scheduleIds], // ID 목록이 바뀌면 재요청
    queryFn: async () => {
      // 요청 DTO 구성 (CalendarViewRequest2 타입 준수)
      const requestBody: CalendarViewRequest2 = {
        scheduleIdList: scheduleIds, // API 명세에 맞는 필드명 사용
      };
      return await getCalendarInfoList(requestBody);
    },
    // ID 목록이 비어있지 않을 때만 실행하여 불필요한 호출 방지
    enabled: scheduleIds.length > 0, 
    staleTime: 1000 * 60 * 5,
  });

  // 4. [Data Transformation] UI에 맞는 형태로 데이터 가공
  // 서버 데이터를 그대로 내보내지 않고, FullCalendar가 이해하는 'events' 형태로 변환합니다.
  const events = (eventsData?.result || []).map((serverEvent: CalendarDetail) => {
    // ScheduleId에서 날짜/시간 정보 복원
    const { start, end } = parseScheduleIdToDates(serverEvent.scheduleId);
    
    return {
      id: serverEvent.scheduleId,
      title: serverEvent.title,
      // FullCalendar 필수 필드 매핑
      start: start || date.toISOString(), // 파싱 실패 시 현재 뷰 날짜로 폴백
      end: end, 
      // 추가 정보 매핑 (상세 모달용)
      memo: serverEvent.content,
      place: serverEvent.placeName,
      // 기타 스타일링 등
      // color: serverEvent.color // (백엔드에 색상 필드가 있다면)
    };
  });

  return {
    dates: timeStampInfoList,
    events: events, // 가공된 이벤트 리스트 반환
    // 두 쿼리 중 하나라도 로딩 중이면 isLoading = true
    isLoading: isIdLoading || isEventsLoading,
    isError: !idListData && !eventsData, // 에러 처리 로직 보강 가능
  };
};
