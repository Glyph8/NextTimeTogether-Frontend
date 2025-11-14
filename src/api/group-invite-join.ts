import { GetGroupJoinEmailResponse, InviteGroup1Request, InviteGroup2Request, JoinGroupResponse, SaveGroupMemberRequest } from "@/apis/generated/Api";
import { createServerApi } from ".";

/**
 * [손님 2단계] 그룹 참가 신청 (대기실 등록)
 * GET /api/v1/group/join/{groupId} (image_a54f49.png)
 * * @param groupId 참가 신청할 그룹의 ID
 * @returns API 응답 (result에 email 포함)
 */
export const apiGetGroupJoinRequest = async (
  groupId: string
): Promise<GetGroupJoinEmailResponse> => {
   const serverApi = await createServerApi();
  return serverApi.api.getGroupJoinEmail(groupId)
   .then((response) => {
      console.log(
        "[손님 2단계] 그룹 참가 신청 : ",
        response.data
      );
      return response.data;
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

/**
 * [손님 3단계] 그룹 최종 가입 (E2EE 정보 제출)
 * POST /api/v1/group/member/save (image_a54f0b.png)
 * * @param payload E2EE로 암호화된 "등록 패킷"
 * @returns API 응답 (result에 성공 메시지 포함)
 */
export const apiPostGroupMemberSave = async (
  payload: SaveGroupMemberRequest
): Promise<JoinGroupResponse> => {
   const serverApi = await createServerApi();

  return serverApi.api
    .saveGroupMember(payload)
    .then((response) => {
      console.log(
        "[손님 3단계] 그룹 최종 가입 ",
        response.data
      );
      return response.data;
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

/** 그룹 초대 1단계 - 그룹 아이디, 암호 그룹 아이디 전달 */
export const getInviteEncENcNewMemberId = async (
  groupData: InviteGroup1Request
) => {
  const serverApi = await createServerApi();

  return serverApi.api
    .inviteGroup1(groupData)
    .then((response) => {
      console.log(
        "그룹 초대 step1 - 초대할 그룹의 아이디와 암호화된 아이디 쌍 전송 후 새 멤버 아이디 획득: ",
        response.data
      );
      return response.data;
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

/** 그룹 초대 2단계 - 초대할 그룹 id와 초대하는 사용자 id 전송, 그룹 키 획득 */
export const getInviteEncGroupsKeyRequest = async (
  groupUserId: InviteGroup2Request
) => {
  const serverApi = await createServerApi();

  return serverApi.api
    .inviteGroup2(groupUserId)
    .then((response) => {
      console.log(
        "그룹 초대 step2 - 초대할 그룹 id와 초대하는 사용자 id 전송, 그룹 키 획득 ",
        response.data
      );
      return response.data;
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

/** 그룹 초대 3단계 - redis에 등록할 키와, value가 될 초대 url 전송 하여 초대 url 등록*/
export const getMakeInviteLink = async (
  // TODO : group3request 없어진듯
  redisKeyAndinviteCode: InviteGroup2Request
) => {
  const serverApi = await createServerApi();

  return serverApi.api
    .inviteGroup2(redisKeyAndinviteCode)
    .then((response) => {
      console.log(
        "그룹 초대 step2 - 초대할 그룹 id와 초대하는 사용자 id 전송, 그룹 키 획득 ",
        response.data
      );
      return response.data;
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
