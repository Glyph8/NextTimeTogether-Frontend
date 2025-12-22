"use client";

import { useQuery } from "@tanstack/react-query";
import { getNickName } from "@/api/appointment";
import { GroupMemberItem } from "./GroupMemberItem";

// 단일 유저 닉네임 조회 훅 (재사용 가능)
export const useMemberName = (userId: string) => {
    return useQuery({
        queryKey: ["memberName", userId],
        queryFn: async () => {
            // API가 배열을 받으므로 배열로 감싸서 요청
            // userId가 숫자인지 문자인지 API 스펙에 맞춰 변환 필요할 수 있음
            const res = await getNickName({ userIds: [userId] });
            // 결과 배열에서 첫 번째 유저의 이름 반환
            return res?.userInfoDTOList?.[0]?.userName ?? "알 수 없음";
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5분 캐싱
    });
};

interface GroupMemberItemContainerProps {
    memberId: string;
    isManager: boolean;
    isCurrentUser: boolean;
    selectable?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}

export const GroupMemberItemContainer = ({
    memberId,
    isManager,
    isCurrentUser,
    selectable,
    isSelected,
    onClick,
}: GroupMemberItemContainerProps) => {
    const { data: memberName, isLoading } = useMemberName(memberId);

    // 마커 로직
    const markers = [];
    if (isManager) markers.push("그룹장");
    if (isCurrentUser) markers.push("사용자");

    return (
        <GroupMemberItem
            key={memberId}
            name={isLoading ? "..." : (memberName ?? "알 수 없음")} // 로딩 상태 처리
            marker={markers.length > 0 ? markers : undefined}
            selectable={selectable}
            isSelected={isSelected}
            onClick={onClick}
        />
    );
};