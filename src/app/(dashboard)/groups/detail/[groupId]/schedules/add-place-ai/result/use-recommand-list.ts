import { getAIRecommand } from "@/api/where2meet";
import { useCurrentUserId } from "@/lib/currentUser";
import { makePseudoId } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useQuery } from "@tanstack/react-query";

export const useRecommandList = (
  promiseId: string,
  latitude: number,
  longitude: number,
  purpose: string,
) => {
  const userId = useCurrentUserId();

  const {
    data: recommandList,
    isPending,
    error,
  } = useQuery({
    queryKey: ["recommand", "placeBoard", promiseId],
    queryFn: async () => {
      const masterKey = await getMasterKey();

      if (!userId || !masterKey) {
        console.error("사용자 아이디 혹은 마스터키 오류");
        throw new Error("Auth Failed");
      }
      const pseudoIdIndexKey = localStorage.getItem("pseudo_id_index_key") || userId;
      const pseudoId = await makePseudoId(userId, pseudoIdIndexKey);

      const requestBody = {
        pseudoId: pseudoId,
        latitude: latitude,
        longitude: longitude,
        purpose: purpose,
      };

      const result = await getAIRecommand(requestBody);

      if (!result) {
        console.error("[useRecommandList] 장소 게시판 로딩 실패:", result);
        throw new Error(result);
      }

      return result;
    },
    enabled: !!promiseId && !!latitude && !!longitude && !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    recommandList,
    isPending,
    error,
  };
};
