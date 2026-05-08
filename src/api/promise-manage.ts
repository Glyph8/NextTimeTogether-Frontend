import {
  DispersePromiseReqDTO,
  ExitPromiseReqDTO,
} from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";

/**
 * 약속 해산 (방장 한정).
 * promiseId 와 약속에 속한 모든 userIds(평문 hashedUserId 리스트)를 보내면
 * 백엔드가 약속 관련 테이블 전체를 정리한다. E2EE 영향 없음.
 */
export const dispersePromise = async (payload: DispersePromiseReqDTO) => {
  return clientBaseApi.promise
    .dispersePromise(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/**
 * 약속 나가기 (멤버).
 * encPromiseId / encPromiseKey 는 클라이언트가 masterKey 로 직접 암호화한 값을 보낸다.
 * (호출 측에서 encryptDataClient(value, masterKey, "promise_proxy_user") 로 생성.)
 */
export const exitPromise = async (payload: ExitPromiseReqDTO) => {
  return clientBaseApi.promise
    .exitPromise(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};
