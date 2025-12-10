import { getEncTimeStampList } from "@/api/calendar";
import { useAuthStore } from "@/store/auth.store"
import { getMasterKey } from "@/utils/client/key-storage";
import { generateMonthDates } from "../utils/date-util";
import { useQuery } from "@tanstack/react-query";

export const useCalendarView = (date: Date) => {
  const userId = useAuthStore((state) => state.userId); // Selector 패턴 권장 (최적화)

  // 1. 날짜 배열 생성 (useMemo를 써도 되지만, 연산이 가벼워 변수로도 충분함)
  const timeStampInfoList = generateMonthDates(date);

  // 2. 비동기 데이터 패칭 (React Query 활용)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["calendar", userId, date.getFullYear(), date.getMonth()], // 날짜가 바뀌면 재요청
    queryFn: async () => {
      // 비동기 함수들(키 조회 -> API 요청)을 순차적으로 실행
      const masterKey = await getMasterKey();
      
      // 필요한 파라미터 구조에 맞춰 전달
      return await getEncTimeStampList({
        timeStampInfoList,
        // masterKey가 필요하다면 여기서 인자로 전달하거나 API 내부에서 처리
      });
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐싱 (포트폴리오 포인트)
  });



  
  return {
    dates: timeStampInfoList,
    events: data,
    isLoading,
    isError,
  };
};