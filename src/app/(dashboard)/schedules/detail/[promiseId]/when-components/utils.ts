import { TimeApiResponse } from "./types";

/**
 * API 응답 데이터를 TimeTableGrid의 number[][] 형식으로 변환합니다.
 * - 각 시간 슬롯은 30분 단위입니다.
 * - 시작 시간은 9:00, 종료 시간은 24:00입니다.
 *
 * @param apiResponse API 응답 데이터
 * @param totalMembers 전체 약속 멤버 수 (색상 농도 계산 기준)
 * @returns [dayIndex][timeIndex] 형태의 2차원 배열 (count 값)과 maxCount(전체 인원수)
 */
export const convertApiDataToGridFormat = (
  apiResponse: TimeApiResponse,
  totalMembers: number
): { data: number[][]; maxCount: number } => {
  const START_TIME = 9;
  const END_TIME = 24;
  const TOTAL_SLOTS = (END_TIME - START_TIME) * 2; // 30분 단위이므로 * 2

  // 날짜 범위 계산
  const { startDateTime, endDateTime } = apiResponse.result.timeRange;
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  // 날짜 배열 생성
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 최대 7일만 표시 (요일이 7개이므로)
  const displayDates = dates.slice(0, 7);

  // 2차원 배열 초기화 (7일 x TOTAL_SLOTS)
  const gridData: number[][] = Array(7)
    .fill(null)
    .map(() => Array(TOTAL_SLOTS).fill(0));

  // API 데이터를 그리드에 매핑
  apiResponse.result.availableTimes.forEach((availableTime) => {
    const dateIndex = displayDates.indexOf(availableTime.date);
    if (dateIndex === -1) return; // 날짜가 표시 범위를 벗어남

    availableTime.times.forEach((timeSlot) => {
      // "09:00:00" -> 9 (hour), 0 (minute)
      const [hourStr, minuteStr] = timeSlot.times.split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // 시간 인덱스 계산 (9:00이 0, 9:30이 1, 10:00이 2, ...)
      const timeIndex = (hour - START_TIME) * 2 + (minute === 30 ? 1 : 0);

      if (timeIndex >= 0 && timeIndex < TOTAL_SLOTS) {
        gridData[dateIndex][timeIndex] = timeSlot.count;
      }
    });
  });

  // maxCount는 전체 멤버 수 반환 (실제 체크된 수가 아님)
  return { data: gridData, maxCount: totalMembers };
};

/**
 * 날짜 문자열로부터 요일을 반환합니다.
 * @param dateStr "2025-11-29" 형식
 * @returns "월", "화", ... "일"
 */
export const getDayOfWeek = (dateStr: string): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const date = new Date(dateStr);
  return days[date.getDay()];
};

/**
 * 날짜 범위로부터 표시할 날짜와 요일 배열을 생성합니다.
 * @param startDateTime "2025-11-29"
 * @param endDateTime "2025-12-05"
 * @returns { dates: ["11/29", ...], days: ["금", ...] }
 */
export const generateDateHeaders = (
  startDateTime: string,
  endDateTime: string
) => {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const dates: string[] = [];
  const days: string[] = [];

  const currentDate = new Date(startDate);
  let count = 0;

  while (currentDate <= endDate && count < 7) {
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    dates.push(`${month}/${day}`);
    days.push(getDayOfWeek(currentDate.toISOString().split("T")[0]));

    currentDate.setDate(currentDate.getDate() + 1);
    count++;
  }

  return { dates, days };
};

/**
 * 내 캘린더 일정(scheduleIds)을 그리드 형식의 비활성화 맵으로 변환합니다.
 * @param scheduleIds ISO 형식 타임스탬프 배열 ["2025-11-29T09:00:00", ...]
 * @param startDateTime 약속 시작 날짜 "2025-11-29"
 * @param endDateTime 약속 종료 날짜 "2025-12-05"
 * @returns boolean[][] - [dayIndex][timeIndex] 형태 (true = 비활성화)
 */
export const convertScheduleIdsToDisabledSlots = (
  scheduleIds: string[],
  startDateTime: string,
  endDateTime: string
): boolean[][] => {
  const START_TIME = 9;
  const END_TIME = 24;
  const TOTAL_SLOTS = (END_TIME - START_TIME) * 2; // 30분 단위

  // 날짜 범위 계산
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const dates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate && dates.length < 7) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 비활성화 맵 초기화 (모두 false = 활성화)
  const disabledSlots: boolean[][] = Array(7)
    .fill(null)
    .map(() => Array(TOTAL_SLOTS).fill(false));

  // scheduleIds를 순회하며 비활성화 표시
  scheduleIds.forEach((scheduleId) => {
    // "2025-11-29T09:00:00" 형식 파싱
    const [datePart, timePart] = scheduleId.split("T");
    const dateIndex = dates.indexOf(datePart);

    if (dateIndex === -1) return; // 날짜가 범위를 벗어남

    const [hourStr, minuteStr] = timePart.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // 시간 인덱스 계산
    const timeIndex = (hour - START_TIME) * 2 + (minute === 30 ? 1 : 0);

    if (timeIndex >= 0 && timeIndex < TOTAL_SLOTS) {
      disabledSlots[dateIndex][timeIndex] = true;
    }
  });

  return disabledSlots;
};
