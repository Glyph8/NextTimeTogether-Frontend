import { BaseResponse, PlaceRegisterDTO, UserAIInfoReqDTO } from "@/apis/generated/Api";
import { clientBaseApi } from ".";

export interface PlaceBoardItem {
  id: number;
  placeName: string | null;
  placeAddr: string;
  placeUrl: string;
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
  placeAddr: string;
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
  const clientApi = clientBaseApi;

  return clientApi.place
    .viewPlaceBoard(promiseId, page)
    .then((response) => {
      const data = response.data as ApiResponse<PlaceBoardResponse>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      console.log("🔵 약속 장소 게시판 데이터:", data.result);
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

/** AI 추천 받는 API TODO : 현재 서버 에러로 응답이 안옴 */
export const getAIRecommand = (promiseId: string, data: UserAIInfoReqDTO) => {
  const clientApi = clientBaseApi;

  return clientApi.place
    .recommendPlace(promiseId, data)
    .then((response) => {
      const data = response.data as ApiResponse<AIRecommandResponse>;
      if (!data.result) {
        throw new Error(data.message || "데이터가 없습니다.");
      }
      console.log("🔵 AI 장소 추천 데이터:", data.result);
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

/** 장소 등록하는 API /place/regisster/{promiseId} */
export const registerPlaceBoard = (promiseId: string, data: PlaceRegisterDTO[]) => {
  const clientApi = clientBaseApi;

  return clientApi.place
    .registerPlace(promiseId, data)
    .then((response) => {
      const data = response.data;
      console.log("🔵 장소 게시판에 장소 등록 성공 : ", data);
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