import {
  GetPromiseBatchReqDTO,
  PromiseSearchReqDTO,
  TimestampReqDTO,
  UserBoardReqDTO,
  UserIdsResDTO,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import { AxiosError } from "axios";

export interface PromiseResDTO {
  scheduleId: string;
  title: string;
  purpose: string;
}

/**
 * 백엔드 호환성을 위해 schedule category를 purpose/type 순서로 정규화한다.
 * @param value category 필드가 포함된 응답 객체
 * @returns {string | undefined} 정규화된 category 값
 */
export const resolveSchedulePurpose = (value?: {
  purpose?: string;
  type?: string;
}) => value?.purpose ?? value?.type;

/** /promise/get : 약속 일정 리스트를 전부 조회 */
export const getAllScheduleList = async (data: GetPromiseBatchReqDTO) => {
  return clientBaseApi.promise
    .getPromiseView1(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /promise/get/{groupId} : 특정 그룹 내 약속 일정 리스트 조회 */
export const getScheduleListPerGroups = async (
  groupId: string,
  data: GetPromiseBatchReqDTO
) => {
  return clientBaseApi.promise
    .getPromiseView2(groupId, data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** /promise/search : 약속 일정 검색 */
export const searchScheduleList = async (
  query: string,
  data: PromiseSearchReqDTO
) => {
  return clientBaseApi.promise
    .searchPromiseView({ query }, data)
    .then((response) => response.data)
    .catch(handleApiError);
};

export interface GetScheduleDetailRes {
  scheduleId: string;
  title: string;
  type?: string;
  purpose?: string;
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
      const realData =
        response.data as unknown as BackendResponse<GetScheduleDetailRes>;
      if (!realData.result) return null;

      const normalizedPurpose = resolveSchedulePurpose(realData.result);

      return {
        ...realData.result,
        type: normalizedPurpose,
        purpose: normalizedPurpose,
      };
    })
    .catch(handleApiError);
};

export interface TimestampResDTO {
  date: string;
  timestamp: string;
}

/** /timestamp/get : "2025-12-14"형식 dates 배열으로 요청, 개인키로 암호화된 스케쥴 아이디 리스트 TimestampResDTO[] 반환 */
export const getTimeStampList = async (data: TimestampReqDTO) => {
  return clientBaseApi.timestamp
    .getTimeStampList(data)
    .then((response) => response.data.result)
    .catch(handleApiError);
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
      const realData =
        response.data as unknown as BackendResponse<CheckWhenConfirmedResDTO>;
      return realData.result || null;
    })
    .catch((error: AxiosError) => {
      // 500 = 약속 미확정 상태 → null 반환
      if (error.response?.status === 500) {
        return null;
      }
      return handleApiError(error);
    });
};

export const CheckWhereConfirmed = async (promiseId: string) => {
  return clientBaseApi.place
    .confirmedPlaceCheck(promiseId)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<CheckWhereConfirmedResDTO>;
      return realData.result || null;
    })
    .catch(handleApiError);
};

export const ratePlace = async (placeId: number, data: UserBoardReqDTO) => {
  return clientBaseApi.place
    .updatePlaceRating(placeId, data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<CheckWhereConfirmedResDTO>;
      return realData.result || null;
    })
    .catch(handleApiError);
};

export interface GetNickNameResDTO {
  userInfoDTOList: {
    userId: string;
    userName: string;
    userImg: string;
  }[];
}

export const getNickName = async (data: UserIdsResDTO) => {
  return clientBaseApi.promise
    .getUsersByPromiseTime3(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<GetNickNameResDTO>;
      return realData.result || null;
    })
    .catch(handleApiError);
};
