"use client";

import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { getNickName } from "@/api/appointment";
import { GroupItem } from "./GroupItem";
import { DEFAULT_IMAGE } from "@/constants";
import type { UserInfoDTO } from "@/apis/generated/Api";
import type { DecryptedGroupInfo } from "../use-group-list";

// 멤버 ID 리스트로 닉네임을 조회해 ", " 로 결합한다.
const useGroupMemberNames = (userIds: string[]) => {
  return useQuery({
    queryKey: ["groupMembers", userIds],
    queryFn: async () => {
      const res = await getNickName({ userIds });
      const list: UserInfoDTO[] = res.userInfoDTOList ?? [];
      return list.map((u) => u.userName ?? "").filter(Boolean).join(", ");
    },
    enabled: !!userIds.length,
    staleTime: 1000 * 60 * 5,
  });
};

interface GroupItemContainerProps {
  group: DecryptedGroupInfo;
  setIsOpenExitDialog: Dispatch<SetStateAction<boolean>>;
}

export const GroupItemContainer = ({
  group,
  setIsOpenExitDialog,
}: GroupItemContainerProps) => {
  const { data: memberNames } = useGroupMemberNames(group.userIds);

  return (
    <GroupItem
      key={group.groupId}
      groupId={group.groupId}
      image={group.groupImg ?? DEFAULT_IMAGE}
      title={group.groupName}
      description={group.explanation ?? "설명 없음"}
      members={memberNames ?? "로딩 중..."}
      setIsOpen={setIsOpenExitDialog}
    />
  );
};
