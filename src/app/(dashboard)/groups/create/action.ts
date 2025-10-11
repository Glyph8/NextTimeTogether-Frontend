"use server";

import { createGroupRequest, createGroupRequest2 } from "@/api/group";
import { CreateGroup2Request } from "@/apis/generated/Api";
import encryptPlainData from "@/utils/crypto/encrypt-test";
import testGenerateKey from "@/utils/crypto/generate-key/key-generator";

// TODO : 서버 액션은 보통 재사용성을 위해 일반 객체 대신 FormData를 받지만,
// 일단 객체를 받도록 작성해두고 나중에 리팩토링 할 것

interface GroupData {
  groupName: string;
  groupExplain: string;
  groupImg: string;
  explain: string;
}

export async function createGroupAction(groupData: GroupData) {
  try {
    // 첫 번째 API 호출로 그룹 기본 정보 생성
    const firstApiResponse = await createGroupRequest({
      groupName: groupData.groupName,
      groupExplain: groupData.groupExplain,
      groupImg: groupData.groupImg,
      explain: groupData.explain,
    });

    // 성공적으로 그룹이 생성되었는지 확인 (API 응답 구조에 따라 달라짐)
    if (!firstApiResponse || !firstApiResponse.result) {
      throw new Error("1단계 그룹 생성에 실패했습니다.");
    }

    // 첫 응답값 활용
    const groupId = firstApiResponse.result.groupId;

    // 서버에서만 실행되어야 하는 암호화 로직 수행

    /*
    groupKey(그룹키) 자체적 생성 : `KeyGenerator.ts` 사용 (ex. IDt9/idSi2ryrHXv6hlUIQ==)
    ---
    [1] `encGroupId` = groupId(그룹 아이디)를 개인키(ex. LsEEoX7tXFlyXPa5rHvV0w==)로 암호화 (GroupProxyUser_iv사용) : `Encrypt-test.ts` 사용
    [2] `encUserId` = userId(유저 아이디)를 그룹키로 암호화 (GroupShareKey_iv사용) : `Encrypt-test.ts` 사용
    [3] `encencGroupMemberId` = `encUserId`를 개인키로 암호화 (GroupProxyUser_iv사용) : `Encrypt-test.ts` 사용
    [4] `encGroupKey` = groupKey(그룹키)를 개인키로 암호화  (GroupShareKey_iv사용): `Encrypt-test.ts` 사용

    */

    const groupKey = await testGenerateKey();

    const userId = "추후 redis로..";
    const masterkey = "추후 redis로..";

    const encGroupId = await encryptPlainData(
      groupId,
      masterkey,
      "group_proxy_user"
    );
    const encUserId = await encryptPlainData(
      userId,
      groupKey,
      "group_sharekey"
    );
    const encencGroupMemberId = await encryptPlainData(
      encUserId,
      masterkey,
      "group_proxy_user"
    );
    const encGroupKey = await encryptPlainData(
      groupKey,
      masterkey,
      "group_sharekey"
    );

    const encryptedMetaData: CreateGroup2Request = {
      groupId: groupId,
      encGroupId: encGroupId,
      encencGroupMemberId: encencGroupMemberId,
      encUserId: encUserId,
      encGroupKey: encGroupKey,
    };

    // 암호화된 데이터로 두 번째 API 호출
    const secondApiResponse = await createGroupRequest2(encryptedMetaData);

    if (!secondApiResponse || !secondApiResponse.result) {
      throw new Error("2단계 그룹 메타데이터 전송에 실패했습니다.");
    }

    // 클라이언트에 성공 결과와 필요한 데이터 반환
    return { success: true, data: secondApiResponse.result };
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
