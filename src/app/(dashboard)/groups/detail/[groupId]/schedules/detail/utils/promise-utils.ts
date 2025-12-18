/**
 * 일정 문자열을 파싱하여 날짜와 시간 객체로 변환합니다.
 * @param scheduleStr 형식: "YYYY-MM-DDTHH:mm:ss-HH:mm:ss"
 * @returns { date: string, time: string }
 */
export const parseConfrimedPromiseDateTime = (scheduleStr: string) => {
  try {
    // 1. 문자열 분리 (T를 기준으로 날짜와 시간을 나누고, -를 기준으로 종료 시간을 분리)
    // 정규표현식을 사용하여 정확한 위치의 구분자를 캐치합니다.
    const [datePart, timePart] = scheduleStr.split("T");
    const [startTime, endTime] = timePart.split("-");

    const dateObj = new Date(datePart);

    // 2. 날짜 포맷팅 (예: 12/19 금)
    // Intl.DateTimeFormat을 사용하면 로케일에 맞는 요일을 쉽게 가져올 수 있습니다.
    const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
      month: "numeric",
      day: "numeric",
      weekday: "short",
    });

    // Intl 결과물에서 "12. 19. (금)" 형태를 "12/19 금"으로 정제
    const formattedDate = dateFormatter
      .format(dateObj)
      .replace(/\. /g, "/")
      .replace(/\./g, "")
      .replace(/\(|\)/g, "");

    // 3. 시간 포맷팅 (예: 오전 09:00)
    const formatTime = (time: string) => {
      const [hh, mm] = time.split(":");
      const hour = parseInt(hh, 10);
      const period = hour < 12 ? "오전" : "오후";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${period} ${String(displayHour).padStart(2, "0")}:${mm}`;
    };

    const timeRange = `${formatTime(startTime)} ~ ${formatTime(endTime)}`;

    return {
      date: formattedDate,
      time: timeRange,
    };
  } catch (error) {
    console.error("Schedule parsing error:", error);
    return { date: "날짜 정보 없음", time: "시간 정보 없음" };
  }
};
