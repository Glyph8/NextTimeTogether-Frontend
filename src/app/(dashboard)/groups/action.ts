"use server";

import {
  getEncGroupsIdRequest,
  getEncGroupsKeyRequest,
  getGroupsInfoRequest,
} from "@/api/group";
import decryptEncryptData from "@/utils/crypto/decrypt-test";
import { decryptKey } from "@/utils/crypto/generate-key/manage-session-key";
import { cookies } from "next/headers";

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
  managerId : string;
  encUserId: string[];
}

export async function getGroupListAction() {
  const cookieStore = await cookies();

  const encryptedKey = cookieStore.get("encrypted-master-key")?.value;
  if (!encryptedKey) throw new Error("인증 필요");
  const encryptedUserId = cookieStore.get("encrypted-user-id")?.value;
  if (!encryptedUserId) throw new Error("재로그인 필요");

  const masterKey = decryptKey(encryptedKey);
  // const userId = decryptKey(encryptedUserId);

  // 기본 마스터키, 사용자 아이디 획득

  try {
    // 첫 번째 API 호출로 그룹 기본 정보 생성

    console.log("###### 그룹 조회 요청 시퀀스 시작 #####")

    const firstApiResponse = await getEncGroupsIdRequest();

    // 성공적으로 그룹이 생성되었는지 확인 (API 응답 구조에 따라 달라짐)
    if (!firstApiResponse || !firstApiResponse.result) {
      throw new Error("1단계 그룹 데이터 로딩에 실패했습니다.");
    }

    // 첫 응답값 활용
    /*
    [1] 사용자의 토큰을 삽입한 요청으로, 참가한 암호환 groupID, groupMemberID로 구성 된 집합을 응답받는다.
    [1-2] `groupId` = `encGroupId`를 개인키(ex. LsEEoX7tXFlyXPa5rHvV0w==)로 복호화 (GroupProxyUser_iv사용) : `Decrypt-test.ts` 사용
    [1-3] groupId는 리스트 형태로 저장해두기
    */
    const encGroupIdAndKeyArray: ViewGroupFirstResponseData[] =
      firstApiResponse.result;
    console.log("1단계 그룹 데이터 로딩 성공", encGroupIdAndKeyArray);

    const decryptedGroupObjects = await Promise.all(
      encGroupIdAndKeyArray.map(async (item) => {
        // 각 항목에 대해 복호화 작업을 딱 한 번만 수행합니다.
        const decryptedGroupId = await decryptEncryptData(
          item.encGroupId,
          masterKey,
          "group_proxy_user"
        );

        const decryptedGroupMemberId = await decryptEncryptData(
          item.encencGroupMemberId,
          masterKey,
          "group_proxy_user"
        );

        // TODO : encenc?? 이것도 복호화 한번 하라는거야?
        return {
          groupId: decryptedGroupId,
          encGroupMemberId: decryptedGroupMemberId
        };
      })
    );

    // 둘 중 하나..
    // const decryptedGroupIds = decryptedGroupObjects.map((item) => item.groupId);
    const groupIdObjects = decryptedGroupObjects.map((item) => ({
      groupId: item.groupId,
    }));
    /*
    [2] 
    [2-1] groupKey(그룹키) = encGroupKey를 개인키(ex. LsEEoX7tXFlyXPa5rHvV0w==)로 복호화 (GroupShareKey_iv사용) : Decrypt-test.ts 사용
    [2-3] groupKey 저장해두기
    */

    console.log("2단계 그룹 메타데이터 ", decryptedGroupObjects);

    // 암호화된 데이터로 두 번째 API 호출
    const secondApiResponse = await getEncGroupsKeyRequest(
      decryptedGroupObjects
    );

    if (!secondApiResponse || !secondApiResponse.result) {
      throw new Error("2단계 그룹 메타데이터 전송에 실패했습니다.");
    }

    const encGroupKeys = secondApiResponse.result;

    const decryptedGroupKeyObjects = await Promise.all(
      encGroupKeys.map(async (item) => {
        const decryptedGroupKey = await decryptEncryptData(
          item.encGroupKey,
          masterKey,
          "group_sharekey"
        );

        return {
          groupKey: decryptedGroupKey,
        };
      })
    );

    // groupKey 쿠키 저장
    // json 형식 문자열로 객체를 변환해서 넣음. 추후 파싱해서 쓸 것.
    cookieStore.set("groupKeys", JSON.stringify(decryptedGroupKeyObjects), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 https 강제
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/", // 사이트 전체에서 사용
    });

    /*
    [3] 암호화한? groupId를 인자로, 요청. 실제 그룹 데이터 객체 배열 응답받음.
    [3-1] 객체에서, ?? edit3을 해야 할 수 있는건가?
    */
    const fianlApiResponse = await getGroupsInfoRequest(groupIdObjects);

    // 클라이언트에 성공 결과와 필요한 데이터 반환
    return { success: true, data: fianlApiResponse.result };
  } catch (error) {
    console.error("그룹 생성 액션 실패:", error);
    // 클라이언트에 에러 정보 반환
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
