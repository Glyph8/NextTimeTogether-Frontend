"use client";

import { useQuery } from "@tanstack/react-query";
import { getNickName } from "@/api/appointment";
import { GroupItem } from "./GroupItem";
import { DEFAULT_IMAGE } from "@/constants";
import type { UserInfoDTO } from "@/apis/generated/Api";
import type { DecryptedGroupInfo } from "../use-group-list";

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
  /** 휴지통 클릭 시 어떤 그룹을 나가려는지 호출 측에 알려준다. */
  onRequestExit: (group: { groupId: string; groupName: string }) => void;
}

export const GroupItemContainer = ({
  group,
  onRequestExit,
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
      onRequestExit={() =>
        onRequestExit({ groupId: group.groupId, groupName: group.groupName })
      }
    />
  );
};
