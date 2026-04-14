import {
  BaseResponse,
  PlaceRegisterDTO,
  UserAIInfoReqDTO,
} from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";

export interface PlaceBoardItem {
  id: number;
  placeName: string | null;
  placeAddr: string;
  aiPlace: number;
  voting: number;
  isRemoved: boolean;
  voted: boolean;
}

interface PlaceBoardResponse {
  page: number;
  total: number;
  places: PlaceBoardItem[];
}

export interface AIRecommandResponse {
  placeId: number;
  placeName: string;
  placeAddress: string;
  placeInfo?: string;
}

interface ApiResponse<T> extends Omit<BaseResponse, "result"> {
  result: T;
}

/** 장소 게시판 조회 API place/{promiseId}/{page} */
export const getPlaceBoard = (
  promiseId: string,
  page: number
): Promise<PlaceBoardResponse> => {
  return clientBaseApi.place
    .viewPlaceBoard(promiseId, page)
    .then((response) => {
      const data = response.data as ApiResponse<PlaceBoardResponse>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      return data.result;
    })
    .catch(handleApiError);
};

export const getAIRecommand = (data: UserAIInfoReqDTO) => {
  return clientBaseApi.place
    .recommendPlace(data)
    .then((response) => {
      const res = response.data as ApiResponse<AIRecommandResponse[]>;
      if (!res.result) {
        throw new Error(res.message || "데이터가 없습니다.");
      }
      return res.result;
    })
    .catch(handleApiError);
};

/** 장소 등록하는 API /place/register/{promiseId} */
export const registerPlaceBoard = (
  promiseId: string,
  data: PlaceRegisterDTO[]
) => {
  return clientBaseApi.place
    .registerPlace(promiseId, data)
    .then((response) => response.data)
    .catch(handleApiError);
};

export const votePlace = (promiseId: string, placeId: number) => {
  return clientBaseApi.place
    .votePlace(promiseId, placeId)
    .then((response) => response.data)
    .catch(handleApiError);
};

export const unvotePlace = (placeId: number) => {
  return clientBaseApi.place
    .cancelVotePlace(placeId)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 장소 확정 요청 API */
export const confirmPlace = (
  promiseId: string,
  placeId: number,
  aiPlaceId?: number
) => {
  return clientBaseApi.place
    .confirmedPlace(promiseId, placeId, { aiPlaceId })
    .then((response) => response.data)
    .catch(handleApiError);
};
