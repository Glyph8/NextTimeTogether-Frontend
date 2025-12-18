import { getCalendarInfoList, getEncTimeStampList } from "@/api/calendar";
import { useAuthStore } from "@/store/auth.store";
import {
  generateMonthDates,
  parseEncryptedString,
  parseScheduleIdToDates,
} from "../utils/date-util";
import { useQuery } from "@tanstack/react-query";
import { CalendarViewRequest2 } from "@/apis/generated/Api";
import { useMemo } from "react";

// TODO : 실제 데이터 받아보기 전까지 모름,,
export interface CalendarDetail {
  scheduleId: string;
  title: string;
  start: string;
  end: string;
  content: string;
  placeName: string;
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

  // const scheduleIds: string[] = idListData?.result?.encTimeStampList || [];

  // Query 1의 결과(긴 문자열 배열)를 파싱하여 Map으로 변환
  // Key: scheduleId, Value: { start, end }
  const scheduleMap = useMemo(() => {
    const rawList = idListData?.result?.encTimeStampList || [];
    const map = new Map<string, { start: string; end: string }>();

    rawList.forEach((str: string) => {
      // 파싱 함수 호출
      const { scheduleId, start, end } = parseEncryptedString(str);
      map.set(scheduleId, { start, end });
    });

    return map;
  }, [idListData]);

  // Query 2에 보낼 ID 배열 추출 (Map의 Key들만 모음)
  const scheduleIds = useMemo(
    () => Array.from(scheduleMap.keys()),
    [scheduleMap]
  );

  // 3. [Query 2] 상세 일정 조회 (Dependent Query)
  // Query 1이 성공해서 scheduleIds가 있을 때만 실행됩니다.
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["calendarEvents", scheduleIds], // ID 목록이 바뀌면 재요청
    queryFn: async () => {
      // TODO : 복호화 필요 예상
      // TODO : 텍스트 파싱하여서, '97582bfc-1669-4e8d-b09c-043a0fa8b8f32025-12-12T00:00:00.0002025-12-13T23:59:00.000'
      // 앞에서 스케쥴 아이디를 요청에 담기, 해당 스케쥴 아이디의 응답을 파싱한 텍스트에서 시작 시간과 종료 시간과 함께 묶어서 반환하기

      const requestBody: CalendarViewRequest2 = {
        scheduleIdList: scheduleIds, // API 명세에 맞는 필드명 사용
      };
      return await getCalendarInfoList(requestBody);
    },
    // ID 목록이 비어있지 않을 때만 실행하여 불필요한 호출 방지
    enabled: scheduleIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const events = useMemo(() => {
    const serverEvents = eventsData?.result || [];

    return serverEvents.map((serverEvent: CalendarDetail) => {
      // Map에서 해당 ID의 시간 정보를 가져옴
      const timeInfo = scheduleMap.get(serverEvent.scheduleId);

      return {
        id: serverEvent.scheduleId,
        title: serverEvent.title,

        // Query 1에서 파싱해둔 시간 정보 사용
        // (만약 Map에 없다면 Fallback으로 현재 날짜 사용)
        start: timeInfo?.start || date.toISOString(),
        end: timeInfo?.end,

        // 상세 정보 매핑
        memo: serverEvent.content,
        place: serverEvent.placeName,
        // color: serverEvent.color
      };
    });
  }, [eventsData, scheduleMap, date]);

  return {
    dates: timeStampInfoList,
    events: events, // 가공된 이벤트 리스트 반환
    // 두 쿼리 중 하나라도 로딩 중이면 isLoading = true
    isLoading: isIdLoading || isEventsLoading,
    isError: !idListData && !eventsData, // 에러 처리 로직 보강 가능
  };
};
