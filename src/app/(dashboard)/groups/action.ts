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
export async function getEncGroupsIdAction(accessToken: string): Promise<{
  success: boolean;
  data?: ViewGroupFirstResponseData[];
  error?: string;
}> {
  try {
    // 클라이언트가 Zustand 메모리의 AccessToken을 인자로 전달.
    const firstApiResponse = await getEncGroupsIdRequest(accessToken);
    if (!firstApiResponse || !firstApiResponse.result) {
      throw new Error("1단계 그룹 데이터 로딩 실패");
    }

    return { success: true, data: firstApiResponse.result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// --- 2단계 액션 ---
export async function getEncGroupsKeyAction(
  accessToken: string,
  decryptedGroupObjects: { groupId: string; encGroupMemberId: string }[]
): Promise<{ success: boolean; data?: ViewGroupSecResponseData[]; error?: string }> {
  try {
    const secondApiResponse = await getEncGroupsKeyRequest(
      accessToken,
      decryptedGroupObjects
    );
    if (!secondApiResponse || !secondApiResponse.result) {
      throw new Error("2단계 그룹 키 로딩 실패");
    }

    return { success: true, data: secondApiResponse.result };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// --- 3단계 액션 ---
export async function getGroupsInfoAction(
  accessToken: string,
  groupIdObjects: { groupId: string }[]
): Promise<{ success: boolean; data?: ViewGroupThirdResponseData[]; error?: string }> {
  try {
    const fianlApiResponse = (
      await getGroupsInfoRequest(accessToken, groupIdObjects)
    ).result;
    if (!fianlApiResponse) {
      return { success: true, data: [] };
    }

    return { success: true, data: fianlApiResponse };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

