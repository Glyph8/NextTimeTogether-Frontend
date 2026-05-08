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
  LeaveGroup3Request,
  SaveGroupMemberRequest,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";
import {
  buildGroupLookupRequest,
  clearGroupLookupCacheForGroup,
  maskLookupId,
  resolveGroupLookupContext,
  shouldUseGroupLookup,
} from "@/utils/client/group-lookup";
import { resolveLookupSubjectFromStorage } from "@/utils/client/lookup-subject";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import {
  getLookupHttpStatus,
  getLookupRequestId,
  getLookupServerCode,
} from "./lookup-error";
import { trackLookupMetric } from "./lookup-metrics";

const GROUP_LOOKUP_EXPECTED_ERROR_STATUSES = [400, 404, 409];

export type InviteGroup1RequiredPayload = Omit<
  InviteGroup1Request,
  "groupId" | "lookupId" | "lookupVersion"
> & {
  groupId: string;
  lookupId: string;
  lookupVersion: number;
};

export type SaveGroupMemberRequiredPayload = Omit<
  SaveGroupMemberRequest,
  "groupId" | "lookupId" | "lookupVersion"
> & {
  groupId: string;
  lookupId: string;
  lookupVersion: number;
};

const getMissingInviteRequiredFields = (
  payload: Partial<InviteGroup1RequiredPayload>
): string[] => {
  const missing: string[] = [];

  if (!payload.groupId?.trim()) missing.push("groupId");
  if (!payload.lookupId?.trim()) missing.push("lookupId");
  if (typeof payload.lookupVersion !== "number") missing.push("lookupVersion");

  return missing;
};

const assertInviteGroup1Payload: (
  payload: Partial<InviteGroup1RequiredPayload>
) => asserts payload is InviteGroup1RequiredPayload = (
  payload: Partial<InviteGroup1RequiredPayload>
) => {
  const missing = getMissingInviteRequiredFields(payload);
  if (missing.length > 0) {
    const error = new Error(
      `invite1 payload missing required field(s): ${missing.join(", ")}`
    );
    (error as Error & { code?: string }).code = "INVITE1_REQUIRED_FIELDS_MISSING";
    throw error;
  }
};

const getMissingSaveGroupMemberRequiredFields = (
  payload: Partial<SaveGroupMemberRequiredPayload>
): string[] => {
  const missing: string[] = [];

  if (!payload.groupId?.trim()) missing.push("groupId");
  if (!payload.lookupId?.trim()) missing.push("lookupId");
  if (typeof payload.lookupVersion !== "number") missing.push("lookupVersion");

  return missing;
};

const assertSaveGroupMemberPayload: (
  payload: Partial<SaveGroupMemberRequiredPayload>
) => asserts payload is SaveGroupMemberRequiredPayload = (
  payload: Partial<SaveGroupMemberRequiredPayload>
) => {
  const missing = getMissingSaveGroupMemberRequiredFields(payload);
  if (missing.length > 0) {
    const error = new Error(
      `member/save payload missing required field(s): ${missing.join(", ")}`
    );
    (error as Error & { code?: string }).code = "MEMBER_SAVE_REQUIRED_FIELDS_MISSING";
    throw error;
  }
};

export interface EnsureGroupMemberMappingInput {
  groupId: string;
  encGroupId: string;
  encGroupKey: string;
  groupKey: CryptoKey;
  masterKey: CryptoKey;
}

export class GroupInvitePreconditionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupInvitePreconditionError";
  }
}

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
  payload: SaveGroupMemberRequiredPayload
): Promise<JoinGroupResponse> => {
  assertSaveGroupMemberPayload(payload);

  return clientBaseApi.api
    .saveGroupMember(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 그룹 초대 1단계 - 그룹 아이디, 암호 그룹 아이디 전달 */
export const getInviteEncNewMemberId = async (
  groupData: InviteGroup1RequiredPayload
) => {
  assertInviteGroup1Payload(groupData);

  trackLookupMetric("lookup_request", {
    domain: "group",
    route: "/group/invite1",
    lookupVersion: groupData.lookupVersion,
  });

  return clientBaseApi.api
    .inviteGroup1(groupData)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<InviteGroup1Response>;
      trackLookupMetric("lookup_success", {
        domain: "group",
        route: "/group/invite1",
        lookupVersion: groupData.lookupVersion,
      });
      return realData.result || null;
    })
    .catch((error) => {
      const status = getLookupHttpStatus(error);
      const isExpected =
        typeof status === "number" &&
        GROUP_LOOKUP_EXPECTED_ERROR_STATUSES.includes(status);
      const requestId = getLookupRequestId(error);

      if (typeof status === "number" || getLookupServerCode(error)) {
        trackLookupMetric("lookup_failure", {
          domain: "group",
          route: "/group/invite1",
          lookupVersion: groupData.lookupVersion,
          status,
          serverCode: getLookupServerCode(error),
        });
      }

      if (status === 400) {
        const missing = getMissingInviteRequiredFields(groupData);
        console.error("invite1 validation failure (client bug suspected)", {
          status,
          missingRequiredFields: missing,
          requestId,
          groupId: groupData.groupId,
          lookupVersion: groupData.lookupVersion,
          lookupId: maskLookupId(groupData.lookupId),
        });
      }

      if (isExpected) {
        console.warn("invite1 요청 실패", {
          status,
          requestId,
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
  if (!shouldUseGroupLookup()) {
    throw new GroupInvitePreconditionError(
      "group lookup is required for invite1 but disabled by feature flag"
    );
  }

  const lookup = await resolveGroupLookupContext(groupId);
  const payload = buildGroupLookupRequest(
    groupId,
    lookup,
    encGroupId
  ) as InviteGroup1RequiredPayload;
  const immutablePayload = Object.freeze({ ...payload });

  try {
    return await getInviteEncNewMemberId(immutablePayload);
  } catch (error) {
    const status = getLookupHttpStatus(error);
    if (status === 404 || status === 409) {
      clearGroupLookupCacheForGroup(groupId);
    }

    if (status === 404) {
      return getInviteEncNewMemberId(immutablePayload);
    }

    throw error;
  }
};

export const ensureGroupMemberMappingForInvite = async ({
  groupId,
  encGroupId,
  encGroupKey,
  groupKey,
  masterKey,
}: EnsureGroupMemberMappingInput): Promise<void> => {
  if (!groupId.trim()) {
    throw new GroupInvitePreconditionError("groupId is required for mapping sync.");
  }

  if (!encGroupKey) {
    throw new GroupInvitePreconditionError(
      "encGroupKey is required to sync group mapping before invite1."
    );
  }

  const { subjectId } = resolveLookupSubjectFromStorage();
  const lookupContext = await resolveGroupLookupContext(groupId);
  const encUserId = await encryptDataClient(subjectId, groupKey, "group_sharekey");
  const encencGroupMemberId = await encryptDataClient(
    encUserId,
    masterKey,
    "group_proxy_user"
  );

  await apiPostGroupMemberSave({
    groupId,
    lookupId: lookupContext.lookupId,
    lookupVersion: lookupContext.lookupVersion,
    encGroupId,
    encGroupKey,
    encUserId,
    encencGroupMemberId,
  });
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

/**
 * 그룹 나가기 3단계 — 일반 멤버는 퇴장, 방장은 그룹 자체 폭파(삭제).
 * 분기는 isManager 플래그로 결정되며 응답 메시지가 *그룹에서 나갔어요* 또는
 * *그룹이 삭제되었어요* 형태로 다르게 내려온다.
 */
export const postGroupLeaveStep3 = async (
  payload: LeaveGroup3Request
) => {
  return clientBaseApi.api
    .leaveGroup3(payload)
    .then((response) => response.data)
    .catch(handleApiError);
};

/**
 * 그룹 나가기 / 삭제 오케스트레이션.
 * 1) leave1 — 사용자의 그룹 프록시 유효성 검증 + isManager 판별
 * 2) leave2 — encencGroupMemberId 획득
 * 3) (클라) masterKey 로 encencGroupMemberId 복호화 → encUserId
 * 4) leave3 — 일반 멤버는 퇴장, 방장은 그룹 자체 삭제
 *
 * 백엔드 응답에 따라 isManager 가 결정되므로, 호출 측은 같은 함수로 두 시나리오를 처리할 수 있다.
 */
export const leaveGroupFlow = async (
  groupId: string,
  masterKey: CryptoKey
): Promise<{ isManager: boolean; message?: string }> => {
  const decryptDataWithCryptoKey = (
    await import("@/utils/client/crypto/decryptClient")
  ).default;
  const lookup = await resolveGroupLookupContext(groupId);

  const step1Raw = await postGroupLeaveStep1({
    groupId,
    lookupId: lookup.lookupId,
    lookupVersion: lookup.lookupVersion,
  });
  const step1 = (step1Raw as BackendResponse<{
    groupId?: string;
    message?: string;
    isManager?: boolean;
  }>).result;
  const isManager = step1?.isManager ?? false;

  const step2Raw = await postGroupLeaveStep2({
    groupId,
    lookupId: lookup.lookupId,
    lookupVersion: lookup.lookupVersion,
    isManager,
  });
  const encencGroupMemberId = (step2Raw as BackendResponse<{
    encencGroupMemberId?: string;
  }>).result?.encencGroupMemberId;

  if (!encencGroupMemberId) {
    throw new Error("그룹 멤버 식별 정보를 받지 못했습니다.");
  }

  // encencGroupMemberId = enc_by_master(enc_by_group(userId)) 이므로
  // masterKey 로 한 번 복호화 → encUserId(= enc_by_group(userId))
  const encUserId = await decryptDataWithCryptoKey(
    encencGroupMemberId,
    masterKey,
    "group_proxy_user"
  );

  const step3Raw = await postGroupLeaveStep3({
    groupId,
    isManager,
    encUserId,
    encencGroupMemberId,
  });
  const step3 = (step3Raw as BackendResponse<{ message?: string }>).result;

  // 그룹 단위 lookup 캐시 정리 (해당 그룹 정보가 더 이상 의미 없음)
  clearGroupLookupCacheForGroup(groupId);

  return { isManager, message: step3?.message };
};
