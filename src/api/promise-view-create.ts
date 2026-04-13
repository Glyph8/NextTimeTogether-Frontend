import {
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
import { BackendResponse, clientBaseApi } from ".";
import { maskLookupId } from "@/utils/client/promise-lookup";

const PROMISE_KEY_EXPECTED_ERROR_STATUSES = [400, 403, 404];

/** promise/create4 */

export interface CreatePromiseResponse {
  promiseId: string;
}

export const createPromise = (data: CreatePromise4Request) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .createPromise4(data)
    .then((response) => {
      console.log("약속 생성 요청 응답 : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<CreatePromiseResponse>;
      // return response.data;
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

/** promise/view1 */
export const getEncPromiseIdList = () => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .view1()
    .then((response) => {
      console.log("primise/view1 요청  : ", response.data);
      // console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<
        PromiseView1Response[]
      >;
      // return response.data;
      return realData.result || [];
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

/** promise/view2 */
export const getPromiseInProgress = (data: Promiseview2Request) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .view2(data)
    .then((response) => {
      console.log("promise/view2 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<
        PromiseView2Response[]
      >;
      // return response.data;
      return realData.result || [];
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

/** promise/view3 */
export const getScheduleIdListPerPromise = (data: PromiseView3Request) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .view3(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<
        PromiseView3Response[]
      >;
      // return response.data;
      return realData.result || [];
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

/** promise/view4 */
export const getScheduleIdPerFixedPromise = (data: PromiseView4Request) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .view4(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<
        PromiseView4Response[]
      >;
      // return response.data;
      return realData.result || [];
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

export interface EncryptedPromiseMemberId {
  userIds: string[];
}

/** /promise/mem/s1/{promiseId} 암호화된 약속 인원 아이디 조회 */
export const getEncryptedPromiseMemberId = (promiseId: string) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .getUsersByPromiseTime1(promiseId)
    .then((response) => {
      console.log("암호화된 약속 멤버 아아디 요청  : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<EncryptedPromiseMemberId>;
      // return response.data;
      return realData.result || [];
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
  const clientApi = clientBaseApi;

  return clientApi.promise
    .getUsersByPromiseTime2(promiseId, data)
    .then((response) => {
      console.log("약속 멤버 세부 정보 요청  : ", response.data);
      const realData =
        response.data as unknown as BackendResponse<PromiseMemberInfo>;
      // return response.data;
      return realData.result || [];
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

interface PromiseKeyInfo {
  encPromiseKey: string;
}

// 🤔🤔 /promise/promisekey1는 promise/view1과 동일하므로 2단계 요청만  : enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환
/** /promise/promisekey2 : promiseId + lookupId + lookupVersion(+호환기간 encUserId) 로 요청 */
export const getPromiseKey = (data: GetPromiseRequest) => {
  const clientApi = clientBaseApi;

  return clientApi.promise
    .getPromiseKey2(data)
    .then((response) => {
      console.log("약속키 요청", {
        promiseId: data.promiseId,
        lookupVersion: data.lookupVersion,
        lookupId: maskLookupId(data.lookupId),
      });
      const realData =
        response.data as unknown as BackendResponse<PromiseKeyInfo>;
      // return response.data;
      return realData.result || [];
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
      const status = error?.response?.status;
      if (PROMISE_KEY_EXPECTED_ERROR_STATUSES.includes(status)) {
        console.warn("promisekey2 요청 실패", {
          status,
          promiseId: data.promiseId,
          lookupVersion: data.lookupVersion,
          lookupId: maskLookupId(data.lookupId),
        });
      }
      throw error;
    });
};
