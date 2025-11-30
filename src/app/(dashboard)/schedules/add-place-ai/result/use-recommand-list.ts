import { getAIRecommand } from "@/api/where2meet";
import { useQuery } from "@tanstack/react-query";

export const useRecommandList = (
  promiseId: string,
  pseudoId: string,
  latitude: number,
  longitude: number
) => {
  // export interface UserAIInfoReqDTO {
  //   pseudoId?: string;
  //   /** @format double */
  //   latitude?: number;
  //   /** @format double */
  //   longitude?: number;
  // }

  const data = {
    pseudoId  : pseudoId,
    latitude  : latitude,
    longitude  : longitude,
  };

  const {
    data: recommandList,
    isPending,
    error,
  } = useQuery({
    queryKey: ["recommand", "placeBoard", promiseId],
    queryFn: async () => {
      console.log("🔵 약속 장소 게시판 조회");
      const result = await getAIRecommand(promiseId, data);
      console.log("🔵 장소 게시판 서버 응답:", result);

      if (!result) {
        console.error("🔴 장소 게시판 로딩 에러:", result);
        throw new Error(result);
      }

      return result;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    recommandList,
    isPending,
    error,
  };
};
