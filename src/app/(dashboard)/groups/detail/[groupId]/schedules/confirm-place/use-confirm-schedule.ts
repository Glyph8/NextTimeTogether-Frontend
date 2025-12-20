import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { getEncryptedPromiseMemberId } from "@/api/promise-view-create";
import { createSchedule } from "@/api/schedule-get-create";
import { ScheduleConfirmReqDTO } from "@/apis/generated/Api"; // DTO 타입 확인 필요
import { parseServerDateToScheduleId } from "./utils/date-format";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useState } from "react";

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

export const useConfirmSchedule = (promiseId: string, groupId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      const masterKey = await getMasterKey();
      if (!groupId) throw new Error("그룹 정보를 찾을 수 없습니다.");
      if (!memberData?.userIds)
        throw new Error("멤버 정보를 불러오는 중입니다.");
      if (!promiseId) throw new Error("약속 ID가 없습니다.");
      if (!masterKey) throw new Error("마스터 키를 불러오는 중입니다.");
      // 2. 데이터 변환 (Adapter 적용)
      const { scheduleId, timeStampInfo } = parseServerDateToScheduleId(
        serverResult.dateTime
      );

      const encTimeStamp = await encryptDataClient(
        scheduleId,
        masterKey,
        "promise_proxy_user"
      );

      const requestData: ScheduleConfirmReqDTO = {
        promiseId: promiseId,
        scheduleId: scheduleId, // "20251206T0900-20251206T1100"
        timeStampInfo: timeStampInfo, // "2025-12-06"
        placeId: placeId,
        title: serverResult.title,
        purpose: serverResult.purpose,
        userList: memberData.userIds,
        encTimeStamp: encTimeStamp, // 개인키로 암호화
      };
      console.log("🚀 [API 요청] 일정 확정:", { groupId, body: requestData });

      // 4. API 호출 (Path: /schedule/confirm/{groupId})
      const apiResult = await createSchedule(groupId, requestData);
      return { ...apiResult, scheduleId }; // scheduleId를 반환 객체에 포함
    },
    onSuccess: (data) => {
      console.log("✅ 일정 확정 완료:", data);
      // 관련 쿼리 무효화 후 결과 페이지 이동
      queryClient.invalidateQueries({ queryKey: ["promiseId"] });

      router.push(
        `/appointment/${data.scheduleId}/detail`
      );
    },
    onError: (error) => {
      console.error("❌ 일정 확정 실패:", error);
      toast.error("일정을 확정하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  return {
    confirmSchedule: mutation.mutate,
    isScheduleCreating: mutation.isPending,
  };
};
