import { getPlaceBoard } from "@/api/where2meet";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const usePlaceBoard = (promiseId: string) => {
  const [page, setPage] = useState(1);
  const {
    data: placeListInfo,
    isPending,
    error,
  } = useQuery({
    queryKey: ["placeList", "placeBoard", promiseId, page],
    queryFn: async () => {
      const result = await getPlaceBoard(promiseId, page);
      if (!result) throw new Error("데이터 로딩 실패");
      return result;
    },
    // [전략 1] Polling 적용 (3초 주기)
    // 장소 투표는 시간표보다 충돌 위험이 적지만, "숫자가 올라가는 재미"를 위해 3초 정도로 설정
    refetchInterval: 3000,

    // [전략 2] 백그라운드 갱신 제한
    // 탭을 보고 있지 않을 때까지 투표 수를 갱신할 필요는 없습니다 (서버 비용 절약)
    refetchIntervalInBackground: false,

    // [전략 3] 최신 데이터 보장
    // Polling이 돌 때마다 서버 데이터를 신뢰해야 하므로 staleTime을 0으로 설정
    staleTime: 0,

    // [전략 4] UI 깜빡임 방지 (UX 핵심)
    // 3초마다 재요청할 때 '로딩 스피너'가 깜빡거리면 사용자가 매우 피로해집니다.
    // 새 데이터가 올 때까지 기존 데이터를 유지해줍니다.
    placeholderData: (previousData) => previousData,
  });

  return {
    placeListInfo,
    isPending,
    error,
    page,
    setPage,
  };
};