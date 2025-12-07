import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createPromise } from "@/api/promise-view-create";
import { convertToISO } from "../utils/date-converter";
import { invitePromiseService } from "../utils/join-promise";
import { useGroupStore } from "@/store/group-detail.store";

export type PurposeType = "스터디" | "식사";

export type DateTimeValue = {
  year: string;
  month: string;
  day: string;
  ampm: string;
  hour: string;
  minute: string;
};

export type SchedulePeriod = {
  start: DateTimeValue;
  end: DateTimeValue;
};

export const useCreatePromise = (groupId: string | undefined) => {
  // 현재 시간 기준 초기값 설정
  const now = new Date();
  const defaultDateTime: DateTimeValue = {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    day: String(now.getDate()).padStart(2, "0"),
    ampm: now.getHours() >= 12 ? "오후" : "오전",
    hour: String(now.getHours() % 12 || 12).padStart(2, "0"),
    minute: "00",
  };

  const [schedule, setSchedule] = useState<SchedulePeriod>({
    start: defaultDateTime,
    end: defaultDateTime,
  });

  const [topic, setTopic] = useState("");
  const [purpose, setPurpose] = useState<PurposeType>("스터디");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  // [Portfolio] 생성 완료 상태 관리 (즉시 리다이렉트 하지 않음)
  const [createdPromiseId, setCreatedPromiseId] = useState<string | null>(null);

  const { groupKey } = useGroupStore();

  const isSelected = (userId: string) => selectedMembers.includes(userId);
  
  const handleMemberChange = (userId: string) => {
    if (isSelected(userId)) {
      setSelectedMembers((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedMembers((prev) => [...prev, userId]);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose(event.target.value as PurposeType);
  };

  const handleScheduleChange = (type: "start" | "end", newValue: DateTimeValue) => {
    setSchedule((prev) => ({ ...prev, [type]: newValue }));
  };

  const submitPromise = async () => {
    const userId = useAuthStore.getState().userId;
    if (!userId || !groupId) return;

    const startIso = convertToISO(schedule.start);
    const endIso = convertToISO(schedule.end);

    const promiseInfo = {
      groupId,
      title: topic,
      type: purpose,
      promiseImg: "default_image.png",
      managerId: userId,
      startDate: startIso,
      endDate: endIso,
    };

    try {
      // 1. 약속 생성 API 호출
      const createResult = await createPromise(promiseInfo);
      
      if (createResult.promiseId) {
        // 2. 생성자(나)를 약속에 자동 참여시킴 (초대 로직 재사용)
        const joinResult = await invitePromiseService(
          userId,
          createResult.promiseId,
          groupKey
        );
        
        if (joinResult) {
          // 3. 페이지 이동 대신, 생성된 ID를 상태에 저장 -> 공유 화면 표출 트리거
          setCreatedPromiseId(createResult.promiseId);
        }
      }
    } catch (e) {
      console.error(e);
      alert("약속 생성 중 오류가 발생했습니다.");
    }
  };

  return {
    values: { topic, purpose, selectedMembers, schedule, createdPromiseId },
    actions: {
      setTopic,
      handleOptionChange,
      handleMemberChange,
      handleScheduleChange,
      submitPromise,
    },
    helpers: { isSelected },
  };
};