"use client";

import Header from "@/components/ui/header/Header";
import Link from "next/link";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";
import ArrowDown from "@/assets/svgs/icons/arrow-down-gray.svg";
import ArrowUp from "@/assets/svgs/icons/arrow-up-gray.svg";
import Plus from "@/assets/svgs/icons/plus-gray.svg";
import { GroupScheduleItem } from "./(components)/GroupScheduleItem";
import { GroupMemberItem } from "./(components)/GroupMemberItem";
import { useState } from "react";
import { GroupInviteDialog } from "./(components)/GroupInviteDialog";
import { useParams, useRouter } from "next/navigation";
import { useViewSchedules } from "./hooks/use-view-schedules";
import { useGroupDetail } from "./hooks/use-group-detail";
import { useGroupStore } from "@/store/group-detail.store";

export default function DetailGroupPage() {
  const router = useRouter();

  const [openOngoing, setOpenOngoing] = useState(true);
  const [openFixed, setOpenFixed] = useState(true);
  const [inviteModal, setInviteModal] = useState(false);
  // TODO: 추후 url query의 groupId도 암호화-복호화 필요
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const setGroup = useGroupStore((state) => state.setGroup);
  const { fixedYetData, fixedPromise, isPending } = useViewSchedules();

  // TODO : 약속 조회 말고, 해당 그룹 내부 정보만 따로 주는 API가 있는게..
  const {
    data: groupDetail,
    groupKey,
    isPending: isGroupFetching,
  } = useGroupDetail(groupId);

  const handleNavtoCreateSchedule = () => {
    if (groupDetail && groupKey) {
      setGroup(groupDetail, groupKey);
      router.push(`/schedules/create/${groupId}`);
    }
    alert("그룹 정보 혹은 그룹키 로딩에 실패");
  };

  if (isPending || isGroupFetching) {
    return <div>그룹 내 약속 정보 로딩중...</div>;
  }

  return (
    <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
      <Header
        leftChild={
          <Link href={"/groups"}>
            <ArrowLeft />
          </Link>
        }
        title={groupDetail?.groupName}
      />
      <div className="flex flex-col justify-center items-center gap-5 text-black-1 pt-7 pb-5">
        <div className="w-16 h-16 bg-amber-500 border-gray-1 rounded-[8px]" />
        <span className="text-gray-1 text-sm font-normal leading-tight">
          {/* TODO : 그룹 설명 내용 좀 필요.. */}
          {groupDetail?.groupName}
        </span>
      </div>

      <div className="flex flex-col px-4 gap-4 pb-3">
        <div className="flex justify-between">
          <div className="justify-start text-black-1 text-lg font-medium leading-tight px-1">
            내 약속
          </div>
          <button onClick={handleNavtoCreateSchedule}>
            <Plus />
          </button>
        </div>
        <div>
          <button
            className="flex justify-start items-center text-gray-1 text-sm font-medium leading-none px-1"
            onClick={() => setOpenOngoing(!openOngoing)}
          >
            {"약속 정하는 중"}
            {openOngoing ? <ArrowDown /> : <ArrowUp />}
          </button>

          {openOngoing && fixedYetData && fixedYetData.length > 0 ? (
            <div className="flex flex-col gap-2">
              {fixedYetData.map((onProgressPromise) => {
                const { promiseId, type, title, startDate, endDate } =
                  onProgressPromise;

                // TODO: startDate가 시간표로 확정한 시간이 와야되는 거 아닌가?
                // TODO : 장소 데이터가 없는 이유는 장소 확정되면 fixed되서 스케쥴이 되기 떄문?
                return (
                  <GroupScheduleItem
                    key={promiseId}
                    id={promiseId ?? ""}
                    category={type ?? ""}
                    title={title ?? ""}
                    time={`${startDate} ~ ${endDate}`}
                  />
                );
              })}
            </div>
          ) : openOngoing ? (
            <p className="text-center">정하고 있는 약속이 없어요!</p>
          ) : null}

          {/* {openOngoing && (                        
                            <GroupScheduleItem category={"스터디"} title={"내용 정하기"} time="10/12 (토)  09:00~12:00" attendees="온라인" />
                    )} */}
        </div>

        <div>
          <button
            className="flex justify-start items-center text-gray-1 text-sm font-medium leading-none px-1"
            onClick={() => setOpenFixed(!openFixed)}
          >
            약속 확정 완료
            {openFixed ? <ArrowDown /> : <ArrowUp />}
          </button>
          {openFixed && fixedPromise && fixedPromise.length > 0 ? (
            <div className="flex flex-col gap-2">
              {fixedPromise.map((schedule) => {
                const {scheduleId, purpose, title, content, placeId} = schedule
                return (
                  <GroupScheduleItem
                    key={scheduleId}
                    id={scheduleId ?? ""}
                    category={purpose ?? ""}
                    title={title ?? ""}
                    time={content}
                    // TODO : placeID로 주는 이유는? 이걸 어떻게 장소로 봄?
                    place={placeId?.toString()}
                    attendees={content}
                  />
                );
              })}
              {/* <GroupScheduleItem
                                category={"식사"}
                                title={"하기"}
                                time="10/12 (토) 09:00~12:00"
                                attendees="오프라인"
                                place="카페온더플랜"
                            /> */}
            </div>
          ) : openFixed ? (
            <p className="text-center">확정된 약속이 없어요!</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col px-4 gap-4 pb-7">
        <div className="flex justify-between px-1 py-2">
          <div className="flex gap-2 items-center">
            <div className="justify-start text-black-1 text-lg font-medium leading-tight">
              그룹원
            </div>
            <span className="text-gray-2 text-sm font-medium leading-tight">
              {groupDetail?.userIds.length} / 30
            </span>
          </div>
          <button onClick={() => setInviteModal(true)}>
            <Plus />
          </button>
        </div>
        <p>
          {/* TODO : managerId는 평문인가 아닌가, 무엇으로 암복호화되는가 */}
          {/* {
                   groupDetail?.managerId
                }
                </p>
                <p>
                {
                    groupDetail?.userIds
                } */}
        </p>
        <div className="flex p-4 bg-white gap-3 rounded-[20px]">
          {(groupDetail?.userIds ?? []).map((member) => (
            <GroupMemberItem
              key={member}
              name={member}
              marker={
                groupDetail?.managerId === member ? ["그룹장"] : undefined
              }
            />
          ))}
          {/* <GroupMemberItem marker={["사용자"]} name={"김나박이"} />
                    <GroupMemberItem marker={["그룹장"]} name={"가나다람바사아자차카파타하"} />
                    <GroupMemberItem marker={["사용자", "그룹장"]} name="둘다" />
                    <GroupMemberItem name={"먼데이"} /> */}
        </div>
      </div>
      <GroupInviteDialog
        isOpen={inviteModal}
        setIsOpen={setInviteModal}
        groupId={groupId ?? "error"}
      />
    </div>
  );
}
