import {
  InvitePromise1Request,
  JoinPromise1Request,
} from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";
import { maskLookupId } from "@/utils/client/promise-lookup";

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
  return clientBaseApi.promise
    .joinPromise1(data)
    .then((response) => response.data)
    .catch((error) => {
      const status = error?.response?.status;
      const isExpectedJoinFailure =
        typeof status === "number" &&
        JOIN_EXPECTED_ERROR_STATUSES.includes(status);

      if (isExpectedJoinFailure) {
        console.warn("join1 요청 실패", {
          status,
          promiseId: data.promiseId,
          lookupVersion: data.lookupVersion,
          lookupId: maskLookupId(data.lookupId),
        });
      }
      return handleApiError(error);
    });
};
