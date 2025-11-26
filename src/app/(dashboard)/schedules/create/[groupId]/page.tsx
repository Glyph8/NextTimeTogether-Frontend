"use client";

import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { useGroupStore } from "@/store/group-detail.store";
import { useGroupDetail } from "../../../groups/detail/[groupId]/hooks/use-group-detail";
import PromiseCreateInfo from "./components/PromiseCreateInfo";
import { useCreatePromise } from "./hooks/use-create-promise";
import SelectSchedule from "./components/SelectTimeOnline";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { PromiseSummary } from "./components/PromiseSummary";

export default function CreateSchedulePage() {
  const params = useParams<{ groupId: string }>();
  const groupIdFromUrl = params.groupId;
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  // 약속 생성 1단계 - 암호화된 그룹 아이디 제공 ➡️ 이중암호화된 멤버 아이디 획득
  // 약속 생성 2단계 - 암호화된 그룹 아이디, 암호화된 멤버 아이디 제공 ➡️ 암호화된 그룹 키 획득
  // 약속 생성 3단계 - 평문 그룹 아이디 제공 ➡️ 평문 그룹 아이디, 평문 그룹 이름, 그룹 이미지, 그룹장 아이디, 암호화된 멤버 아이디 획득
  // TODO : 어차피 데이터 스토어에 그룹 정보가 있으니, 3단계는 생략 가능하지 않을까?

  // 약속 생성 4단계 - 평문 그룹 아이디, 약속 제목, 약속 타입, 약속 이미지, 약속장 아이디, 시작과 종료 날짜
  const { selectedGroup, setGroup } = useGroupStore();
  // 메모리에 데이터가 이미 있다면(selectedGroup 존재), 훅에 null을 넘겨 요청을 원천 차단합니다.
  // 메모리에 데이터가 없다면(새로고침 등), URL의 groupId를 넘겨 3-step 요청을 시작합니다.
  const targetIdForFetch =
    selectedGroup?.groupId === groupIdFromUrl ? null : groupIdFromUrl;

  const {
    data: fetchedGroup,
    isPending,
    error,
  } = useGroupDetail(targetIdForFetch);
  const promiseForm = useCreatePromise(groupIdFromUrl);
  const { values, actions } = promiseForm;
  // 4. 새로고침으로 데이터를 다시 가져왔다면, 스토어 동기화 (선택사항, 추후 이동 대비)
  useEffect(() => {
    if (fetchedGroup) {
      setGroup(fetchedGroup);
    }
    console.log(fetchedGroup);
  }, [fetchedGroup, setGroup]);

  const isStep1 = progress === 1;

  // 그룹 정보 획득한 경우
  const activeGroup = selectedGroup || fetchedGroup;

  if (activeGroup) {
    return (
      <div className="bg-white h-dvh flex flex-col">
        <YesNoDialog isOpen={isOpen} setIsOpen={setIsOpen} 
        title={
          <PromiseSummary
              topic={values.topic}
              purpose={values.purpose}
              schedule={values.schedule}
              members={activeGroup.userIds}
              selectedMemberIds={values.selectedMembers}
            />
        } 
        acceptedTitle={"약속을 성공적으로 만들었어요."} 
        rejectText={"취소"} 
        acceptText={"만들기"} 
        extraHandleReject={()=>setIsOpen(false)} 
        extraHandleAccept={actions.submitPromise}/>
        <Header
          leftChild={
            isStep1 ? (
              <button onClick={() => router.back()}>
                <X />
              </button>
            ) : (
              <button onClick={() => setProgress(1)}>
                <LeftArrow />
              </button>
            )
          }
          title={"약속 만들기"}
        />
        <div className="w-full h-16 py-7 relative px-4">
          <div className="w-full h-2 bg-gray-3 rounded-[20px] z-1" />
          <div
            className="h-2 bg-main rounded-[20px] transition-all duration-300 z-10 relative bottom-2"
            style={{
              width: `${(progress / 2) * 100}%`,
            }}
          />
        </div>

        <div className="flex flex-col flex-1 px-4">
          {isStep1 ? (
            <PromiseCreateInfo form={promiseForm} groupData={activeGroup} />
          ) : (
            <SelectSchedule 
           schedule={values.schedule}
           onScheduleChange={actions.handleScheduleChange}
        />
          )}
        </div>
        <div className="pt-11 pb-5 px-4 w-full flex justify-center">
          <Button
            text={isStep1 ? "다음" : "약속 만들기"}
            disabled={false}
            onClick={() => {
              if (isStep1) {
                setProgress(2);
              }
              else{
                setIsOpen(true)
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-gray-500">보안 데이터를 복호화하고 있습니다...</p>
        <p className="text-xs text-gray-400">(약 3~5초 소요될 수 있습니다)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
}
