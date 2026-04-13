import { BaseResponse, PromiseListResDTO, PromiseResDTO } from "@/apis/generated/Api";

/**
 * `BaseResponse | PromiseListResDTO` 형태의 스케줄 응답에서
 * 안전하게 `PromiseResDTO[]`를 추출한다.
 */
export const extractScheduleList = (
  data?: BaseResponse | PromiseListResDTO
): PromiseResDTO[] => {
  if (!data) return [];

  if ("result" in data) {
    const result = data.result;
    if (Array.isArray(result)) {
      return result as PromiseResDTO[];
    }

    if (result && typeof result === "object" && "promiseResDTOList" in result) {
      return (result as PromiseListResDTO).promiseResDTOList ?? [];
    }

    return [];
  }

  if ("promiseResDTOList" in data) {
    return data.promiseResDTOList ?? [];
  }

  return [];
};
