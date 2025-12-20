// app/groups/create/action.ts
"use server";

import { createGroupRequest, createGroupRequest2 } from "@/api/group-view-create";
import { CreateGroup2Request } from "@/apis/generated/Api";
// crypto 관련 import 모두 제거

interface GroupData {
  groupName: string;
  groupExplain: string;
  groupImg: string;
}

/**
 * [E2EE 수정] 1단계: E2EE가 아닌, 공개/반공개 그룹 '정보'만 생성
 * 이 액션은 마스터키에 접근하지 않습니다.
 */
export async function createGroupInfoAction(groupData: GroupData) {
  try {
    // 1. API 1 호출 (인증은 쿠키의 AccessToken으로 자동 처리됨)
    const response = await createGroupRequest(groupData);

    if (!response || !response.result) {
      throw new Error("1단계 그룹 정보 생성에 실패했습니다.");
    }

    // 2. 클라이언트에 groupId를 반환
    return { success: true, groupId: response.result.groupId };
  } catch (error) {
    console.error("1단계 액션 실패:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "1단계 API 호출 오류"
    };
  }
}

/**
 * [E2EE 수정] 2단계: 클라이언트에서 암호화된 'E2EE 메타데이터'를 받아 저장
 * 이 액션은 암호화된 데이터를 그대로 전달만 합니다.
 */
export async function createGroupMetadataAction(
  encryptedMetaData: CreateGroup2Request
) {
  try {
    // 1. API 2 호출
    const response = await createGroupRequest2(encryptedMetaData);

    if (!response || !response.result) {
      throw new Error("2단계 그룹 메타데이터 전송에 실패했습니다.");
    }

    // 2. 클라이언트에 최종 성공 여부 반환
    return { success: true, data: response.result };
  } catch (error) {
    console.error("2단계 액션 실패:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "2단계 API 호출 오류"
    };
  }
}