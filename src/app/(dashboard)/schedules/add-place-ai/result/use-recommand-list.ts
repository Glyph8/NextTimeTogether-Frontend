import { getAIRecommand } from "@/api/where2meet";
import { useAuthStore } from "@/store/auth.store";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useQuery } from "@tanstack/react-query";

export const useRecommandList = (
  promiseId: string,
  latitude: number,
  longitude: number
) => {
  const userId = useAuthStore((state) => state.userId);

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
      const pseudoId  = await encryptDataClient(userId, masterKey, "user_iv")

      const requestBody = {
        pseudoId: pseudoId,
        latitude: latitude,
        longitude: longitude,
      };

      console.log("🔵 약속 장소 게시판 조회");
      // const result = await getAIRecommand(promiseId, requestBody);
      const result = await getAIRecommand(requestBody);
      console.log("🔵 장소 게시판 서버 응답:", result);

      if (!result) {
        console.error("🔴 장소 게시판 로딩 에러:", result);
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
