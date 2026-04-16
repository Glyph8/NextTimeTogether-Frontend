import {
  BaseResponse,
  EditGroup1Request,
  GetGroupJoinEmailResponse,
  InviteGroup1Request,
  InviteGroup1Response,
  InviteGroup2Request,
  InviteGroup2Response,
  JoinGroupResponse,
  LeavGroup1Request,
  LeaveGroup2Request,
  SaveGroupMemberRequest,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import {
  buildGroupLookupRequest,
  clearGroupLookupCacheForGroup,
  maskLookupId,
  resolveGroupLookupContext,
  shouldSendLegacyEncGroupId,
  shouldUseGroupLookup,
} from "@/utils/client/group-lookup";
import {
  getLookupHttpStatus,
  getLookupServerCode,
  isLookupTransitionError,
} from "./lookup-error";
import { trackLookupMetric } from "./lookup-metrics";

const GROUP_LOOKUP_EXPECTED_ERROR_STATUSES = [400, 404, 409];

/** 이메일 보내는 로직이라 현재 지원 안됨 */
export const apiGetGroupJoinRequest = async (
  groupId: string
): Promise<GetGroupJoinEmailResponse> => {
  return clientBaseApi.api
    .getGroupJoinEmail(groupId)
    .then((response) => response.data)
    .catch(handleApiError);
};

export const apiPostGroupMemberSave = async (
  payload: SaveGroupMemberRequest
): Promise<JoinGroupResponse> => {
  return clientBaseApi.api
    .saveGroupMember(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 그룹 초대 1단계 - 그룹 아이디, 암호 그룹 아이디 전달 */
export const getInviteEncNewMemberId = async (
  groupData: InviteGroup1Request
) => {
  if (groupData.lookupId && typeof groupData.lookupVersion === "number") {
    trackLookupMetric("lookup_request", {
      domain: "group",
      route: "/group/invite1",
      lookupVersion: groupData.lookupVersion,
    });
  }

  return clientBaseApi.api
    .inviteGroup1(groupData)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<InviteGroup1Response>;
      if (groupData.lookupId && typeof groupData.lookupVersion === "number") {
        trackLookupMetric("lookup_success", {
          domain: "group",
          route: "/group/invite1",
          lookupVersion: groupData.lookupVersion,
        });
      }
      return realData.result || null;
    })
    .catch((error) => {
      const status = getLookupHttpStatus(error);
      const isLookupRequest =
        Boolean(groupData.lookupId) && typeof groupData.lookupVersion === "number";
      const isExpected =
        isLookupRequest &&
        typeof status === "number" &&
        GROUP_LOOKUP_EXPECTED_ERROR_STATUSES.includes(status);

      if (isExpected) {
        trackLookupMetric("lookup_failure", {
          domain: "group",
          route: "/group/invite1",
          lookupVersion: groupData.lookupVersion,
          status,
          serverCode: getLookupServerCode(error),
        });
        console.warn("invite1 요청 실패", {
          status,
          groupId: groupData.groupId,
          lookupVersion: groupData.lookupVersion,
          lookupId: maskLookupId(groupData.lookupId),
        });
        throw error;
      }
      return handleApiError(error);
    });
};

/** @deprecated use getInviteEncNewMemberId */
export const getInviteEncENcNewMemberId = getInviteEncNewMemberId;

interface GroupInviteWithFallbackInput {
  groupId: string;
  encGroupId: string;
}

export const getInviteEncNewMemberIdWithLookupFallback = async ({
  groupId,
  encGroupId,
}: GroupInviteWithFallbackInput) => {
  let lastLookupVersion: number | undefined;
  const requestLegacy = () => getInviteEncNewMemberId({ groupId, encGroupId });

  if (!shouldUseGroupLookup()) {
    return requestLegacy();
  }

  const requestLookup = async () => {
    const lookup = await resolveGroupLookupContext(groupId);
    lastLookupVersion = lookup.lookupVersion;
    const payload = buildGroupLookupRequest(groupId, lookup, encGroupId);
    return getInviteEncNewMemberId(payload);
  };

  try {
    return await requestLookup();
  } catch (error) {
    const status = getLookupHttpStatus(error);
    if (status === 404) {
      clearGroupLookupCacheForGroup(groupId);
      try {
        return await requestLookup();
      } catch (retryError) {
        error = retryError;
      }
    }

    const fallbackAllowed =
      shouldSendLegacyEncGroupId() && isLookupTransitionError(error);
    if (!fallbackAllowed) {
      throw error;
    }

    trackLookupMetric("lookup_fallback_attempt", {
      domain: "group",
      route: "/group/invite1",
      lookupVersion: lastLookupVersion,
      status: getLookupHttpStatus(error),
      serverCode: getLookupServerCode(error),
    });

    try {
      const response = await requestLegacy();
      trackLookupMetric("lookup_fallback_success", {
        domain: "group",
        route: "/group/invite1",
        lookupVersion: lastLookupVersion,
      });
      return response;
    } catch (fallbackError) {
      trackLookupMetric("lookup_fallback_failure", {
        domain: "group",
        route: "/group/invite1",
        lookupVersion: lastLookupVersion,
        status: getLookupHttpStatus(fallbackError),
        serverCode: getLookupServerCode(fallbackError),
      });
      throw fallbackError;
    }
  }
};

/** 그룹 초대 2단계 - 초대할 그룹 id와 초대하는 사용자 id 전송, 그룹 키 획득 */
export const getInviteEncGroupsKeyRequest = async (
  groupUserId: InviteGroup2Request
) => {
  return clientBaseApi.api
    .inviteGroup2(groupUserId)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<InviteGroup2Response>;
      return realData.result || null;
    })
    .catch(handleApiError);
};

/** 그룹 수정 1단계 */
export const postGroupEditStep1 = async (
  payload: EditGroup1Request
): Promise<BaseResponse> => {
  return clientBaseApi.api
    .editGroup1(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 그룹 나가기 1단계 */
export const postGroupLeaveStep1 = async (
  payload: LeavGroup1Request
) => {
  return clientBaseApi.api
    .leaveGroup1(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 그룹 나가기 2단계 */
export const postGroupLeaveStep2 = async (
  payload: LeaveGroup2Request
) => {
  return clientBaseApi.api
    .leaveGroup2(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};
