import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createPromise } from "@/api/promise-view-create";
import { convertToISO } from "../utils/date-converter";
import { invitePromiseService } from "../utils/join-promise";
import { useGroupStore } from "@/store/group-detail.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import testGenerateKey from "@/utils/crypto/generate-key/key-generator";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createdPromiseId = searchParams.get("newPromiseId");
  const urlStoredKey = searchParams.get("createdKey"); // [추가] URL에서 키 복구

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
  
  const [generatedPromiseKey, setGeneratedPromiseKey] = useState<string | null>(urlStoredKey);
  const { groupKey } = useGroupStore();

  useEffect(() => {
    if (urlStoredKey) {
      setGeneratedPromiseKey(urlStoredKey);
    }
  }, [urlStoredKey]);
  

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
    const decryptedUserId = localStorage.getItem("hashed_user_id_for_manager");

    if (!userId || !groupId || !decryptedUserId) return;

    const startIso = convertToISO(schedule.start);
    const endIso = convertToISO(schedule.end);

    const promiseInfo = {
      groupId,
      title: topic,
      type: purpose,
      promiseImg: "default_image.png",
      // managerId: userId,
      managerId: decryptedUserId,
      startDate: startIso,
      endDate: endIso,
    };

    try {
      // promiseKey 생성
      const newPromiseKey = await testGenerateKey();
      // 1. 약속 생성 API 호출
      const createResult = await createPromise(promiseInfo);
      
      if (createResult.promiseId) {
        // 2. 생성자(나)를 약속에 자동 참여시킴 (초대 로직 재사용)
        // TODO : userID(사용자가 입력한 값)냐.. manager처럼 원본 userID(서버에 전달된 값)냐..

        await invitePromiseService(
          userId,
          // TODO : 이걸로 하면 에러 응답 옴..  하지만 제대로 참여는 됨???
          // decryptedUserId, 
          createResult.promiseId,
          groupKey, // groupKey는 null일 수 있으므로 체크 필요
          newPromiseKey // <--- 생성한 키 전달
        );
   
    
        setGeneratedPromiseKey(newPromiseKey);

        const params = new URLSearchParams(searchParams);
        params.set("newPromiseId", createResult.promiseId);
        router.replace(`${pathname}?${params.toString()}`);
      }
    } catch (e) {
      console.error(e);
      alert("약속 생성 중 오류가 발생했습니다.");
    }
  };

  return {
    values: { topic, purpose, selectedMembers, schedule, createdPromiseId, generatedPromiseKey },
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