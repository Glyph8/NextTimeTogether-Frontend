"use client";

import { useQuery } from "@tanstack/react-query";
import { getNickName } from "@/api/appointment";
import { GroupItem } from "./GroupItem";
import { DEFAULT_IMAGE } from "@/constants";

// 닉네임 쿼리 훅
const useGroupMemberNames = (userIds: string[]) => {
  return useQuery({
    queryKey: ["groupMembers", userIds],
    queryFn: async () => {
      // API가 number[]를 받는지 string[]을 받는지 타입 확인 필요
      const res = await getNickName({ userIds: userIds }); 
      return res.userInfoDTOList.map((u: any) => u.userName).join(", ");
    },
    enabled: !!userIds.length,
    staleTime: 1000 * 60 * 5,
  });
};

export const GroupItemContainer = ({ 
  group, 
  setIsOpenExitDialog 
}: { 
  group: any, 
  setIsOpenExitDialog: any 
}) => {
  const { data: memberNames } = useGroupMemberNames(group.userIds);

  return (
    <GroupItem
      key={group.groupId}
      groupId={group.groupId}
      image={group.groupImg ?? DEFAULT_IMAGE}
      title={group.groupName}
      description={group.explanation ?? "설명 없음"}
      members={memberNames ?? "로딩 중..."} // 혹은 스켈레톤 처리가능
      setIsOpen={setIsOpenExitDialog}
    />
  );
};