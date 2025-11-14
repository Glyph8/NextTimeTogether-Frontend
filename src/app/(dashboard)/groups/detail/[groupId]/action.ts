"use server";

import {
  apiGetGroupJoinRequest,
  apiPostGroupMemberSave,
  getInviteEncENcNewMemberId,
  getInviteEncGroupsKeyRequest,
} from "@/api/group-invite-join";
import { SaveGroupMemberRequest } from "@/apis/generated/Api";

/**
 * [E2EE 수정] 1단계: 암호화된 멤버 ID 요청 (Dumb Proxy)
 * - 클라이언트가 암호화한 encGroupId를 받아 API에 전달합니다.
 * - 서버는 마스터키나 평문을 알지 못합니다.
 */
export async function getEncMemberIdForInviteAction(
  groupId: string,
  encGroupId: string
) {
  try {
    const response = await getInviteEncENcNewMemberId({
      groupId: groupId,
      encGroupId: encGroupId,
    });

    if (!response.encencGroupMemberId) {
      return { success: false, error: "API 1단계 실패" };
    }
    // API가 반환한 값을 그대로 클라이언트에 전달
    return { success: true, data: response.encencGroupMemberId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "1단계 서버 오류",
    };
  }
}

/**
 * [E2EE 수정] 2단계: 암호화된 그룹 키 요청 (Dumb Proxy)
 * - 클라이언트가 암호화한 encUserId를 받아 API에 전달합니다.
 */
export async function getEncGroupKeyForInviteAction(
  groupId: string,
  encUserId: string
) {
  try {
    const response = await getInviteEncGroupsKeyRequest({
      groupId: groupId,
      encUserId: encUserId,
    });

    if (!response.encGroupKey) {
      return { success: false, error: "API 2단계 실패" };
    }
    // API가 반환한 값을 그대로 클라이언트에 전달
    return { success: true, data: response.encGroupKey };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "2단계 서버 오류",
    };
  }
}

export async function getJoinRequestEmailAction(groupId: string) {
  try {
    // 이 API는 인증이 필요하므로, 쿠키(토큰)가 자동으로 전달되어야 합니다.
    const response = await apiGetGroupJoinRequest(groupId);

    // TODO : email만 오는 거 맞음??
    //   if (!response.result?.email) {
    if (!response.email) {
      return { success: false, error: "참가 신청 실패 또는 이메일 없음" };
    }
    // 성공 시, "대기실에 등록됨"을 확인하는 이메일을 반환
    return { success: true, data: response.email };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "그룹 참가 신청 오류",
    };
  }
}

/**
 * [신규] 3단계 (손님): 그룹 최종 가입 (E2EE 정보 제출)
 * - POST /api/v1/group/member/save
 * - Swagger (image_a54f0b.png)에 해당
 * - 손님이 클라이언트에서 E2EE로 암호화한 "등록 패킷"을 받아
 * 서버 DB에 그대로 저장합니다.
 */
export async function saveGroupMemberAction(
  payload: SaveGroupMemberRequest // { groupId, encGroupKey, ... }
) {
  try {
    const response = await apiPostGroupMemberSave(payload);

    // TODO : message만 오는 거 맞음??

    // if (!response.result?.message) {
    if (!response.message) {
      return { success: false, error: "그룹 가입 실패" };
    }
    // 성공 시, 환영 메시지 반환 TODO : mesasge만 오는 게 맞는지
    return { success: true, data: response.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "그룹 가입 처리 오류",
    };
  }
}

/**
 * [E2EE 수정] 3단계: 최종 초대 링크 생성 요청 (Dumb Proxy)
 * - 클라이언트가 생성한 inviteURL을 받아 API에 전달합니다.
 */
// export async function finalizeInviteLinkAction(
//   inviteURL: string,
//   email: string // 하드코딩 되어있던 이메일도 파라미터로 받도록 수정
// ) {
//   try {
//     const response = await getMakeInviteLink({
//       redis: inviteURL,
//       encryptedEmail: email,
//     });

//     if (!response.inviteCode) {
//       return { success: false, error: "API 3단계 실패" };
//     }
//     return { success: true, data: response.inviteCode };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "3단계 서버 오류",
//     };
//   }
// }
