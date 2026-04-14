import {
  BaseResponse,
  CreateGroup1Request,
  CreateGroup2Request,
  ViewGroup2Request,
  ViewGroup3Request,
} from "@/apis/generated/Api";
import { ApiResponse, createServerApi } from "./server-index";
import { handleApiError } from ".";

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
  explanation: string;
  groupImg: string;
  managerId: string;
  encUserId: string[];
}

/** 참여한 그룹들의 암호화 된 groupId, groupMemberId 리스트 요청하기 */
export const getEncGroupsIdRequest = async (): Promise<
  ApiResponse<ViewGroupFirstResponseData[]>
> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup1()
    .then((response) => response.data)
    .catch(handleApiError);
};

/** groupId와 groupMemberKey로 암호화된 groupKey 요청 */
export const getEncGroupsKeyRequest = async (
  groupIdAndKeySets: ViewGroup2Request[]
): Promise<ApiResponse<ViewGroupSecResponseData[]>> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup2(groupIdAndKeySets)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** groupId로 실제 그룹 정보 요청 */
export const getGroupsInfoRequest = async (
  groupIdSets: ViewGroup3Request[]
): Promise<ApiResponse<ViewGroupThirdResponseData[]>> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .viewGroup3(groupIdSets)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 생성할 그룹 정보 서버로 보내주기 */
export const createGroupRequest = async (
  groupInfo: CreateGroup1Request
): Promise<BaseResponse> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .createGroup1(groupInfo)
    .then((response) => response.data)
    .catch(handleApiError);
};

/** 그룹의 메타 데이터 암호화하여 POST */
export const createGroupRequest2 = async (
  encGroupMetaInfo: CreateGroup2Request
): Promise<BaseResponse> => {
  const serverApi = await createServerApi();

  return serverApi.api
    .createGroup2(encGroupMetaInfo)
    .then((response) => response.data)
    .catch(handleApiError);
};
