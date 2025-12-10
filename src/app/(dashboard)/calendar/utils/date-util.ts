
export const generateMonthDates = (baseDate: Date): string[] => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0 ~ 11

  // 해당 월의 마지막 날짜 구하기 (다음 달의 0일 = 이번 달의 마지막 날)
  const lastDay = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    // YYYY-MM-DD 포맷팅 (padStart로 0 채우기)
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });
};

export const convertToCompactISO = (dateStr: string, timeStr?: string, isEnd = false): string => {
  const cleanDate = dateStr.replace(/-/g, "");
  let hour = 0;
  let minute = 0;

  if (timeStr) {
    const [ampm, time] = timeStr.split(" ");
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (ampm === "오후" && h !== 12) h += 12;
    if (ampm === "오전" && h === 12) h = 0;
    hour = h;
    minute = m;
  } else {
    if (isEnd) {
      hour = 23;
      minute = 59;
    }
  }

  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${cleanDate}T${hh}${mm}`;
};


export const parseScheduleIdToDates = (scheduleId: string) => {
  try {
    // ID 형식이 "StartStr-EndStr"라고 가정
    const [startStr, endStr] = scheduleId.split("-");

    // "20251129T1430" -> "2025-11-29T14:30:00" (ISO 8601 호환 형식으로 변환)
    const formatToISO = (str: string) => {
      if (!str || str.length < 13) return null; // 방어 코드
      const yyyy = str.substring(0, 4);
      const mm = str.substring(4, 6);
      const dd = str.substring(6, 8);
      const timePart = str.substring(9); // "1430"
      const hour = timePart.substring(0, 2);
      const min = timePart.substring(2, 4);
      return `${yyyy}-${mm}-${dd}T${hour}:${min}:00`;
    };

    return {
      start: formatToISO(startStr),
      end: formatToISO(endStr),
    };
  } catch (e) {
    console.error("ID 파싱 에러:", scheduleId, e);
    return { start: null, end: null };
  }
};