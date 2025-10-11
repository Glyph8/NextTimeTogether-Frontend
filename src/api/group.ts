import {
  Api,
  BaseResponse,
  CreateGroup1Request,
  CreateGroup2Request,
} from "@/apis/generated/Api";

const api = new Api();

/** 생성할 그룹 정보 서버로 보내주기 */
export const createGroupRequest = async (
  groupInfo: CreateGroup1Request
): Promise<BaseResponse> =>
  api.api
    .createGroup1(groupInfo)
    .then((response) => {
      console.log("그룹 생성 1 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(groupInfo);
      console.error(error);
      throw error;
    });

/** 그룹의 메타 데이터 암호화하여 POST */
export const createGroupRequest2 = async (
  encGroupMetaInfo: CreateGroup2Request
): Promise<BaseResponse> =>
  api.api
    .createGroup2(encGroupMetaInfo)
    .then((response) => {
      console.log("암호화된 그룹의 메타데이터 (그룹 생성2) : ", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(encGroupMetaInfo);
      console.error(error);
      throw error;
    });
