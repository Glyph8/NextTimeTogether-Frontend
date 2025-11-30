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
      console.log("🔵 약속 장소 게시판 조회");
      const result = await getPlaceBoard(promiseId, page);
      console.log("🔵 장소 게시판 서버 응답:", result);

      if (!result) {
        console.error("🔴 장소 게시판 로딩 에러:", result);
        throw new Error(result);
      }

      return result
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    placeListInfo,
    isPending,
    error,
    page,
    setPage,
  };
};
