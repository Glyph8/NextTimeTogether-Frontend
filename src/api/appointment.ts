import {
  GetPromiseBatchReqDTO,
  PromiseSearchReqDTO,
  TimestampReqDTO,
  UserBoardReqDTO,
  UserIdsResDTO,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi } from ".";
import { AxiosError } from "axios";

export interface PromiseResDTO {
  scheduleId: string;
  title: string;
  purpose: string;
}

/** /promise/get : 약속 일정 리스트를 전부 조회 */
export const getAllScheduleList = async (data: GetPromiseBatchReqDTO) => {
  return clientBaseApi.promise
    .getPromiseView1(data)
    .then((response) => {
      console.log("약속 일정 탭 - 약속 일정 리스트 받음 : ", response.data);
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

/** /promise/get/{groupId} : 특정 그룹 내 약속 일정 리스트 조회 */
export const getScheduleListPerGroups = async (
  groupId: string,
  data: GetPromiseBatchReqDTO
) => {
  return clientBaseApi.promise
    .getPromiseView2(groupId, data)
    .then((response) => {
      console.log("약속 일정 탭 -약속 일정 리스트 받음 : ", response.data);
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

/** /promise/search : 약속 일정 검색 */
export const searchScheduleList = async (
  query: string,
  data: PromiseSearchReqDTO
) => {
  return clientBaseApi.promise
    .searchPromiseView({ query }, data)
    .then((response) => {
      console.log("약속 일정 탭 - 약속 일정 리스트 받음 : ", response.data);
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

export interface GetScheduleDetailRes {
  scheduleId: string;
  title: string;
  type: string;
  placeId: number;
  placeAddress: string;
  placeName: string;
  groupId: string;
  groupName: string;
  encUserIds: string[];
}

/** /promise/get/{scheduleId}/detail : 약속 일정 상세 조회 */
export const getScheduleDetail = async (scheduleId: string) => {
  return clientBaseApi.promise
    .getPromiseDetailView(scheduleId)
    .then((response) => {
      console.log(
        "약속 일정 탭 - 특정 스케쥴의 자세한 정보 받기 : ",
        response.data
      );
      const realData =
        response.data as unknown as BackendResponse<GetScheduleDetailRes>;
      return realData.result || null;
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

// export interface TimestampReqDTO {
//   dates?: string[];
// }

export interface TimestampResDTO {
  date: string;
  timestamp: string;
}

/** /timestamp/get : "2025-12-14"형식 dates 배열으로 요청, 개인키로 암호화된 스케쥴 아이디 리스트 TimestampResDTO[] 반환 */
export const getTimeStampList = async (data: TimestampReqDTO) => {
  return clientBaseApi.timestamp
    .getTimeStampList(data)
    .then((response) => {
      console.log("약속 일정 탭 -약속 일정 리스트 받음 : ", response.data);
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

export interface CheckWhenConfirmedResDTO {
  dateTime: string;
}

export interface CheckWhereConfirmedResDTO {
  placeName: string;
  placeAddress: string;
}

export const CheckWhenConfirmed = async (
  promiseId: string
): Promise<CheckWhenConfirmedResDTO | null> => {
  return clientBaseApi.time
    .confirmedTimeCheck(promiseId)
    .then((response) => {
      console.log("when탭 확정된 시간 데이터 받음 : ", response.data);
      // 타입 단언보다는 제네릭을 사용하는 것이 좋지만, 현재 구조를 유지하며 작성합니다.
      const realData =
        response.data as unknown as BackendResponse<CheckWhenConfirmedResDTO>;
      return realData.result || null;
    })
    .catch((error: AxiosError) => {
      // 1. 서버가 응답을 줬고, 그 상태 코드가 500인 경우 (약속 미확정 상태)
      if (error.response && error.response.status === 500) {
        console.warn(
          "약속이 아직 확정되지 않았습니다. (500 에러 처리 -> null 반환)"
        );
        // 에러를 던지지 않고 null을 반환하여 '미확정' 상태로 처리
        return null;
      }

      // 2. 그 외의 진짜 에러들 (네트워크 오류, 401, 403 등)은 여전히 예외 처리 필요
      if (error.response) {
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("API Error Request:", error.request);
      } else {
        console.error("API Error Message:", error.message);
      }

      // 진짜 에러는 상위(컴포넌트나 React Query)로 전파
      throw error;
    });
};

export const CheckWhereConfirmed = async (promiseId: string) => {
  return clientBaseApi.place
    .confirmedPlaceCheck(promiseId)
    .then((response) => {
      console.log("where탭 확정된 장소 데이터 받음 : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<CheckWhereConfirmedResDTO>;
      return realData.result || null;
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

export const ratePlace = async (placeId: number, data: UserBoardReqDTO) => {
  return clientBaseApi.place
    .updatePlaceRating(placeId, data)
    .then((response) => {
      console.log("where탭 확정된 장소 데이터 받음 : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<CheckWhereConfirmedResDTO>;
      return realData.result || null;
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

export interface GetNickNameResDTO {
  userInfoDTOList: {
    userId: string;
    userName: string;
    userImg: string;
  }[];
}

export const getNickName = async (data: UserIdsResDTO) => {
  return clientBaseApi.promise.getUsersByPromiseTime3(data)
    .then((response) => {
      console.log("닉네임 받음 : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<GetNickNameResDTO>;
      return realData.result || null;
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