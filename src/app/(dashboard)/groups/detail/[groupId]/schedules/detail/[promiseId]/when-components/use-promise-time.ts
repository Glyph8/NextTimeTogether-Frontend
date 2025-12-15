import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { UserTimeSlotReqDTO, TimeSlotReqDTO } from "@/apis/generated/Api";
import { AvailableMembers, confirmTimetable, getAvailableMemberTime, getPromiseTimeBoard, TimeBoardResponse, updateMyTimetable } from "@/api/when2meet";

export const TIME_KEYS = {
  all: ["time"] as const,
  board: (promiseId: string) => [...TIME_KEYS.all, "board", promiseId] as const,
  cell: (promiseId: string, timeKey: string) => [...TIME_KEYS.all, "cell", promiseId, timeKey] as const,
};

export const usePromiseTime = (promiseId: string) => {
  const queryClient = useQueryClient();

  const boardQuery = useQuery<TimeBoardResponse>({
    queryKey: TIME_KEYS.board(promiseId),
    queryFn: () => getPromiseTimeBoard(promiseId),
    staleTime: 1000 * 60, // 1분간은 캐시된 데이터 사용 (불필요한 호출 방지)
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserTimeSlotReqDTO) => updateMyTimetable(promiseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIME_KEYS.board(promiseId) });
      toast.success("시간표가 저장되었습니다!");
    },
    onError: (error) => {
      console.error("시간표 저장 실패:", error);
      toast.error("저장에 실패했습니다.");
    }
  });

  const confirmMutation = useMutation({
    mutationFn: (data: string) => confirmTimetable(promiseId, data),
    onSuccess: () => {
      // 확정이 성공하면 약속 정보를 다시 불러오거나, 페이지를 이동시키는 등의 처리
      queryClient.invalidateQueries({ queryKey: TIME_KEYS.board(promiseId) });
      toast.success("약속이 확정되었습니다! 🎉");
    },
    onError: (error) => {
      console.error("약속 확정 실패:", error);
      toast.error("약속 확정에 실패했습니다.");
    }
  });

  return { boardQuery, updateMutation, confirmMutation };
};

// 3. 특정 시간대(Cell) 상세 조회 (Dialog용)
export const useTimeSlotDetail = (
  promiseId: string,
  selectedSlot: { date: string; time: string } | null
) => {
  return useQuery<AvailableMembers>({
    queryKey: TIME_KEYS.cell(promiseId, `${selectedSlot?.date}_${selectedSlot?.time}`),
    queryFn: () => {
      if (!selectedSlot) throw new Error("Slot not selected");
      const dto: TimeSlotReqDTO = {
        date: selectedSlot.date,
        time: selectedSlot.time
      };
      return getAvailableMemberTime(promiseId, dto);
    },
    enabled: !!selectedSlot, // 슬롯이 선택되었을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 상세 정보는 자주 변하지 않으므로 5분 캐싱
  });
};