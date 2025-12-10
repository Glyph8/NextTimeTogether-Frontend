
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
