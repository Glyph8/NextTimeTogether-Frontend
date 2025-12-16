import { parse, format } from "date-fns";
import { ko } from "date-fns/locale";

interface ScheduleFormat {
    date: string; // "12/15 월"
    time: string; // "오전 09:00 ~ 오전 11:00"
}

export const parseScheduleString = (rangeString: string): ScheduleFormat => {
    try {
        // 1. 하이픈(-)을 기준으로 시작/종료 문자열 분리
        const [startStr, endStr] = rangeString.split("-");

        if (!startStr || !endStr) {
            throw new Error("Invalid format");
        }

        // 2. date-fns의 parse 함수로 Date 객체 변환
        // 포맷 문자열: yyyy(년) MM(월) dd(일) 'T'(문자T) HH(24시간) mm(분)
        const PARSE_FORMAT = "yyyyMMdd'T'HHmm";
        const startDate = parse(startStr, PARSE_FORMAT, new Date());
        const endDate = parse(endStr, PARSE_FORMAT, new Date());

        // 3. 원하는 포맷으로 변환 (ko 로케일 적용)
        // MM/dd: 12/15
        // EEE: 요일 (월, 화...) / EEEE는 월요일
        const formattedDate = format(startDate, "MM/dd EEE", { locale: ko });

        // a: 오전/오후
        // hh: 12시간제 (01~12) / HH는 24시간제
        // mm: 분
        const startTime = format(startDate, "a hh:mm", { locale: ko });
        const endTime = format(endDate, "a hh:mm", { locale: ko });

        return {
            date: formattedDate,
            time: `${startTime} ~ ${endTime}`,
        };
    } catch (error) {
        console.error("날짜 파싱 실패:", error);
        return { date: "-", time: "-" }; // 에러 시 Fallback 처리
    }
};