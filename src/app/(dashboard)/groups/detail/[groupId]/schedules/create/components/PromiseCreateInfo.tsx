import React from "react";
import { useCreatePromise } from "../hooks/use-create-promise";
import { GroupMemberItem } from "@/app/(dashboard)/groups/detail/[groupId]/(components)/GroupMemberItem";
import { DecryptedGroupInfo } from "@/app/(dashboard)/groups/use-group-list";
import XWhite from "@/assets/svgs/icons/x-white.svg";

interface CreatePromiseFormProps {
  // 훅의 리턴값을 통째로 받거나, 필요한 데이터만 정의
  form: ReturnType<typeof useCreatePromise>;
  groupData: DecryptedGroupInfo; // 실제 그룹 데이터 타입으로 변경 필요
}

export default function PromiseCreateInfo({
  form,
  groupData,
}: CreatePromiseFormProps) {
  const { values, actions, helpers } = form;

  return (
    <>
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
            onChange={(e) => actions.setTopic(e.target.value)}
            value={values.topic}
          />
          {values.topic !== "" && (
            <button
              className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
              onClick={() => actions.setTopic("")}
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
            {values.selectedMembers.length} / {groupData.userIds.length}
          </span>
        </div>

        {/* 멤버 선택 (복잡한 로직 없이 맵핑만 수행) */}
        <div className="flex p-4 bg-[#F9F9F9] gap-3 rounded-[20px]">
          {groupData?.userIds.map((member: string) => (
            <GroupMemberItem
              key={member}
              name={member}
              selectable={true}
              isSelected={helpers.isSelected(member)}
              onClick={() => actions.handleMemberChange(member)}
              marker={groupData?.managerId === member ? ["그룹장"] : undefined}
            />
          ))}
        </div>
      </div>

      <div className="py-4">
        <div className="text-gray-2 text-sm font-normal leading-tight mb-3">
          목적
        </div>
        <div className="flex gap-6">
          {/* 스터디 옵션 */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="purpose"
              value="스터디"
              checked={values.purpose === "스터디"}
              onChange={actions.handleOptionChange}
              className="w-5 h-5 accent-main cursor-pointer"
            />
            <span className={`text-base font-normal leading-tight ${values.purpose === "스터디" ? "text-black-1" : "text-gray-400"}`}>
              스터디
            </span>
          </label>

          {/* 식사 옵션 */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="purpose"
              value="식사"
              checked={values.purpose === "식사"}
              onChange={actions.handleOptionChange}
              className="w-5 h-5 accent-main cursor-pointer"
            />
            <span className={`text-base font-normal leading-tight ${values.purpose === "식사" ? "text-black-1" : "text-gray-400"}`}>
              식사
            </span>
          </label>
        </div>
      </div>
    </>
  );
}
