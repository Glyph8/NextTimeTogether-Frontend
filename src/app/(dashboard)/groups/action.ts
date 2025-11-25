"use server";

import {
  getEncGroupsIdRequest,
  getEncGroupsKeyRequest,
  getGroupsInfoRequest,
  ViewGroupFirstResponseData,
  ViewGroupSecResponseData,
  ViewGroupThirdResponseData,
} from "@/api/group-view-create";

// E2EE 원칙: BFF는 인증/인가를 API 계층(axiosInstance)에 위임하고,
// 암호화된 데이터를 그대로 전달(Relay)합니다.

// --- 1단계 액션 ---
export async function getEncGroupsIdAction(): Promise<{
  success: boolean;
  data?: ViewGroupFirstResponseData[];
  error?: string;
}> {
  try {
    // 1. 인증(AccessToken 헤더)은 클라이언트의 `axiosInstance`가 자동으로 처리합니다.
    // 2. BFF는 백엔드에 암호화된 데이터 요청을 '전달'만 합니다.
    const firstApiResponse = await getEncGroupsIdRequest();
    if (!firstApiResponse || !firstApiResponse.result) {
      throw new Error("1단계 그룹 데이터 로딩 실패");
    }

    // 3. 암호화된 데이터를 클라이언트에 그대로 반환
    return { success: true, data: firstApiResponse.result };
  } catch (err) {
    const error = err as Error;
    // (axiosInstance의 401/403 에러가 여기에 잡혀서 반환됩니다)
    return { success: false, error: error.message };
  }
}

// --- 2단계 액션 ---
export async function getEncGroupsKeyAction(
  decryptedGroupObjects: { groupId: string; encGroupMemberId: string }[]
): Promise<{ success: boolean; data?: ViewGroupSecResponseData[]; error?: string }> {
  try {
    // 1. 인증은 `axiosInstance`가 자동으로 처리
    const secondApiResponse = await getEncGroupsKeyRequest(
      decryptedGroupObjects
    );
    if (!secondApiResponse || !secondApiResponse.result) {
      throw new Error("2단계 그룹 키 로딩 실패");
    }

    // 2. 암호화된 데이터를 클라이언트에 그대로 반환
    return { success: true, data: secondApiResponse.result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// --- 3단계 액션 ---
export async function getGroupsInfoAction(
  groupIdObjects: { groupId: string }[]
): Promise<{ success: boolean; data?: ViewGroupThirdResponseData[]; error?: string }> {
  try {
    // 1. 인증은 `axiosInstance`가 자동으로 처리
    const fianlApiResponse = (await getGroupsInfoRequest(groupIdObjects))
      .result;
    if (!fianlApiResponse) {
      return { success: true, data: [] };
    }

    // 2. 암호화된 데이터를 클라이언트에 그대로 반환
    return { success: true, data: fianlApiResponse };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

