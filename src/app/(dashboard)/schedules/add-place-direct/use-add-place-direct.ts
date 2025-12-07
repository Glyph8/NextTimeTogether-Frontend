import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPlaceBoard } from "@/api/where2meet";
import { useRouter } from "next/navigation";
import { PlaceRegisterDTO } from "@/apis/generated/Api";

export const useAddPlaceDirect = (promiseId: string | null) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: PlaceRegisterDTO[]) => {
      if (!promiseId) throw new Error("Promise ID is missing");
      const result = await registerPlaceBoard(promiseId, data);

      // API가 200이 아니면 에러로 취급하여 onError로 보내버림
      if (result.code !== 200) {
        throw new Error(result.message || "등록 실패");
      }
      return result;
    },

    // 2. 성공 시 실행될 로직 (컴포넌트에서 분리됨!)
    onSuccess: () => {
      console.log("✅ 장소 등록 성공");

      // 핵심: 목록 데이터를 '상한 것'으로 처리 -> 다시 불러오게 만듦
      if (promiseId) {
        queryClient.invalidateQueries({
          queryKey: ["placeList", "placeBoard", promiseId],
        });

        // 페이지 이동
        router.push(`/schedules/detail/${promiseId}`);
      }
    },

    onError: (error) => {
      console.error("❌ 장소 등록 실패:", error);
      alert("장소 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
