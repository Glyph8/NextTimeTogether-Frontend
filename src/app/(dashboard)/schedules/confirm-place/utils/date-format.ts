/**
 * 날짜(YYYY-MM-DD)와 시간(HH:mm)을 받아 Compact 포맷(YYYYMMDDThhmm)으로 변환
 */
const formatCompactDateTime = (date: string, time: string): string => {
  const cleanDate = date.replace(/-/g, ""); // 2025-12-15 -> 20251215
  const cleanTime = time.replace(/:/g, ""); // 14:30 -> 1430
  return `${cleanDate}T${cleanTime}`;
};

/**
 * 시작/종료 정보를 바탕으로 ScheduleID 생성
 * @param date "2025-12-15"
 * @param startTime "14:00"
 * @param endTime "16:00"
 * @returns "20251215T1400-20251215T1600"
 */
export const generateScheduleId = (date: string, startTime: string, endTime: string): string => {
  const startStr = formatCompactDateTime(date, startTime);
  const endStr = formatCompactDateTime(date, endTime); // 하루짜리 약속 가정
  return `${startStr}-${endStr}`;
};

export const parseServerDateToScheduleId = (serverDateTime: string) => {
  try {
    // 1. 날짜와 시간 대역 분리
    const [datePart, timeRangePart] = serverDateTime.split("T"); // ["2025-12-06", "09:00:00-11:00:00"]
    
    // 2. 시간 대역에서 시작/종료 시간 분리
    const [startTimeFull, endTimeFull] = timeRangePart.split("-"); // ["09:00:00", "11:00:00"]

    // 3. Compact 포맷 생성을 위한 클렌징 (Hyphen, Colon 제거)
    const cleanDate = datePart.replace(/-/g, ""); // "20251206"
    
    // HH:mm:ss -> HHmm (초 단위 제거 및 콜론 제거)
    const cleanStartTime = startTimeFull.substring(0, 5).replace(/:/g, ""); // "0900"
    const cleanEndTime = endTimeFull.substring(0, 5).replace(/:/g, "");     // "1100"

    // 4. 최종 ID 생성
    const scheduleId = `${cleanDate}T${cleanStartTime}-${cleanDate}T${cleanEndTime}`;

    return {
      scheduleId,
      timeStampInfo: datePart // "2025-12-06" 그대로 사용
    };
  } catch (error) {
    console.error("날짜 파싱 에러:", error);
    throw new Error("서버 날짜 형식이 올바르지 않습니다.");
  }
};