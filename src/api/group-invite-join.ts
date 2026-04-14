import {
  GetGroupJoinEmailResponse,
  InviteGroup1Request,
  InviteGroup1Response,
  InviteGroup2Request,
  InviteGroup2Response,
  JoinGroupResponse,
  SaveGroupMemberRequest,
} from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi, handleApiError } from ".";

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
export const getInviteEncENcNewMemberId = async (
  groupData: InviteGroup1Request
) => {
  return clientBaseApi.api
    .inviteGroup1(groupData)
    .then((response) => {
      const realData =
        response.data as unknown as BackendResponse<InviteGroup1Response>;
      return realData.result || null;
    })
    .catch(handleApiError);
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
