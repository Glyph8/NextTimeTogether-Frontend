import { useMutation, useQueryClient } from "@tanstack/react-query";
import { votePlace, unvotePlace } from "@/api/where2meet";
import toast from "react-hot-toast";

export const usePlaceVote = (promiseId: string) => {
  const queryClient = useQueryClient();

  // 투표 Mutation
  const { mutate: vote, isPending: isVotePending } = useMutation({
    mutationFn: async (placeId: number) => {
      const result = await votePlace(promiseId, placeId);
      if (result.code !== 200) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      // 쿼리 키 무효화 로직이 훅 안에 숨겨짐 -> UI는 알 필요 없음
      queryClient.invalidateQueries({
        queryKey: ["placeList", "placeBoard", promiseId],
      });
    },
    onError: (error) => {
      console.error("투표 실패:", error);
      toast.error("투표에 실패했습니다."); // 추후 Toast UI로 변경 권장
    },
  });

  // 투표 취소 Mutation
  const { mutate: unvote, isPending: isUnvotePending } = useMutation({
    mutationFn: async (placeId: number) => {
      const result = await unvotePlace(placeId);
      if (result.code !== 200) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["placeList", "placeBoard", promiseId],
      });
    },
    onError: (error) => {
      console.error("투표 취소 실패:", error);
      toast.error("취소에 실패했습니다.");
    },
  });

  return { vote, unvote, isPending: isVotePending || isUnvotePending };

};