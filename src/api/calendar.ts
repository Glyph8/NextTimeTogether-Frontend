import { CalendarCreateRequest1, CalendarCreateRequest2, CalendarRewriteRequest1, CalendarViewRequest1, CalendarViewRequest2 } from "@/apis/generated/Api";
import { clientBaseApi } from ".";

/** /api/v1/calendar/view1 : timeStampInfo 리스트로 encTimeStamp 리스트를 조회 */
export const getEncTimeStampList = async (data: CalendarViewRequest1) => {
  return clientBaseApi.api.viewCalendar1(data)
    .then((response) => {
      console.log("캘린더 - 암호화된 타임스탬프 리스트 받음 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};

/** /api/v1/calendar/view2 : scheduleId 리스트로 스케줄 정보와 장소 정보를 조회한다 */
export const getCalendarInfoList = async (data: CalendarViewRequest2) => {
  return clientBaseApi.api.viewCalendar2(data)
    .then((response) => {
      console.log("캘린더 - 스케줄 정보, 장소 정보 조회하기 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};

/** /api/v1/calendar/create1 : 추가할 일정의 기본 정보 등록 */
export const createCalendarBaseInfo = async (data: CalendarCreateRequest1) => {
  return clientBaseApi.api.createCalendar1(data)
    .then((response) => {
      console.log("캘린더 생성 - 일정 기본 정보(제목, 내용, 목적, 장소)를 등록 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};

/** /api/v1/calendar/view2 : 개인 일정의 시간 정보(encStartTimeAndEndTime, timeStampInfo)를 저장한다 */
export const createCalendarTimeInfo = async (data: CalendarCreateRequest2) => {
  return clientBaseApi.api.createCalendar2(data)
    .then((response) => {
      console.log("캘린더 생성 - 개인 일정의 시간 정보(encStartTimeAndEndTime, timeStampInfo)를 저장 ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};

/** /api/v1/calendar/rewrite1 : 아마도 캘린더 일정 수정하기? */
export const sendPromiseInviteMail = async (data: CalendarRewriteRequest1) => {
  return clientBaseApi.api.rewriteCalendar1(data)
    .then((response) => {
      console.log("캘린더 - 스케줄 정보, 장소 정보 조회하기 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};