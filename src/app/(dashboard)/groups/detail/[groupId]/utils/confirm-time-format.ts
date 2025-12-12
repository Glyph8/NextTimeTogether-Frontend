/**
 * 입력 1: "20251212T1800-20251212T2000" -> "12월 12일 오후 6시부터 ~ 오후 8시까지"
 * 입력 2: "2025-12-07 ~ 2025-12-10"    -> "2025-12-07 ~ 2025-12-10" (그대로 반환)
 */
export function formatEventTime(input: string): string {
  // 1. 변환할 대상 형식인지 정규표현식으로 검사합니다.
  // 형식: 숫자8자리 + T + 숫자4자리 + - + 숫자8자리 + T + 숫자4자리
  const targetFormatRegex = /^\d{8}T\d{4}-\d{8}T\d{4}$/;

  // 2. 대상 형식이 아니라면(예: 날짜 범위 문자열) 입력값을 그대로 반환합니다.
  if (!targetFormatRegex.test(input)) {
    return input;
  }

  // --- 이하 변환 로직 (이전과 동일) ---
  const [startStr, endStr] = input.split('-');

  const parseDateTime = (str: string) => {
    const month = parseInt(str.slice(4, 6), 10);
    const day = parseInt(str.slice(6, 8), 10);
    const hour = parseInt(str.slice(9, 11), 10);
    const minute = parseInt(str.slice(11, 13), 10);
    return { month, day, hour, minute };
  };

  const formatTime = (hour: number, minute: number): string => {
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour % 12 || 12; 
    const minuteStr = minute > 0 ? ` ${minute}분` : ''; 
    return `${ampm} ${displayHour}시${minuteStr}`;
  };

  const start = parseDateTime(startStr);
  const end = parseDateTime(endStr);
  const startTimeStr = formatTime(start.hour, start.minute);
  const endTimeStr = formatTime(end.hour, end.minute);

  return `${start.month}월 ${start.day}일 ${startTimeStr}부터 ~ ${endTimeStr}까지`;
}
