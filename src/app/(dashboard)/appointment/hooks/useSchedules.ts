import { useQuery } from '@tanstack/react-query';
import { getAllScheduleList, getScheduleListPerGroups, getTimeStampList, searchScheduleList, TimestampResDTO } from '@/api/appointment';
import { GetPromiseBatchReqDTO } from '@/apis/generated/Api';
import { makePseudoId } from '@/utils/client/crypto/encryptClient';

const generateCurrentMonthDates = (): string[] => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `${year}-${String(month).padStart(2, '0')}-${day}`;
  });
};

interface UseSchedulesProps {
  groupId?: string | null;
  keyword?: string;
  targetDates?: string[];
}

// 반환할 객체의 타입 정의 (필요 시 수정하세요)
interface ProcessedScheduleResult {
  id: string;
  excludeFromBatch: boolean;
}

interface TimestampListResponse {
  timeStamps?: TimestampResDTO[];
}

/**
 * 처리된 timestamp 결과에서 유효한 schedule id만 추출하고 중복을 제거한다.
 */
const getUniqueValidScheduleIds = (
  scheduleItems: Array<ProcessedScheduleResult | null>
): string[] =>
  Array.from(
    new Set(
      scheduleItems
        .filter(
          (item): item is ProcessedScheduleResult =>
            !!item &&
            !item.excludeFromBatch &&
            typeof item.id === "string" &&
            item.id.length > 0
        )
        .map((item) => item.id)
    )
  );

/**
 * 타임스탬프 문자열을 분석하여 캘린더/일반 스케줄을 구분하고 ID를 추출하는 헬퍼 함수
 */
const processTimestampItem = async (timestamp: string): Promise<ProcessedScheduleResult> => {
  // UUID 형식인지 확인하는 정규표현식 (대소문자 무관)
  // 예: 87a3fed9-a427-404f-b0fd-6facd1664da7
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  // 1. UUID 패턴으로 시작하는 경우 (Calendar 케이스)
  // 예: "87a3fed9-a427-404f-b0fd-6facd1664da72025-12-09..."
  if (uuidRegex.test(timestamp)) {
    return {
      id: timestamp.substring(0, 36), // 앞의 36자리(UUID)만 잘라냄
      excludeFromBatch: true,
    };
  }

  // 2. 그 외의 경우 (암호화된 문자열 케이스)
  // 예: "GmdBg9o0lCaRuiJP53ACgWo..."
  else {
    // TODO : 약속장의 개인키로 암호화되는 문제로 일단 암호화안한 처리 TESTED
    console.log("TESTED 암호화된 스케줄 ", timestamp)
    // const decrypted = await decryptDataWithCryptoKey(
    //   timestamp,
    //   masterKey,
    //   "promise_proxy_user"
    // );
    return {
      id: timestamp,
      excludeFromBatch: false,
    };
  }
};

// --- 메인 로직 ---

export const useSchedules = ({ groupId, keyword, targetDates }: UseSchedulesProps) => {

  return useQuery({
    queryKey: ['schedules', { groupId, keyword, monthKey: targetDates?.[0] }],
    queryFn: async () => {
      const userId = localStorage.getItem("hashed_user_id_for_manager");
      const pseudoIdIndexKey = localStorage.getItem("pseudo_id_index_key") || userId;
      // const userId = useAuthStore.getState().userId;
      if (!userId) {
        console.warn("유저 ID가 없습니다.");
        return { result: [] };
      }
      if (!pseudoIdIndexKey) {
        console.warn("pseudo_id_index_key가 없습니다.");
        return { result: [] };
      }
      // 1. 검색어가 있을 경우 검색 API 호출
      if (keyword) {
        console.log("keyword 존재함", keyword);
        const pseudoId = await makePseudoId(userId, pseudoIdIndexKey);
        return await searchScheduleList(keyword, {
          pseudoId
        });
      }

      try {
        const reqDates = targetDates || generateCurrentMonthDates();

        const apiResponse = await getTimeStampList({
          dates: reqDates,
        }) as TimestampListResponse;

        const timeStampList = apiResponse?.timeStamps || [];

        if (!timeStampList || timeStampList.length === 0) {
          return { result: [] };
        }

        console.log("timeStampData", timeStampList);
        // 3. 병렬 복호화 수행 (Promise.all)
        // timestamp 값을 복호화하여 scheduleId 리스트로 변환
        // TODO : 약속장의 개인키로 암호화되는 문제로 일단 암호화안한 처리 TESTED
        const decryptedScheduleIds = await Promise.all(
          timeStampList.map(async (item: TimestampResDTO) => {
            try {
              // 별도로 분리한 헬퍼 함수 호출
              return await processTimestampItem(item.timestamp);
            } catch (e) {
              console.error(`Timestamp 처리 실패 (${item.date}):`, e);
              return null;
            }
          })
        );
        const validScheduleIds = getUniqueValidScheduleIds(decryptedScheduleIds);
        console.log("validScheduleIds", validScheduleIds);

        if (validScheduleIds.length === 0) {
          return { result: [] };
        }

        const data = {
          pseudoId: await makePseudoId(userId, pseudoIdIndexKey),
        };

        // 4. 복호화된 ID 리스트로 DTO 구성
        const batchReqData: GetPromiseBatchReqDTO = {
          scheduleIdList: validScheduleIds,
          pseudoId: data.pseudoId
        };

        // 5. 최종 일정 데이터 조회 API 호출
        if (groupId) {
          return await getScheduleListPerGroups(groupId, batchReqData);
        }

        return await getAllScheduleList(batchReqData);

      } catch (error) {
        console.error("스케줄 로딩 체인 실패:", error);
        throw error;
      }
    },
    // 개인키가 준비되었을 때만 쿼리 실행 (enabled 옵션 활용 추천)
    // enabled: !!keyword,
    staleTime: 1000 * 15,
    refetchInterval: keyword ? false : 1000 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev,

  });
};
