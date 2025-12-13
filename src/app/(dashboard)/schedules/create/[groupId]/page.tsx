"use client";

import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { useGroupStore } from "@/store/group-detail.store";
import { useGroupDetail } from "../../../groups/detail/[groupId]/hooks/use-group-detail";
import PromiseCreateInfo from "./components/PromiseCreateInfo";
import { useCreatePromise } from "./hooks/use-create-promise";
import SelectSchedule from "./components/SelectTimeOnline";
import { YesNoDialog } from "@/components/shared/Dialog/YesNoDialog";
import { PromiseSummary } from "./components/PromiseSummary";
import SharePromise from "./components/SharePromise"; // 새로 만든 컴포넌트 import

export default function CreateSchedulePage() {
  const params = useParams<{ groupId: string }>();
  const groupIdFromUrl = params.groupId;
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedGroup, setGroup } = useGroupStore();
  const targetIdForFetch =
    selectedGroup?.groupId === groupIdFromUrl ? null : groupIdFromUrl;

  // 그룹 정보 및 키 로드
  const {
    data: fetchedGroup,
    groupKey,
    isPending,
    error,
  } = useGroupDetail(targetIdForFetch);

  const promiseForm = useCreatePromise(groupIdFromUrl);
  const { values, actions } = promiseForm;

  // TODO : 매니저용 임시 해시된 id (회원가입 시 사용되어 서버에 전달된 masterkey로 암호화된 아이디)
  // const userId = useAuthStore.getState().userId;
  // const decryptedUserId = localStorage.getItem("encrypted_user_id");
  // const hashed = localStorage.getItem("hashed_user_id_for_manager");

  useEffect(() => {
    if (fetchedGroup && groupKey) {
      setGroup(fetchedGroup, groupKey);
    }
  }, [fetchedGroup, groupKey, setGroup]);

  // [Flow Control] 약속 생성 성공 시 공유 화면 렌더링
  if (values.createdPromiseId && groupIdFromUrl) {
    return (
      <div className="bg-white h-dvh flex flex-col">
        {/* 헤더의 닫기 버튼도 상세 페이지로 이동하도록 수정 */}
        <Header
          leftChild={
            <button
              onClick={() =>
                router.push(`/schedules/detail/${values.createdPromiseId}`)
              }
            >
              <X />
            </button>
          }
          title="초대하기"
        />
        <div className="flex-1 px-4">
          <SharePromise
            promiseId={values.createdPromiseId}
            groupId={groupIdFromUrl}
            promiseKey={values.generatedPromiseKey}
            // [수정] 닫기(확인) 버튼 클릭 시 해당 약속의 상세 페이지로 이동
            onClose={() => {
              // 확인 버튼 누르면 상세 페이지로 이동 (키를 Hash에 포함)
              // SharePromise 내부에서 이동하거나, 여기서 router.push 처리
              const encodedKey = encodeURIComponent(
                values.generatedPromiseKey || ""
              );
              router.push(
                `/groups/detail/${groupIdFromUrl}/schedules/${values.createdPromiseId}#pkey=${encodedKey}`
              );
            }}
          />
        </div>
      </div>
    );
  }

  const isStep1 = progress === 1;
  const activeGroup = selectedGroup || fetchedGroup;

  if (activeGroup) {
    return (
      <div className="bg-white h-dvh flex flex-col">
        {/* TODO : 글자 길어지는 경우 모달 삐져나옴 문제 존재. */}
        <YesNoDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
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
          extraHandleReject={() => setIsOpen(false)}
          extraHandleAccept={actions.submitPromise}
        />

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

        {/* 진행률 바 */}
        <div className="w-full h-16 py-7 relative px-4">
          <div className="w-full h-2 bg-gray-3 rounded-[20px] z-1" />
          <div
            className="h-2 bg-main rounded-[20px] transition-all duration-300 z-10 relative bottom-2"
            style={{ width: `${(progress / 2) * 100}%` }}
          />
        </div>

        <div className="flex flex-col flex-1 px-4 overflow-y-auto">
          {isStep1 ? (
            <PromiseCreateInfo form={promiseForm} groupData={activeGroup} />
          ) : (
            <SelectSchedule
              schedule={values.schedule}
              onScheduleChange={actions.handleScheduleChange}
            />
          )}
        </div>

        <div className="pt-4 pb-8 px-4 w-full flex justify-center">
          <Button
            text={isStep1 ? "다음" : "약속 만들기"}
            disabled={values.topic === ""} // 간단한 유효성 검사 예시
            onClick={() => {
              if (isStep1) {
                setProgress(2);
              } else {
                setIsOpen(true);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // 로딩 및 에러 처리
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main" />
        <p className="text-gray-500 font-medium">
          보안 데이터를 복호화하고 있습니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 px-4 text-center">
        {error}
      </div>
    );
  }

  return null;
}
