import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/col-drawer";
import { ParticipantCard } from "./ParticipantCard";
import { dummyMemberData } from "../when-components/types";

interface ScheduleDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMaster?: boolean;
  promiseId: string;
  onConfirmClick: () => void;
}

export const ScheduleDrawer = ({
  open,
  setOpen,
  isMaster = false,
  // promiseId,
  onConfirmClick,
}: ScheduleDrawerProps) => {
  const handleDisperse = () => {};
  const handleExit = () => {};

  // 더미 데이터에서 참여 인원 목록 가져오기
  const participants = dummyMemberData.result.userIds.map((userId) => ({
    userId,
    name: dummyMemberData.result.decryptedMapping[userId].name,
    isMaster: userId === "encUser1", // 첫 번째 사용자를 약속장으로 가정
  }));

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right" modal={true}>
      <DrawerContent className="flex flex-col justify-start w-[65%] max-h-[77vh] bg-[#EEF1F3] p-5 after:hidden">
        <DrawerDescription className="sr-only">
          약속 관리 메뉴입니다. 일시/장소 확정, 참여 인원 확인, 약속 해산/나가기
          기능을 사용할 수 있습니다.
        </DrawerDescription>

        {/* 상단 고정 영역 */}
        <div className="flex flex-col gap-5 flex-shrink-0">
          {isMaster && (
            <div className="flex flex-col gap-5 text-start justify-start text-black-1 text-lg font-medium leading-tight">
              일시 / 장소 확정
              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-white outline-1 outline-offset-[-1px] outline-gray-3 rounded-[8px] px-5 py-2.5 text-main"
                  onClick={onConfirmClick}
                >
                  일시 확정하기
                </button>
                <button className="w-full bg-gray-2 rounded-[8px] px-5 py-2.5 text-white">
                  장소 확정하기
                </button>
              </div>
            </div>
          )}

          <div className="text-start justify-start text-black-1 text-lg font-medium leading-tight">
            참여 인원
          </div>
        </div>

        {/* 스크롤 가능한 참여자 목록 */}
        <div className="flex-1 overflow-y-auto my-3">
          <DrawerTitle className="sr-only">참여 인원 목록</DrawerTitle>
          <div className="flex flex-col gap-3">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.userId}
                name={participant.name}
                isMaster={participant.isMaster}
              />
            ))}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="w-full text-center">
          {isMaster ? (
            <button
              className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight"
              onClick={handleDisperse}
            >
              약속 해산하기
            </button>
          ) : (
            <span
              className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight"
              onClick={handleExit}
            >
              약속 나가기
            </span>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
