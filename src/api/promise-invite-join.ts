import {
  InvitePromise1Request,
  JoinPromise1Request,
} from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";
import { maskLookupId } from "@/utils/client/promise-lookup";
import { getLookupHttpStatus, getLookupServerCode } from "./lookup-error";
import { trackLookupMetric } from "./lookup-metrics";

const JOIN_EXPECTED_ERROR_STATUSES = [400, 403, 404, 409];

/** promise invite1 : 약속 초대 메일 보내기 - LATER : 현재는 생략한 상태 */
export const sendPromiseInviteMail = async (data: InvitePromise1Request) => {
  return clientBaseApi.promise
    .invitePromise1(data)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** promise join1 : 약속에 참가하기 (약속 생성자 포함) */
export const joinPromise = (data: JoinPromise1Request) => {
  trackLookupMetric("lookup_request", {
    domain: "promise",
    route: "/promise/join1",
    lookupVersion: data.lookupVersion,
  });

  return clientBaseApi.promise
    .joinPromise1(data)
    .then((response) => {
      trackLookupMetric("lookup_success", {
        domain: "promise",
        route: "/promise/join1",
        lookupVersion: data.lookupVersion,
      });
      return response.data;
    })
    .catch((error) => {
      const status = getLookupHttpStatus(error);
      const isExpectedJoinFailure =
        typeof status === "number" &&
        JOIN_EXPECTED_ERROR_STATUSES.includes(status);

      if (isExpectedJoinFailure) {
        trackLookupMetric("lookup_failure", {
          domain: "promise",
          route: "/promise/join1",
          lookupVersion: data.lookupVersion,
          status,
          serverCode: getLookupServerCode(error),
        });
        console.warn("join1 요청 실패", {
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
