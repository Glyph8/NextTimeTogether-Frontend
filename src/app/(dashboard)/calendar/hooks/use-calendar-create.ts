import { createCalendarBaseInfo, createCalendarTimeInfo } from "@/api/calendar";
import {
  CalendarCreateRequest1,
  CalendarCreateRequest2,
} from "@/apis/generated/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCalendarResisterBaseInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn은 변수(variables)를 인자로 받을 수 있습니다.
    mutationFn: (calendarBaseInfo: CalendarCreateRequest1) => {
      return createCalendarBaseInfo(calendarBaseInfo);
    },
    onSuccess: (data) => {
      console.log("캘린더 기본 정보 등록 성공:", data);
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (error) => {
      console.error("생성 실패:", error);
    },
  });

  // 응답 예시
  //   {
  //   "code": 200,
  //   "message": "요청에 성공했습니다.",
  //   "result": {
  //     "scheduleId": "3AFygat7JT7bK9jsksrnM7V0Hl9XMkJ7iB9mwzOrW+G+YVB6mKyHuJPnWZQo0SJDaQ==",
  //     "title": "러닝500m",
  //     "content": "힙으뜸 유투버와 달리기"
  //   }
  // }
};

export const useCalendarCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn은 변수(variables)를 인자로 받을 수 있습니다.
    mutationFn: (calendarTimeInfo: CalendarCreateRequest2) => {
      return createCalendarTimeInfo(calendarTimeInfo);
    },
    // 성공 시 실행될 로직
    onSuccess: (data) => {
      console.log("캘린더 생성 성공:", data);

      // [중요] 캘린더가 생성되었으니, 캘린더 목록을 보여주는 쿼리("calendar")를 무효화하여
      // 자동으로 목록을 새로고침하게 만듭니다. (데이터 일관성 유지)
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (error) => {
      console.error("생성 실패:", error);
    },
  });

  // 응답 예시
  //   {
  //   "code": 200,
  //   "message": "요청에 성공했습니다.",
  //   "result": {
  //     "scheduleId": "3AFygat7JT7bK9jsksrnM7V0Hl9XMkJ7iB9mwzOrW+G+YVB6mKyHuJPnWZQo0SJDaQ==",
  //     "title": "러닝500m",
  //     "content": "힙으뜸 유투버와 달리기"
  //   }
  // }
};
