import { TimeSlotReqDTO, UserTimeSlotReqDTO } from "@/apis/generated/Api";
import { clientBaseApi } from ".";
import { ApiResponse } from "./server-index";

export interface TimeCell {
  times: string;
  count: number;
}

export interface TimeBoardResponse {
  promiseId: string;
  timeRange: {
    startDateTime: string;
    endDateTime: string;
  };
  availableTimes: {
    date: string;
    times: TimeCell[];
  };
}

/** 약속원 시간표 보드 조회 API /time/{promiseId} */
export const getPromiseTimeBoard = (
  promiseId: string
): Promise<TimeBoardResponse> => {
  const clientApi = clientBaseApi;

  return clientApi.time
    .viewTimeBoard(promiseId)
    .then((response) => {
      const data = response.data as ApiResponse<TimeBoardResponse>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      console.log("🔵 약속 시간 게시판 데이터:", data.result);
      return response.data.result;
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

export interface AvailableMembers {
  date: string;
  time: string;
  availableUsers: string[];
  unavailableUsers: string[];
}

/** 특정 시간 셀의 약속원 정보 조회 API /time/{promiseId} */
export const getAvailableMemberTime = (
  promiseId: string,
  data: TimeSlotReqDTO
): Promise<AvailableMembers> => {
  const clientApi = clientBaseApi;

  return clientApi.time
    .viewUsersByTime(promiseId, data)
    .then((response) => {
      const data = response.data as ApiResponse<AvailableMembers>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      console.log("🔵 약속 시간 게시판 데이터:", data.result);
      return response.data.result;
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

/** 사용자의 시간표 전송 = 내 시간표 업데이트 = API /time/my/{promiseId} */
export const updateMyTimetable = (
  promiseId: string,
  data: UserTimeSlotReqDTO
) => {
  const clientApi = clientBaseApi;

  return clientApi.time
    .updateUserTime(promiseId, data)
    .then((response) => {
      const data = response.data;
      console.log("🔵 사용자 시간표 갱신 응답 데이터:", data.result);
      return response.data.result;
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


// TODO : 시간 확정하면, 내 시간표 수정 가능한가?
/** 약속 시간표 확정 API /time/confirm/{promiseId} */
export const confirmTimetable = (
  promiseId: string,
  data: string
) => {
  const clientApi = clientBaseApi;

  return clientApi.time
    .confirmDateTime(promiseId, data)
    .then((response) => {
      const data = response.data;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      console.log("🔵 약속 시간 확정 응답 데이터:", data.result);
      return response.data.result;
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
