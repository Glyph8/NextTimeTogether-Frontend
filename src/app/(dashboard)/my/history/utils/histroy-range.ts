// TODO : appointment utils로 이동 예정
/**
 * 오늘로부터 3개월 전의 날짜들을 YYYY-MM-DD 형식의 배열로 생성합니다.
 * @returns string[] (예: ["2024-09-18", ..., "2024-12-18"])
 */
export const generateThreeMonthsRange = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  // 1. 시작 날짜 설정 (오늘로부터 3개월 전)
  // setMonth는 자동으로 연도 계산(1월에서 3개월 전이면 작년으로)을 처리해줍니다.
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - 3);

  // 2. 루프를 돌며 하루씩 증가시켜 배열에 담기
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);

    // 다음 날로 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
