import { TimeSlotReqDTO, UserTimeSlotReqDTO } from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";
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
  return clientBaseApi.time
    .viewTimeBoard(promiseId)
    .then((response) => {
      const data = response.data as ApiResponse<TimeBoardResponse>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      return data.result;
    })
    .catch(handleApiError);
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
  return clientBaseApi.time
    .viewUsersByTime(promiseId, data)
    .then((response) => {
      const res = response.data as ApiResponse<AvailableMembers>;
      if (!res.result) {
        throw new Error(res.message || "데이터가 없습니다.");
      }
      return res.result;
    })
    .catch(handleApiError);
};

/** 사용자의 시간표 전송 = 내 시간표 업데이트 = API /time/my/{promiseId} */
export const updateMyTimetable = (
  promiseId: string,
  data: UserTimeSlotReqDTO
) => {
  return clientBaseApi.time
    .updateUserTime(promiseId, data)
    .then((response) => response.data.result)
    .catch(handleApiError);
};

/** 약속 시간표 확정 API /time/confirm/{promiseId} */
export const confirmTimetable = (promiseId: string, data: string) => {
  return clientBaseApi.time
    .confirmDateTime(promiseId, { dateTime: data })
    .then((response) => {
      const res = response.data;
      if (!res.result) {
        throw new Error(res.message || "데이터가 없습니다.");
      }
      return res.result;
    })
    .catch(handleApiError);
};
