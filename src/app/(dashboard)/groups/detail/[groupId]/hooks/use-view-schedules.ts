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
import { useEffect, useState } from "react";

export const useViewSchedules = () => {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  // 1단계 결과 (복호화된 ID 리스트)
  const [decryptedPromiseIdList, setDecryptedPromiseIdList] = useState<
    string[]
  >([]);

  // 빈 배열(약속 없음) 조기 종료 플래그
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // --- 1단계: 암호화된 약속 리스트 조회 ---
  const {
    data: encPromiseIdList,
    isPending: isPending1,
    error: queryError1,
  } = useQuery({
    queryKey: ["promiseIdList", "step1", "encPromiseIds"],
    queryFn: async () => {
      console.log("🔵 [1단계] 암호화된 약속 ID 조회 시작");
      const result = await getEncPromiseIdList();
      // null이나 undefined가 오면 빈 배열로 처리
      return result || [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 1단계 복호화 로직 (useEffect) ---
  useEffect(() => {
    // 1. 데이터가 아직 안 왔으면 대기
    if (!encPromiseIdList) return;

    // 2. 데이터가 왔는데 빈 배열이면 -> 약속이 없는 그룹임 -> 조기 종료
    if (encPromiseIdList.length === 0) {
      console.log("✅ [1단계] 빈 배열 감지 - 조기 종료 처리");
      setIsEmptyResult(true);
      setDecryptedPromiseIdList([]);
      return;
    }

    // 3. 데이터가 있으면 복호화 시작
    const decryptStep1Data = async () => {
      try {
        const masterKey = await getMasterKey();
        if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

        const decryptedPromises = await Promise.all(
          encPromiseIdList.map(async (item) => {
            if (!item.encPromiseId)
              throw new Error("유효하지 않은 약속 ID입니다.");
            return await decryptDataWithCryptoKey(
              item.encPromiseId,
              masterKey,
              "group_proxy_user"
            );
          })
        );

        console.log("✅ [1단계 복호화] 완료:", decryptedPromises);
        setDecryptedPromiseIdList(decryptedPromises);
        setIsEmptyResult(false); // 데이터가 있으므로 플래그 false
      } catch (err: unknown) {
        console.error("🔴 [1단계 복호화] 실패:", err);
        setError("1단계 복호화 실패");
        // pending 중지하도록 처리 추가
        setIsEmptyResult(true);
        setDecryptedPromiseIdList([]);
      }
    };

    decryptStep1Data();
  }, [encPromiseIdList]);

  // ✅ 다음 단계 실행 조건: "빈 결과가 아님" AND "복호화된 ID가 있음"
  const isStep1Finished = !isEmptyResult && decryptedPromiseIdList.length > 0;

  // --- 2단계: 진행 중인 약속 조회 ---
  const {
    data: promiseInProgressData, // useState 대신 이 data를 바로 리턴합니다.
    isPending: isPending2,
    error: queryError2,
  } = useQuery({
    queryKey: ["promiseInProgressList", "step2", decryptedPromiseIdList],
    queryFn: async () => {
      console.log("🔵 [2단계] 진행 중인 약속 조회 시작");
      const result = await getPromiseInProgress({
        groupId: groupId,
        promiseIdList: decryptedPromiseIdList,
      });
      return result || [];
    },
    enabled: isStep1Finished, // 1단계가 확실히 끝났을 때만 실행
    staleTime: 1000 * 60 * 5,
  });

  // --- 3단계: 스케줄 ID 조회 ---
  const {
    data: scheduleIdList,
    isPending: isPending3,
    error: queryError3,
  } = useQuery({
    queryKey: ["scheduleIdList", "step3", decryptedPromiseIdList],
    queryFn: async () => {
      console.log("🔵 [3단계] 스케쥴 ID 리스트 조회");
      const result = await getScheduleIdListPerPromise({
        promiseIdList: decryptedPromiseIdList,
      });
      return result || [];
    },
    // encPromiseKeyList가 비어있으면 실행 안 함 (필요시 조건 수정)
    enabled: isStep1Finished && decryptedPromiseIdList.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // --- 4단계: 확정된 약속 조회 ---
  const {
    data: fixedScheduleInfo, // useState 대신 이 data를 바로 리턴합니다.
    isPending: isPending4,
    error: queryError4,
  } = useQuery({
    queryKey: ["fixedScheduleInfo", "step4", scheduleIdList],
    queryFn: async () => {
      console.log("🔵 [4단계] 확정된 스케쥴 조회");

      // 3단계 결과에서 ID만 추출 (매핑)
      const extractedIds = scheduleIdList
        ?.map((item) => item.scheduleId)
        .filter((id): id is string => !!id); // undefined 제거

      if (!extractedIds || extractedIds.length === 0) return [];

      const result = await getScheduleIdPerFixedPromise({
        scheduleIdList: extractedIds,
      });
      return result || [];
    },
    // 1단계 완료 && 3단계 결과(스케줄ID)가 있어야 실행
    enabled: isStep1Finished && !!scheduleIdList && scheduleIdList.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // --- 최종 리턴 ---
  return {
    // 1. 데이터: 상태(State)가 아니라 쿼리 결과(Data)를 바로 내보냅니다.
    fixedYetData: isEmptyResult ? [] : promiseInProgressData || [],
    fixedPromise: isEmptyResult ? [] : fixedScheduleInfo || [],

    // 2. 로딩 상태: 빈 결과(isEmptyResult)라면 뒤쪽 로딩은 무시합니다. (무한 로딩 해결)
    isPending:
      isPending1 ||
      // 데이터는 왔는데 아직 복호화 중인 찰나의 순간 처리
      (!isEmptyResult &&
        encPromiseIdList &&
        decryptedPromiseIdList.length === 0) ||
      // 1단계 결과가 비어있지 않다면, 2,3,4단계 로딩 상태를 반영
      (!isEmptyResult && (isPending2 || isPending3 || isPending4)),

    // 3. 에러 통합
    error:
      error ||
      queryError1?.message ||
      queryError2?.message ||
      queryError3?.message ||
      queryError4?.message,
  };
};
