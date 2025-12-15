import { useQuery } from '@tanstack/react-query';
import { getAllScheduleList, getScheduleListPerGroups, getTimeStampList, searchScheduleList, TimestampResDTO } from '@/api/appointment';
import { GetPromiseBatchReqDTO } from '@/apis/generated/Api';
import { getMasterKey } from '@/utils/client/key-storage';
import decryptDataWithCryptoKey from '@/utils/client/crypto/decryptClient';

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

export const useSchedules = ({ groupId, keyword, targetDates }: UseSchedulesProps) => {

  return useQuery({
    queryKey: ['schedules', { groupId, keyword }],
    queryFn: async () => {
      // 1. 검색어가 있을 경우 검색 API 호출
      if (keyword) {
        console.log("keyword 존재함", keyword);
        return await searchScheduleList(keyword);
      }

      const masterKey = await getMasterKey();
      if (!masterKey) {
        console.warn("개인키가 없어 복호화를 진행할 수 없습니다.");
        return { result: [] }; // 혹은 에러 처리
      }

      try {
        // 2. 타임스탬프(암호화된 스케줄 ID) 조회
        // props로 받은 날짜가 없으면 이번 달 전체 날짜를 생성해서 요청
        // console.log("groupId", groupId);
        // console.log("keyword", keyword);
        // console.log("targetDates", targetDates);
        const reqDates = targetDates || generateCurrentMonthDates();

        const apiResponse = await getTimeStampList({ dates: reqDates }) as any;

        const timeStampList = apiResponse?.timeStamps || [];

        if (!timeStampList || timeStampList.length === 0) {
          return { result: [] };
        }

        console.log("timeStampData", timeStampList);
        // 3. 병렬 복호화 수행 (Promise.all)
        // timestamp 값을 복호화하여 scheduleId 리스트로 변환
        const decryptedScheduleIds = await Promise.all(
          timeStampList.map(async (item: TimestampResDTO) => {
            try {
              return await decryptDataWithCryptoKey(item.timestamp, masterKey, "promise_proxy_user");
            } catch (e) {
              console.error(`Timestamp 복호화 실패 (${item.date}):`, e);
              return null;
            }
          })
        );

        // 복호화에 성공한 ID만 필터링
        // const validScheduleIds = decryptedScheduleIds.filter((id: string): id is string => id !== null);
        const validScheduleIds = decryptedScheduleIds;
        console.log("validScheduleIds", validScheduleIds);

        if (validScheduleIds.length === 0) {
          return { result: [] };
        }

        // 4. 복호화된 ID 리스트로 DTO 구성
        const batchReqData: GetPromiseBatchReqDTO = {
          scheduleIdList: validScheduleIds
        };

        // 5. 최종 일정 데이터 조회 API 호출
        if (groupId) {
          return await getScheduleListPerGroups(groupId, batchReqData);
        }

        return await getAllScheduleList(batchReqData) as any;

      } catch (error) {
        console.error("스케줄 로딩 체인 실패:", error);
        throw error;
      }
    },
    // 개인키가 준비되었을 때만 쿼리 실행 (enabled 옵션 활용 추천)
    // enabled: !!keyword,
    staleTime: 1000 * 60,
  });
};
