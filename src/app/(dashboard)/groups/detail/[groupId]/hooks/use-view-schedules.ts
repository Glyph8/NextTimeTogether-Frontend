import {
  getEncPromiseIdList,
  getPromiseInProgress,
  getScheduleIdListPerPromise,
  getScheduleIdPerFixedPromise,
} from "@/api/promise-view-create";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface UseViewSchedulesOptions {
  refetchInterval?: number;
}

export const useViewSchedules = (options?: UseViewSchedulesOptions) => {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  // --- 1단계: 암호화된 약속 ID 조회 + [핵심] 즉시 복호화 ---
  const {
    data: decryptedPromiseIdList, // 이제 여기서 바로 복호화된 ID 배열이 나옵니다.
    isPending: isPending1,
    error: error1,
  } = useQuery({
    queryKey: ["promiseIdList", "step1", "decrypted", groupId],
    queryFn: async () => {
      // 1. API 호출
      const result = await getEncPromiseIdList();
      if (!result || result.length === 0) return [];

      // 2. [리팩토링] 복호화 로직을 queryFn 내부로 통합
      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

      try {
        const decryptedPromises = await Promise.all(
          result.map(async (item) => {
            if (!item.encPromiseId) throw new Error("Invalid ID");
            return await decryptDataWithCryptoKey(
              item.encPromiseId,
              masterKey,
              "promise_proxy_user"
            );
          })
        );
        return decryptedPromises;
      } catch (err) {
        console.error("복호화 실패:", err);
        throw new Error("약속 정보를 해독하는데 실패했습니다.");
      }
    },
    // [Smart Polling 적용]
    refetchInterval: options?.refetchInterval || 3000, // 3초마다 새로운 약속이 생겼는지 확인
    refetchIntervalInBackground: false,
    staleTime: 0,
    placeholderData: (prev) => prev, // 깜빡임 방지
  });

  // 데이터 존재 여부 확인
  const hasPromiseIds =
    !!decryptedPromiseIdList && decryptedPromiseIdList.length > 0;

  // --- 2단계: 진행 중인 약속 조회 ---
  const {
    data: promiseInProgressData,
    isPending: isPending2,
    error: error2,
  } = useQuery({
    queryKey: ["promiseInProgressList", "step2", decryptedPromiseIdList],
    queryFn: async () => {
      const result = await getPromiseInProgress({
        groupId: groupId,
        promiseIdList: decryptedPromiseIdList!,
      });
      return result || [];
    },
    enabled: hasPromiseIds, // 복호화된 ID가 있을 때만 실행
    // 상위 쿼리(Step 1)가 Polling되면 얘도 자동으로 stale 처리되어 다시 가져옴
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  // --- 3단계: 스케줄 ID 조회 ---
  const {
    data: scheduleIdList,
    isPending: isPending3,
    error: error3,
  } = useQuery({
    queryKey: ["scheduleIdList", "step3", decryptedPromiseIdList],
    queryFn: async () => {
      const result = await getScheduleIdListPerPromise({
        promiseIdList: decryptedPromiseIdList!,
      });
      return result || [];
    },
    enabled: hasPromiseIds,
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  // --- 4단계: 확정된 약속 조회 ---
  const {
    data: fixedScheduleInfo,
    isPending: isPending4,
    error: error4,
  } = useQuery({
    queryKey: ["fixedScheduleInfo", "step4", scheduleIdList],
    queryFn: async () => {
      const extractedIds = scheduleIdList
        ?.map((item) => item.scheduleId)
        .filter((id): id is string => !!id);

      if (!extractedIds || extractedIds.length === 0) return [];

      const result = await getScheduleIdPerFixedPromise({
        scheduleIdList: extractedIds,
      });

      return result.filter((schedule) => schedule.groupId === groupId) || [];
    },
    enabled: hasPromiseIds && !!scheduleIdList && scheduleIdList.length > 0,
    staleTime: 0,
    placeholderData: (prev) => prev,
  });
  const isFinalPending =
    isPending1 || (hasPromiseIds && (isPending2 || isPending3 || isPending4));
  // 최종 리턴 (useState 제거로 훨씬 깔끔해짐)
  return {
    fixedYetData: promiseInProgressData || [],
    fixedPromise: fixedScheduleInfo || [],
    isPending: isFinalPending, // 수정된 변수 사용
    error:
      error1?.message || error2?.message || error3?.message || error4?.message,
  };
};
