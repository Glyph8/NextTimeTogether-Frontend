/**
 * 날짜 객체를 YYYY-MM-DD 문자열로 변환합니다.
 */
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 시작일로부터 종료일까지의 모든 날짜 문자열 배열을 생성합니다.
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 */
export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    const current = new Date(startDate);
    // 시간대(Timezone) 버그 방지를 위해 시간을 00:00:00으로 초기화
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        dates.push(formatDate(current));
        // 하루씩 증가
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * 기준일(오늘)로부터 과거 N개월 전까지의 날짜 리스트를 반환합니다.
 * @param monthsPast 과거로 돌아갈 개월 수 (기본값: 3)
 */
export const getPastRangeDates = (monthsPast: number = 3): string[] => {
    const today = new Date();
    const pastDate = new Date();

    // N개월 전으로 설정
    pastDate.setMonth(today.getMonth() - monthsPast);

    // 과거(start) -> 오늘(end) 순서로 생성
    return generateDateRange(pastDate, today);
};

/**
 * 기준일(오늘)로부터 미래 N개월 후까지의 날짜 리스트를 반환합니다.
 * @param monthsFuture 미래로 나아갈 개월 수 (기본값: 3)
 */
export const getFutureRangeDates = (monthsFuture: number = 3): string[] => {
    const today = new Date();
    const futureDate = new Date();

    // N개월 후로 설정 (Javascript Date는 자동으로 연도 넘김을 처리함)
    // 예: 12월에서 +3개월 하면 내년 3월이 됨
    futureDate.setMonth(today.getMonth() + monthsFuture);

    // 오늘(start) -> 미래(end) 순서로 생성
    return generateDateRange(today, futureDate);
};