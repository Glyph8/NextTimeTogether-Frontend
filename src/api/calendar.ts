import {
  CalendarCreateRequest1,
  CalendarCreateRequest2,
  CalendarRewriteRequest1,
  CalendarViewRequest1,
  CalendarViewRequest2,
} from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";

/** /api/v1/calendar/view1 : timeStampInfo 리스트로 encTimeStamp 리스트를 조회 */
export const getEncTimeStampList = async (data: CalendarViewRequest1) => {
  return clientBaseApi.api
    .viewCalendar1(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /api/v1/calendar/view2 : scheduleId 리스트로 스케줄 정보와 장소 정보를 조회한다 */
export const getCalendarInfoList = async (data: CalendarViewRequest2) => {
  return clientBaseApi.api
    .viewCalendar2(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /api/v1/calendar/create1 : 추가할 일정의 기본 정보 등록 */
export const createCalendarBaseInfo = async (data: CalendarCreateRequest1) => {
  return clientBaseApi.api
    .createCalendar1(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /api/v1/calendar/create2 : 개인 일정의 시간 정보(encStartTimeAndEndTime, timeStampInfo)를 저장한다 */
export const createCalendarTimeInfo = async (data: CalendarCreateRequest2) => {
  return clientBaseApi.api
    .createCalendar2(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /api/v1/calendar/rewrite1 : 캘린더 일정 수정하기 */
export const updateCalendarSchedule = async (data: CalendarRewriteRequest1) => {
  return clientBaseApi.api
    .rewriteCalendar1(data)
    .then((response) => response.data)
    .catch(handleApiError);
};
