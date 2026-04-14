import { GetPromiseRequest } from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import { maskLookupId } from "@/utils/client/promise-lookup";

const PROMISE_KEY_EXPECTED_ERROR_STATUSES = [400, 403, 404];

export interface EncPromiseIdList {
  encPromiseIdList: string[];
}

/** /promise/promisekey1 promise_proxy_user 테이블에 있는 enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환 */
export const getEncPromiseId = () => {
  return clientBaseApi.promise
    .getPromiseKey1()
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<EncPromiseIdList>;
      return realData.result || [];
    })
    .catch(handleApiError);
};

export interface EncPromiseKey {
  encPromiseKey: string;
}

/** /promise/promisekey2 전달한 promiseId의 개인키로 암호화된 promiseKey 반환 */
export const getEncPromiseKey = (data: GetPromiseRequest) => {
  return clientBaseApi.promise
    .getPromiseKey2(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<EncPromiseKey>;
      return realData.result || [];
    })
    .catch((error) => {
      const status = error?.response?.status;
      const isExpected =
        typeof status === "number" &&
        PROMISE_KEY_EXPECTED_ERROR_STATUSES.includes(status);

      if (isExpected) {
        console.warn("promisekey2 요청 실패", {
          status,
          promiseId: data.promiseId,
          lookupVersion: data.lookupVersion,
          lookupId: maskLookupId(data.lookupId),
        });
      }
      return handleApiError(error);
    });
};
