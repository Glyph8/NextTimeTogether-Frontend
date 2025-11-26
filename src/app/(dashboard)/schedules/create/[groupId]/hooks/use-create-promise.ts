import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createPromise } from "@/api/promise-view-create";
import { convertToISO } from "../utils/date-converter";
import { useRouter } from "next/navigation";

export type PurposeType = "study" | "meal";

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
  const router = useRouter()

  // TODO : 임시 날짜 UI 데이터. 추후 디자인 확정 시 수정
  const now = new Date();
const defaultDateTime: DateTimeValue = {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    day: String(now.getDate()).padStart(2, "0"),
    ampm: now.getHours() >= 12 ? "오후" : "오전",
    hour: String(now.getHours() % 12 || 12).padStart(2, "0"),
    minute: "00", // 편의상 00분으로 시작
  };

  // 통합된 상태
  const [schedule, setSchedule] = useState<SchedulePeriod>({
    start: defaultDateTime,
    end: defaultDateTime, // 실제로는 1시간 뒤 등으로 설정하면 더 좋습니다.
  });

  const [topic, setTopic] = useState("");
  const [purpose, setPurpose] = useState<PurposeType>("study");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);


  // 멤버 선택 로직
  const isSelected = (userId: string) => selectedMembers.includes(userId);
  const handleMemberChange = (userId: string) => {
    if (isSelected(userId)) {
      setSelectedMembers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedMembers(prev => [...prev, userId]);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose(event.target.value as PurposeType);
  };

  const handleScheduleChange = (type: "start" | "end", newValue: DateTimeValue) => {
    setSchedule((prev) => ({
      ...prev,
      [type]: newValue,
    }));
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
      promiseImg: "default_image.png", // 이미지 처리가 안되어 있다면 기본값 혹은 빈값
      managerId: userId,
      startDate: startIso,
       endDate: endIso
    };

    console.log(
      promiseInfo
    )

    try {
      const createResult = await createPromise(promiseInfo);
      // 성공 처리 로직 (예: 페이지 이동)
      alert(`약속 생성 완료: ${createResult.promiseId}`);
      if(createResult.promiseId){
        router.push('schedules/detail') 
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 뷰에서 필요한 모든 것들을 하나의 객체로 리턴합니다.
  return {
    values: { topic, purpose, selectedMembers, schedule },
    actions: { 
      setTopic, 
      handleOptionChange, 
      handleMemberChange, 
      handleScheduleChange,
      submitPromise 
    },
    helpers: { isSelected }
  };
};