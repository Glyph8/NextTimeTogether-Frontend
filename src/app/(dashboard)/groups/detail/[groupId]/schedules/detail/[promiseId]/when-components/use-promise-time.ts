import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { UserTimeSlotReqDTO, TimeSlotReqDTO } from "@/apis/generated/Api";
import {
  AvailableMembers,
  confirmTimetable,
  getAvailableMemberTime,
  getPromiseTimeBoard,
  TimeBoardResponse,
  updateMyTimetable,
} from "@/api/when2meet";

export const TIME_KEYS = {
  all: ["time"] as const,
  board: (promiseId: string) => [...TIME_KEYS.all, "board", promiseId] as const,
  cell: (promiseId: string, timeKey: string) =>
    [...TIME_KEYS.all, "cell", promiseId, timeKey] as const,
};

// [수정 포인트 1] isInputMode 파라미터 추가
// 사용자가 마우스로 드래그 중이거나 입력을 하고 있다면 폴링을 잠시 멈추기 위함입니다.
export const usePromiseTime = (promiseId: string, isInputMode: boolean = false) => {
  const queryClient = useQueryClient();

  const boardQuery = useQuery<TimeBoardResponse>({
    queryKey: TIME_KEYS.board(promiseId),
    queryFn: () => getPromiseTimeBoard(promiseId),

    // [전략 B 핵심: Smart Polling]
    // 1. 기본적으로 5초마다 데이터를 갱신합니다. (서버 부하와 실시간성의 타협점)
    // 2. 단, 사용자가 입력 중(isInputMode)이라면 폴링을 멈춥니다 (false).
    refetchInterval: isInputMode ? false : 5000,

    // [UX 최적화: 백그라운드 갱신 방지]
    // 사용자가 탭을 보고 있지 않을 때는 굳이 서버 자원을 쓸 필요가 없습니다.
    refetchIntervalInBackground: false,

    // [UX 최적화: 즉시 반응]
    // 사용자가 다른 탭을 갔다가 돌아오면 "즉시" 최신 데이터를 보여줍니다.
    refetchOnWindowFocus: true,

    // [데이터 일관성: Stale Time 조정]
    // 실시간성이 중요한 데이터이므로 staleTime을 0으로 설정하여,
    // 폴링 주기나 포커스 이벤트 발생 시 무조건 서버 데이터를 신뢰하도록 합니다.
    staleTime: 0,

    // [UI 최적화: 깜빡임 방지]
    // 새로운 데이터를 가져오는 동안 기존 데이터를 유지하여 UI가 깜빡이는 것을 막습니다.
    // (TanStack Query v5 이상에서는 placeholderData: (prev) => prev 사용 권장)
    // v4 이하라면 keepPreviousData: true 사용
    placeholderData: (previousData) => previousData,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserTimeSlotReqDTO) =>
      updateMyTimetable(promiseId, data),
    onSuccess: () => {
      // 내 데이터를 저장하면 즉시 다시 불러와서 반영
      queryClient.invalidateQueries({ queryKey: TIME_KEYS.board(promiseId) });
      toast.success("시간표가 저장되었습니다!");
    },
    onError: (error) => {
      console.error("시간표 저장 실패:", error);
      toast.error("저장에 실패했습니다.");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (data: string) => confirmTimetable(promiseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIME_KEYS.board(promiseId) });
      queryClient.invalidateQueries({
        queryKey: ["confirmedTime", promiseId, "groupDetail", "step1"],
      });
      toast.success("약속이 확정되었습니다! 🎉");
    },
    onError: (error) => {
      console.error("약속 확정 실패:", error);
      toast.error("약속 확정에 실패했습니다.");
    },
  });

  return { boardQuery, updateMutation, confirmMutation };
};

// ... (useTimeSlotDetail은 기존과 동일하거나 필요시 staleTime 조정)
export const useTimeSlotDetail = (
  promiseId: string,
  selectedSlot: { date: string; time: string } | null
) => {
  return useQuery<AvailableMembers>({
    queryKey: TIME_KEYS.cell(
      promiseId,
      `${selectedSlot?.date}_${selectedSlot?.time}`
    ),
    queryFn: () => {
      if (!selectedSlot) throw new Error("Slot not selected");
      const dto: TimeSlotReqDTO = {
        date: selectedSlot.date,
        time: selectedSlot.time,
      };
      return getAvailableMemberTime(promiseId, dto);
    },
    enabled: !!selectedSlot,
    staleTime: 1000 * 60 * 5,
  });
};