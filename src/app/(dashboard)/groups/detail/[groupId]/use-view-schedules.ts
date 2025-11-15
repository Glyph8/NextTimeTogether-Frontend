import {
  getEncPromiseIdList,
  getPromiseInProgress,
  getScheduleIdListPerPromise,
  getScheduleIdPerFixedPromise,
} from "@/api/promise-view-create";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export interface PromiseInfo {
  isConfirmed: boolean;
  promiseId: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  managerId: string;
  promiseImg: string;
}

export const useViewSchedules = () => {
  // 1단계 결과
  const [decryptedPromiseIdList, setDecryptedPromiseIdList] = useState<
    string[]
  >([]);

  // 2단계 결과
  const [promiseInProgressInfo, setPromiseInProgressInfo] = useState<
    PromiseInfo[] | null
  >(null);

  const [fixedPromiseInfo, setFixedPromiseInfo] = useState<
    PromiseInfo[] | null
  >(null);

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // 빈 배열 조기 종료 플래그
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);

  // 1단계 : 왜 파라미터가 없음..? 그룹 id 필요 없나?
  // promise/view1
  // --- 1단계: 암호화된 약속 리스트 조회 ---
  const {
    data: encPromiseIdList,
    isPending: isPending1,
    error: queryError1,
  } = useQuery({
    queryKey: ["promiseIdList", "step1", "encPromiseIds"],
    queryFn: async () => {
      console.log("🔵 [1단계] 암호화된 그룹 ID 조회 시작");
      const result = await getEncPromiseIdList();
      console.log("🔵 [1단계] 서버 응답:", result);
      if (!result || result.result === 0) {
        console.log("⚠️ [1단계] 데이터가 비어있음 - 조기 종료");
        return [];
      }
      return result.result;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 1단계 복호화 useEffect ---
  useEffect(() => {
    if (!encPromiseIdList) {
      console.log("⏸️ [1단계 복호화] 대기 중 -  encPromiseIdList가 없음");
      return;
    }
    // 빈 배열이면 조기 종료 플래그 설정하고 빈 배열로 처리
    if (encPromiseIdList.length === 0) {
      console.log("✅ [1단계 복호화] 빈 배열 감지 - 조기 종료 처리");
      setIsEmptyResult(true);
      setDecryptedPromiseIdList([]);
      return;
    }

    const decryptStep1Data = async () => {
      try {
        const masterKey = await getMasterKey();
        console.log("🟡 [1단계 복호화] 마스터키 로드 완료:", !!masterKey);

        if (!masterKey) {
          throw new Error("마스터키를 찾을 수 없습니다.");
        }

        const decryptedPromises = encPromiseIdList.map(
          async (item: string, index: number) => {
            const decryptedPromiseId = await decryptDataWithCryptoKey(
              item,
              masterKey,
              "group_proxy_user"
            );
            return decryptedPromiseId;
          }
        );

        const decrypted = await Promise.all(decryptedPromises);
        console.log("✅ [1단계 복호화] 전체 완료 - 결과:", decrypted);

        setDecryptedPromiseIdList(decrypted);
        setIsEmptyResult(false); // 정상 데이터가 있으면 플래그 해제
      } catch (err) {
        console.error("🔴 [1단계 복호화] 실패:", err);
        const errorMessage =
          err instanceof Error ? err.message : "1단계 복호화 오류";
        console.error("🔴 [1단계 복호화] 에러 메시지:", errorMessage);
        setError(errorMessage);
      }
    };

    decryptStep1Data();
  }, [encPromiseIdList]);

  // --- 2단계: 정하고 있는 약속 평문 데이터 조회 ---
  const {
    data: promiseInProgressData,
    isPending: isPending2,
    error: queryError2,
  } = useQuery({
    queryKey: [
      "promiseInProgressList",
      "step2",
      "plainPromiseInProgress",
      decryptedPromiseIdList,
    ],
    queryFn: async () => {
      console.log("🔵 [2단계] 암호화된 그룹 키 조회 시작");
      console.log("🔵 [2단계] 요청 데이터:", decryptedPromiseIdList);

      const result = await getPromiseInProgress({
        promiseIdList: decryptedPromiseIdList,
      });
      console.log("🔵 [2단계] 서버 응답:", result);

      if (!result.result) {
        console.error("🔴 [2단계] 에러:", result.message);
        throw new Error(result.message);
      }

      console.log("✅ [2단계] 성공 - 데이터 개수:", result.result.length);
      return result.result;
    },
    // 빈 배열이면 2단계 실행 안 함
    enabled:
      !isEmptyResult &&
      !!decryptedPromiseIdList &&
      decryptedPromiseIdList.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 2단계 성공 후 (복호화 필요 없음) useEffect ---
  useEffect(() => {
    // 빈 배열 조기 종료 상태면 스킵
    if (isEmptyResult) {
      console.log("⏸️ [2단계 복호화] 빈 배열 상태로 스킵");
      return;
    }

    if (!promiseInProgressData) {
      console.log("⏸️ [2단계 복호화] 대기 중 - encKeys가 없음");
      return;
    }

    if (promiseInProgressData.length === 0) {
      console.log("⏸️ [2단계 복호화] 데이터가 비어있음");
      setDecryptedPromiseIdList([]);
      return;
    }
    setPromiseInProgressInfo(promiseInProgressData);
  }, [isEmptyResult, promiseInProgressData]);

  // --- 3단계: 정하고 있는 약속 평문 데이터 조회 ---

  // TODO : 이건 어디서 튀어나온거임?
  const encPromiseKeyList = <string[]>[];

  const {
    data: scheduleIdList,
    isPending: isPending3,
    error: queryError3,
  } = useQuery({
    queryKey: [
      "scheduleIdList",
      "step3",
      "scheduleId",
      decryptedPromiseIdList, // 1단계 결과
      promiseInProgressInfo, // 2단계 결과
    ],
    queryFn: async () => {
      console.log("🔵 [3단계] 스케쥴 아이디 리스트 조회 시작");
      console.log("🔵 [3단계] 요청 데이터:", encPromiseKeyList);

      const result = await getScheduleIdListPerPromise({
        encPromiseKeyList: encPromiseKeyList,
      });
      console.log("🔵 [3단계] 서버 응답:", result);

      if (!result.result) {
        console.error("🔴 [3단계] 에러:", result.message);
        throw new Error(result.message);
      }

      console.log("✅ [3단계] 성공 - 데이터 개수:", result.result.length);
      return result.result;
    },
    // 빈 배열이면 3단계 실행 안 함
    enabled:
      !isEmptyResult &&
      !!decryptedPromiseIdList &&
      decryptedPromiseIdList.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // --- 4단계: 완료된 약속(스케쥴?) 평문 데이터 조회 ---
  const {
    data: fixedScheduleInfo,
    isPending: isPending4,
    error: queryError4,
  } = useQuery({
    queryKey: [
      "fixedScheduleInfo",
      "step4",
      decryptedPromiseIdList, // 1단계 결과
      promiseInProgressInfo, // 2단계 결과
      scheduleIdList, // 3단계 결과
    ],
    queryFn: async () => {
      console.log("🔵 [4단계] 확정 완료된 스케쥴 데이터 리스트 조회 시작");
      console.log("🔵 [4단계] 요청 데이터:", scheduleIdList);

      const result = await getScheduleIdPerFixedPromise({
        sheduleIdList: scheduleIdList,
      });
      console.log("🔵 [4단계] 서버 응답:", result);

      if (!result.result) {
        console.error("🔴 [4단계] 에러:", result.message);
        throw new Error(result.message);
      }

      console.log("✅ [4단계] 성공 - 데이터 개수:", result.result.length);
      setFixedPromiseInfo(fixedScheduleInfo);
      return result.result;
    },
    // 빈 배열이면 4단계 실행 안 함
    enabled:
      !isEmptyResult &&
      !!decryptedPromiseIdList &&
      decryptedPromiseIdList.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (queryError1) {
      console.error("🔴 [Query Error 1]:", queryError1);
      setError(queryError1.message);
    }
    if (queryError2) {
      console.error("🔴 [Query Error 2]:", queryError2);
      setError(queryError2.message);
    }
    if (queryError3) {
      console.error("🔴 [Query Error 3]:", queryError3);
      setError(queryError3.message);
    }
    if (queryError4) {
      console.error("🔴 [Query Error 4]:", queryError4);
      setError(queryError4.message);
    }
  }, [queryError1, queryError2, queryError3, queryError4]);

  // 빈 배열 조기 종료 케이스 처리
  return {
    fixedYetData: isEmptyResult ? [] : promiseInProgressInfo,
    fixedPromise: fixedPromiseInfo,
    isPending:
      isPending1 ||
      (isEmptyResult ? false : isPending2 || isPending3) ||
      isPending4,
    error:
      error ||
      queryError1?.message ||
      queryError2?.message ||
      queryError3?.message,
  };
};
