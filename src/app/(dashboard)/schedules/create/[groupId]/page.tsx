"use client";

import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg";
import XWhite from "@/assets/svgs/icons/x-white.svg";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GroupMemberItem } from "../../../groups/detail/[groupId]/(components)/GroupMemberItem";
import { Button } from "@/components/ui/button/Button";
import { RadioButton } from "@/components/shared/Input/RadioButton";
import { useGroupStore } from "@/store/group-detail.store";
import { useGroupDetail } from "../../../groups/detail/[groupId]/hooks/use-group-detail";
import { createPromise } from "@/api/promise-view-create";
import { useAuthStore } from "@/store/auth.store";

type PurposeType = "study" | "meal";

export default function CreateSchedulePage() {
  const params = useParams<{ groupId: string }>();
  const groupIdFromUrl = params.groupId;
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [topic, setTopic] = useState("");
  const [purpose, setPurpose] = useState<PurposeType>("study");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

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

  // 4. 새로고침으로 데이터를 다시 가져왔다면, 스토어 동기화 (선택사항, 추후 이동 대비)
  useEffect(() => {
    if (fetchedGroup) {
      setGroup(fetchedGroup);
    }
    console.log(fetchedGroup);
  }, [fetchedGroup, setGroup]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("선택된 값:", event.target.value);
    setPurpose(event.target.value as PurposeType);
  };
  const isSelected = (userId: string) => selectedMembers.includes(userId);
  const handleMemberChange = (userId: string) => {
    if (isSelected(userId)) {
      setSelectedMembers(
        selectedMembers.filter((memberId) => memberId !== userId)
      );
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreatePromise = async () => {
    const userId = useAuthStore.getState().userId;
    if(!userId){
      console.log("약속 생성 중 사용자의 아이디를 불러오는데 실패했습니다")
      return;
    }
    // TODO : 일단 약속장은 생성한 사람이 되도록 처리
    const promiseInfo = {
      groupId: groupIdFromUrl,
      title: topic,
      type: purpose,
      promiseImg: "이미지",
      managerId: userId,
      // startDate: "123",
      // endDate: "123",
    };
    const createResult = await createPromise(promiseInfo)
    alert(createResult.promiseId);
  };

  // 그룹 정보 획득한 경우
  const activeGroup = selectedGroup || fetchedGroup;

  if (activeGroup) {
    return (
      <div className="bg-white">
        <Header
          leftChild={
            <button onClick={() => router.back()}>
              <X />
            </button>
          }
          title={"약속 만들기"}
        />
        <div className="w-full px-4">
          <div className="w-full h-16 py-7 relative">
            <div
              className="h-2 bg-main rounded-[20px] transition-all duration-300 z-10 absolute"
              style={{
                width: `${(progress / 6) * 100}%`,
              }}
            />
            <div className="w-full h-2 bg-gray-3 rounded-[20px] z-1" />
          </div>



          <nav className="text-black-1 text-xl font-medium leading-loose">
            약속 정보를 입력해주세요.
          </nav>

          <div className="py-4">
            <span className="text-gray-1 text-sm font-normal leading-tight">
              주제
            </span>
            <div className="w-full flex justify-between relative">
              <input
                placeholder="약속 이름을 입력해주세요."
                className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main"
                onChange={(e) => setTopic(e.target.value)}
                value={topic}
              />
              {topic !== "" && (
                <button
                  className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                  onClick={() => setTopic("")}
                >
                  <XWhite />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-between py-2 gap-2 items-center text-gray-2 text-sm font-medium leading-tight">
              <div>참여 그룹원</div>
              <span>
                {selectedMembers.length} / {selectedGroup?.userIds.length}
              </span>
            </div>

            <div className="flex p-4 bg-[#F9F9F9] gap-3 rounded-[20px]">
              {selectedGroup?.userIds.map((member) => (
                <GroupMemberItem
                  key={member}
                  name={member}
                  selectable={true}
                  isSelected={isSelected(member)}
                  onClick={() => handleMemberChange(member)}
                  marker={
                    fetchedGroup?.managerId === member ? ["그룹장"] : undefined
                  }
                />
              ))}
            </div>
          </div>

          <div className="py-4">
            <span className="text-gray-1 text-sm font-normal leading-tight">
              목적
            </span>
            <div className="flex gap-3">
              <RadioButton
                id="study"
                name="purpose"
                value="study"
                label="스터디"
                checked={purpose === "study"}
                handleChange={handleOptionChange}
              />
              <RadioButton
                id="meal"
                name="purpose"
                value="meal"
                label="식사"
                checked={purpose === "meal"}
                handleChange={handleOptionChange}
              />
            </div>
          </div>
          <div className="pt-11 pb-5">
            <Button
              text={"다음"}
              disabled={false}
              onClick={() => {
                // setProgress(2);
                handleCreatePromise()
              }}
            />
          </div>
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
