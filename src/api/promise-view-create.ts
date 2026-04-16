import {
  CreatePromise1Request,
  CreatePromise1Response,
  CreatePromise4Request,
  GetPromiseRequest,
  PromiseView1Response,
  Promiseview2Request,
  PromiseView2Response,
  PromiseView3Request,
  PromiseView3Response,
  PromiseView4Request,
  PromiseView4Response,
  UserIdsResDTO,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import { maskLookupId } from "@/utils/client/promise-lookup";

const PROMISE_KEY_EXPECTED_ERROR_STATUSES = [400, 403, 404];

/** promise/create4 */

export interface CreatePromiseResponse {
  promiseId: string;
}

export const createPromise = (data: CreatePromise4Request) => {
  return clientBaseApi.promise
    .createPromise4(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<CreatePromiseResponse>;
      return realData.result || null;
    })
    .catch(handleApiError);
};

/** promise/create1 */
export const createPromiseStep1 = (data: CreatePromise1Request) => {
  return clientBaseApi.promise
    .createPromise1(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<CreatePromise1Response>;
      return realData.result || null;
    })
    .catch(handleApiError);
};

/** promise/view1 */
export const getEncPromiseIdList = () => {
  return clientBaseApi.promise
    .view1()
    .then((response) => {
      const realData = response.data as unknown as BackendResponse<
        PromiseView1Response[]
      >;
      return realData.result || [];
    })
    .catch(handleApiError);
};

/** promise/view2 */
export const getPromiseInProgress = (data: Promiseview2Request) => {
  return clientBaseApi.promise
    .view2(data)
    .then((response) => {
      const realData = response.data as unknown as BackendResponse<
        PromiseView2Response[]
      >;
      return realData.result || [];
    })
    .catch(handleApiError);
};

/** promise/view3 */
export const getScheduleIdListPerPromise = (data: PromiseView3Request) => {
  return clientBaseApi.promise
    .view3(data)
    .then((response) => {
      const realData = response.data as unknown as BackendResponse<
        PromiseView3Response[]
      >;
      return realData.result || [];
    })
    .catch(handleApiError);
};

/** promise/view4 */
export const getScheduleIdPerFixedPromise = (data: PromiseView4Request) => {
  return clientBaseApi.promise
    .view4(data)
    .then((response) => {
      const realData = response.data as unknown as BackendResponse<
        PromiseView4Response[]
      >;
      return realData.result || [];
    })
    .catch(handleApiError);
};

export interface EncryptedPromiseMemberId {
  userIds: string[];
}

/** /promise/mem/s1/{promiseId} 암호화된 약속 인원 아이디 조회 */
export const getEncryptedPromiseMemberId = (promiseId: string) => {
  return clientBaseApi.promise
    .getUsersByPromiseTime1(promiseId)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<EncryptedPromiseMemberId>;
      return realData.result || [];
    })
    .catch(handleApiError);
};

export interface PromiseMemberDetail {
  userId: string;
  userName: string;
  userImg: string;
}

export interface PromiseMemberInfo {
  promiseManager: string;
  users: PromiseMemberDetail[];
}

/** /promise/mem/s2/{promiseId} 약속 인원 아이디 평문 배열 보내서, 닉네임 등 세부정보 조회 */
export const getPromiseMemberDetail = (
  promiseId: string,
  data: UserIdsResDTO
) => {
  return clientBaseApi.promise
    .getUsersByPromiseTime2(promiseId, data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<PromiseMemberInfo>;
      return realData.result || [];
    })
    .catch(handleApiError);
};

interface PromiseKeyInfo {
  encPromiseKey: string;
}

// 🤔🤔 /promise/promisekey1는 promise/view1과 동일하므로 2단계 요청만  : enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환
/** /promise/promisekey2 : promiseId + lookupId + lookupVersion(+호환기간 encUserId) 로 요청 */
export const getPromiseKey = (data: GetPromiseRequest) => {
  return clientBaseApi.promise
    .getPromiseKey2(data)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<PromiseKeyInfo>;
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
        throw error;
      }
      return handleApiError(error);
    });
};
