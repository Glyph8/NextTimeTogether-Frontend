import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getEncryptedPromiseMemberId } from "@/api/promise-view-create";
import { createSchedule } from "@/api/schedule-get-create";
import { ScheduleConfirmReqDTO } from "@/apis/generated/Api"; // DTO 타입 확인 필요
import { useGroupStore } from "@/store/group-detail.store";
import { parseServerDateToScheduleId } from "./utils/date-format";

// 장소 확정 API의 결과값 타입 정의
interface ServerConfirmResult {
  dateTime: string; // "2025-12-06T09:00:00-11:00:00"
  title: string;
  purpose: string;
  placeId: number;
}

interface ConfirmScheduleParams {
  placeId: number;
  serverResult: ServerConfirmResult;
}



export const useConfirmSchedule = (promiseId: string, groupId:string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // TODO : 나중에 useQuery 요청으로 대체 필요
  // const { selectedGroup } = useGroupStore();
  const searchParams = useSearchParams(); // [추가] URL에서 title 가져오기 위함
  // 현재 URL에 있는 title을 가져오거나, 없으면 기본값 사용
  const currentTitle = searchParams.get("title") ?? "약속 상세";

  // 사용자 리스트(userList)를 얻기 위한 쿼리
  const { data: memberData } = useQuery({
    queryKey: ["promiseId", "encPromiseIds", promiseId],
    queryFn: () => getEncryptedPromiseMemberId(promiseId),
    enabled: !!promiseId,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async ({ placeId, serverResult }: ConfirmScheduleParams) => {
      // 1. 유효성 검사 (Fail Fast)
      // const groupId = selectedGroup?.groupId;
      if (!groupId) throw new Error("그룹 정보를 찾을 수 없습니다.");
      if (!memberData?.userIds) throw new Error("멤버 정보를 불러오는 중입니다.");
      if (!promiseId) throw new Error("약속 ID가 없습니다.");

      // 2. 데이터 변환 (Adapter 적용)
      const { scheduleId, timeStampInfo } = parseServerDateToScheduleId(serverResult.dateTime);

      // 3. Request Body 구성 (Swagger 명세 기준)
      // 주의: Swagger에는 encTimeStamp, 표에는 encPromiseKey로 되어 있다면
      // 구현체인 Swagger 예시를 따르는 것이 보통 안전합니다.
      const requestData: ScheduleConfirmReqDTO = {
        promiseId: promiseId,
        scheduleId: scheduleId,          // "20251206T0900-20251206T1100"
        timeStampInfo: timeStampInfo,    // "2025-12-06"
        placeId: placeId,
        title: serverResult.title,
        purpose: serverResult.purpose,
        userList: memberData.userIds,
        encTimeStamp: "encrypted_dummy_value", // TODO: 실제 암호화 로직 적용
      };

      console.log("🚀 [API 요청] 일정 확정:", { groupId, body: requestData });

      // 4. API 호출 (Path: /schedule/confirm/{groupId})
      return await createSchedule(groupId, requestData);
    },
    onSuccess: (data) => {
      console.log("✅ 일정 확정 완료:", data);
      // 관련 쿼리 무효화 후 결과 페이지 이동
      queryClient.invalidateQueries({ queryKey: ["promise", promiseId] });
      const encodedTitle = encodeURIComponent(currentTitle);
      router.push(`/schedules/detail/${promiseId}?groupId=${groupId}&title=${encodedTitle}`);
    },
    onError: (error) => {
      console.error("❌ 일정 확정 실패:", error);
      alert("일정을 확정하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return {
    confirmSchedule: mutation.mutate,
    isScheduleCreating: mutation.isPending,
  };
};
// export const useConfirmSchedule = (promiseId: string) => {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const { confirmedDate, confirmedStartTime, confirmedEndTime } = useScheduleStore();
//   const { selectedGroup} = useGroupStore();
//   const { selectedPromise } = usePromiseStore();
//   const { data: memberData } = useQuery({
//     queryKey: ["promiseId", "encPromiseIds", promiseId],
//     queryFn: () => getEncryptedPromiseMemberId(promiseId),
//     enabled: !!promiseId,
//     staleTime: Infinity,
//   });

//   const mutation = useMutation({
//     mutationFn: async (placeId: number) => {
//       // 1. 유효성 검사
//       if (!promiseId || !placeId) throw new Error("필수 ID가 누락되었습니다.");
//       if (!confirmedDate || !confirmedStartTime || !confirmedEndTime) {
//         throw new Error("확정된 시간 정보가 없습니다.");
//       }
//       if (!memberData) throw new Error("약속 정보를 불러오는 중입니다.");

//       // 2. ID 생성
//       const scheduleId = generateScheduleId(confirmedDate, confirmedStartTime, confirmedEndTime);

//       // 3. 암호화 (실제 로직 적용 필요)
//       const encTimeStamp = "encrypted_dummy_value"; 
//       // const encPromiseKey = "encrypted_dummy_key";

//       // 4. DTO 구성 (API 명세서에 맞춤)
//       const requestData: ScheduleConfirmReqDTO = {
//         promiseId: promiseId,
//         scheduleId: scheduleId,
//         encTimeStamp: encTimeStamp,
//         timeStampInfo: confirmedDate, // 혹은 "2025-12-15" 형식
//         placeId: placeId,
//         title: "약속 제목", // 실제로는 memberData나 별도 Query에서 가져온 값
//         purpose: "약속 목적",
//         userList: memberData.userIds,
//       };

//       console.log("🚀 최종 요청 데이터:", requestData);

//       // [핵심 변경] 작성해주신 createSchedule API 호출
//       // 첫 번째 인자: groupId (여기선 promiseId), 두 번째 인자: DTO

//       const groupId = selectedGroup?.groupId;

//       // TODO : 일단 그룹 정보를, 처음 group/detail에 들어갔을 때 상태로 저장함 (추후 개선)
//       if(!groupId){
//         router.push("/groups")
//         throw new Error("그룹 아이디 정보를 잃어버렸습니다. 그룹 페이지로 돌아가주세요");
//       }

//       return await createSchedule(selectedGroup?.groupId, requestData);
//     },
//     onSuccess: (data) => {
//       console.log("✅ 일정 확정 성공:", data);
//       queryClient.invalidateQueries({ queryKey: ["promise", promiseId] });
//       router.push(`/schedules/${promiseId}/result`);
//     },
//     onError: (error) => {
//       console.error("❌ 훅 내부 에러 캐치:", error);
//       alert("일정을 확정하는 도중 오류가 발생했습니다.");
//     },
//   });

//   return {
//     confirm: mutation.mutate,
//     isLoading: mutation.isPending,
//     isReady: !!confirmedDate && !!confirmedStartTime && !!confirmedEndTime,
//   };
// };