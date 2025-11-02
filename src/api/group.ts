import {
  BaseResponse,
  CreateGroup1Request,
  CreateGroup2Request,
  InviteGroup1Request,
  InviteGroup2Request,
  InviteGroup3Request,
  ViewGroup2Request,
  ViewGroup3Request,
} from "@/apis/generated/Api";
import { ApiResponse, createServerApi } from ".";


export interface ViewGroupFirstResponseData {
  encGroupId: string;
  encencGroupMemberId: string;
}

export interface ViewGroupSecResponseData {
  encGroupKey: string;
}

export interface ViewGroupThirdResponseData {
  groupId: string;
  groupName: string;
  groupImg: string;
  managerId: string;
  encUserId: string[];
}

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
  redisKeyAndinviteCode: InviteGroup3Request
) => {
  const serverApi = await createServerApi();

  return serverApi.api
    .inviteGroup3(redisKeyAndinviteCode)
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

/** 참여한 그룹들의 암호화 된 groupId, groupMemberId 리스트 요청하기 */
export const getEncGroupsIdRequest = async (): Promise<
  ApiResponse<ViewGroupFirstResponseData[]>
> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup1()
    .then((response) => {
      console.log(
        "step1 - 참여한 그룹들의 암호화된 그룹 ID, 그룹원 ID 배열: ",
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

/** groupId와 groupMemberKey로 암호화된 groupKey 요청 */
export const getEncGroupsKeyRequest = async (
  groupIdAndKeySets: ViewGroup2Request[]
): Promise<ApiResponse<ViewGroupSecResponseData[]>> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup2(groupIdAndKeySets)
    .then((response) => {
      console.log("step2 - 암호화된 groupKey 요청  : ", response.data);
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

/** groupId와 groupMemberKey로 암호화된 groupKey 요청 */
export const getGroupsInfoRequest = async (
  groupIdSets: ViewGroup3Request[]
): Promise<ApiResponse<ViewGroupThirdResponseData[]>> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup3(groupIdSets)
    .then((response) => {
      console.log("step3 - 실제 그룹 정보 요청  : ", response.data);
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

/** 생성할 그룹 정보 서버로 보내주기 */
export const createGroupRequest = async (
  groupInfo: CreateGroup1Request
): Promise<BaseResponse> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .createGroup1(groupInfo)
    .then((response) => {
      console.log("그룹 생성 1 : ", response.data);
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

/** 그룹의 메타 데이터 암호화하여 POST */
export const createGroupRequest2 = async (
  encGroupMetaInfo: CreateGroup2Request
): Promise<BaseResponse> => {
  const serverApi = await createServerApi();
  return serverApi.api
    .createGroup2(encGroupMetaInfo)
    .then((response) => {
      console.log("암호화된 그룹의 메타데이터 (그룹 생성2) : ", response.data);
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
