"use client";

import { useQuery } from "@tanstack/react-query";
import { getJoinRequestEmailAction } from "../detail/[groupId]/action";

interface UseGroupJoinRequestProps {
  groupId: string;
  enabledOption?: boolean
}

/**
 * [손님용 2단계] 그룹 참가 신청 (대기실 등록) 훅
 * - Swagger (image_a54f49.png)의 API를 호출합니다.
 */
export const useGroupJoinRequest = ({ groupId, enabledOption = true }: UseGroupJoinRequestProps) => {
  return useQuery({
    queryKey: ["groupJoinRequest", groupId],
    queryFn: async () => {
      console.log("🔵 [손님 2단계] 그룹 참가 신청(대기실 등록) 시작");
      const result = await getJoinRequestEmailAction(groupId);

      if (!result.success) {
        throw new Error(result.error || "참가 신청에 실패했습니다.");
      }
      
      console.log(`✅ [손님 2단계] 대기실 등록 완료: ${result.data}`);
      // 대기실에 등록된 손님 본인의 이메일을 반환
      return result.data;
    },
    enabled: !!groupId && groupId !== "error" && enabledOption,
    retry: 1,
    staleTime: Infinity, // 참가 신청은 한 번만 하면 됨
  });
};