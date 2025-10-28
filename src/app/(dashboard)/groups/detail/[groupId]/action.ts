"use server";

import {
  getInviteEncENcNewMemberId,
  getInviteEncGroupsKeyRequest,
  getMakeInviteLink,
} from "@/api/group";
import encryptPlainData from "@/utils/crypto/encrypt-test";
import { decryptKey } from "@/utils/crypto/generate-key/manage-session-key";
import generateGroupJoinURL from "@/utils/crypto/group/make-invite-code";
import { cookies } from "next/headers";

export async function getGroupDetailInfoAction(groupId: string) {
  const cookieStore = await cookies();

  const encryptedKey = cookieStore.get("encrypted-master-key")?.value;
  if (!encryptedKey) throw new Error("인증 필요");
  const encryptedUserId = cookieStore.get("encrypted-user-id")?.value;
  if (!encryptedUserId) throw new Error("재로그인 필요");
  const masterKey = decryptKey(encryptedKey);
}

/** 그룹 초대 코드 발급 action */
export async function getInviteLinkAction(groupId: string) {
  const cookieStore = await cookies();

  const encryptedKey = cookieStore.get("encrypted-master-key")?.value;
  if (!encryptedKey) throw new Error("인증 필요");
  const encryptedUserId = cookieStore.get("encrypted-user-id")?.value;
  if (!encryptedUserId) throw new Error("재로그인 필요");
  const masterKey = decryptKey(encryptedKey);
  // const userId = decryptKey(encryptedUserId);
  // 기본 마스터키, 사용자 아이디 획득

  const encGroupId = await encryptPlainData(
    groupId,
    masterKey,
    "group_proxy_user"
  );

  // 그룹 초대 step1 : 암호화된 그룹 멤버 아이디 획득
  console.log(
    "그룹 초대 step1 전송할 데이터 groupID : ",
    groupId,
    "encGroupID : ",
    encGroupId
  );
  const firstResponse = await getInviteEncENcNewMemberId({
    groupId: groupId,
    encGroupId: encGroupId,
  });

  if (!firstResponse.encencGroupMemberId) {
    return { success: false, error: "초대 코드 1단계 실패" };
  }

  const encUserId = await encryptPlainData(
    firstResponse.encencGroupMemberId,
    masterKey,
    "group_proxy_user"
  );
  // 암호화된 그룹 키 획득
  const secondResponse = await getInviteEncGroupsKeyRequest({
    groupId: groupId,
    encUserId: encUserId,
  });

  if (!secondResponse.encGroupKey) {
    return { success: false, error: "초대 코드 2단계 실패" };
  }

  const groupKey = await encryptPlainData(
    secondResponse.encGroupKey,
    masterKey,
    "group_sharekey"
  );

  const inviteURL = generateGroupJoinURL(groupKey, groupId);

  // const finalResponse = await getMakeInviteLink({
  //   randomKeyForRedis: "1234567890",
  //   s3reserve: inviteURL,
  // });
  const finalResponse = await getMakeInviteLink({
    encryptedValue: inviteURL,
    encryptedEmail: "newdy0808@gmail.com",
  });

  if (!finalResponse.explain || !finalResponse.inviteCode) {
    return { success: false, error: "최종 초대 링크 생성에 실패했습니다." };
  }
  const finalInviteLink = "!@#!@#!@#!@#!@#@";
  console.log(
    "explain : ",
    finalResponse.explain,
    "   inviteCode ",
    finalResponse.inviteCode
  );
  // return finalInviteLink;

  return { success: true, data: finalResponse.inviteCode };
}
