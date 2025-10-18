import {
  BaseResponse,
  CreateGroup1Request,
  CreateGroup2Request,
  ViewGroup2Request,
  ViewGroup3Request,
} from "@/apis/generated/Api";
import { ApiResponse, createServerApi } from ".";
import { ViewGroupFirstResponseData, ViewGroupSecResponseData, ViewGroupThirdResponseData } from "@/app/(dashboard)/groups/action";


/** 참여한 그룹들의 암호화 된 groupId, groupMemberId 리스트 요청하기 */
export const getEncGroupsIdRequest = async (
): Promise<ApiResponse<ViewGroupFirstResponseData[]>> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup1()
    .then((response) => {
      console.log("step1 - 참여한 그룹들의 암호화된 그룹 ID, 그룹원 ID 배열: ", response.data);
    //   "data": [
    //     {
    //         "encGroupId": "qVgsReSbjJ2nq5Xo/ogucm2uTfC/MkHdAcqp8AcADrmBDZBDwUT9tGx8qGNJ0k7dg9Cg6Q==",
    //         "encencGroupMemberId": "0l06XP/Y9Im5/pvGgtJYfzGMC9+WdhaxVcHT5CcAV/LsTp8Y6kTcjvcicGW6jfvaJA3/LA=="
    //     }
    // ]
      return response.data;
    })
    .catch((error) => {
      // 💥 상세 에러 로깅으로 수정!
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
    //   "data": [
    //     {
    //         "encGroupKey": "Scq5wDXowLXzQLD8ZKCFBQF+CS6k+Vp/oj4hXWlGWEvhOoYS+QSCdw=="
    //     }
    // ]
      return response.data;
    })
    .catch((error) => {
      // 💥 상세 에러 로깅으로 수정!
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
): Promise<ApiResponse<ViewGroupThirdResponseData[]>>=> {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup3(groupIdSets)
    .then((response) => {
      console.log("step3 - 실제 그룹 정보 요청  : ", response.data);
    //   "data": [
    //     {
    //         "groupId": "83b6015b-8ba7-489d-ad7e-229da602442f",
    //         "groupName": "진달래전(수정1번됨)",
    //         "groupImg": "꽃꽃꽃(수정1번됨)",
    //         "managerId": "bloomberg",
    //         "encUserId": [
    //             "C6t/+rMv3mlOKwB5eFkNMs2Af9CpA6iyYw=="
    //         ]
    //     }
    // ]
      return response.data;
    })
    .catch((error) => {
      // 💥 상세 에러 로깅으로 수정!
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
      // 💥 상세 에러 로깅으로 수정!
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
      // 💥 상세 에러 로깅으로 수정!
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
