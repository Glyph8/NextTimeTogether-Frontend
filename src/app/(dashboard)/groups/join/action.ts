"use server"

export const joinGroupAction = async (token: string): Promise<
  | { success: true; groupId: string }
  | { success: false; error: string }
> => {
  console.log("모의 그룹 가입 시도:", token);
  // 모의 API 호출 시간
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (token === "valid-token") {
    // 모의 성공
    return { success: true, groupId: "new-group-123" };
  } else if (token === "expired-token") {
    // 모의 실패 (예: 만료된 토큰)
    return { success: false, error: "만료된 초대 링크입니다." };
  } else {
    // 모의 실패 (예: 유효하지 않은 토큰)
    return { success: false, error: "유효하지 않은 초대 링크입니다." };
  }
};