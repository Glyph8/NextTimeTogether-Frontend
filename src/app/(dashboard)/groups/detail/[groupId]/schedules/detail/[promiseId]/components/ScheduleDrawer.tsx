import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/col-drawer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ParticipantCard } from "./ParticipantCard";
import { useCurrentUserId } from "@/lib/currentUser";
import { dispersePromise, exitPromise } from "@/api/promise-manage";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface Participant {
  userId: string;
  userName: string;
  userImg?: string | null;
}

interface ScheduleDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  managerId: string;
  isMaster?: boolean;
  participants: Participant[];
  promiseId: string;
  /** 약속 나가기에 필요. 멤버가 본인의 promiseKey 를 masterKey 로 암호화해 서버에 보낸다. */
  promiseKey?: string | null;
  /** 약속이 속한 그룹 ID. 처리 후 그룹 상세 페이지로 복귀 */
  groupId: string;
  onConfirmClick: () => void;
  onConfirmPlace: () => void;
}

export const ScheduleDrawer = ({
  open,
  setOpen,
  managerId,
  isMaster = false,
  participants,
  promiseId,
  promiseKey,
  groupId,
  onConfirmClick,
  onConfirmPlace,
}: ScheduleDrawerProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();

  const [confirmType, setConfirmType] = useState<"disperse" | "exit" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const closeAll = () => {
    setConfirmType(null);
    setOpen(false);
  };

  const navigateBackToGroup = () => {
    queryClient.invalidateQueries({ queryKey: ["promiseList"] });
    queryClient.invalidateQueries({ queryKey: ["promiseId"] });
    router.replace(`/groups/detail/${groupId}`);
  };

  const handleDisperse = async () => {
    if (!isMaster) return;
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const userIds = participants.map((p) => p.userId).filter(Boolean);
      await dispersePromise({ promiseId, userIds });
      toast.success("약속이 해산되었어요.");
      closeAll();
      navigateBackToGroup();
    } catch (error) {
      console.error("[ScheduleDrawer] 약속 해산 실패:", error);
      toast.error("약속 해산에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExit = async () => {
    if (isMaster) return;
    if (isProcessing) return;
    if (!promiseKey) {
      toast.error("약속 키를 찾을 수 없어요. 페이지를 새로고침 후 다시 시도해주세요.");
      return;
    }
    setIsProcessing(true);
    try {
      const masterKey = await getMasterKey();
      if (!masterKey) {
        throw new Error("마스터 키를 찾을 수 없습니다.");
      }
      const [encPromiseId, encPromiseKey] = await Promise.all([
        encryptDataClient(promiseId, masterKey, "promise_proxy_user"),
        encryptDataClient(promiseKey, masterKey, "promise_proxy_user"),
      ]);
      await exitPromise({ encPromiseId, encPromiseKey });
      toast.success("약속에서 나갔어요.");
      closeAll();
      navigateBackToGroup();
    } catch (error) {
      console.error("[ScheduleDrawer] 약속 나가기 실패:", error);
      toast.error("약속 나가기에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const requestConfirm = (type: "disperse" | "exit") => setConfirmType(type);

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

                <button className="w-full bg-gray-2 rounded-[8px] px-5 py-2.5 text-white"
                  onClick={onConfirmPlace}>
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
                name={participant.userName}
                isMaster={participant.userId === managerId}
                isCurrentUser={participant.userId === currentUserId}
              />
            ))}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="w-full text-center">
          {isMaster ? (
            <button
              type="button"
              className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight disabled:opacity-50"
              onClick={() => requestConfirm("disperse")}
              disabled={isProcessing}
            >
              약속 해산하기
            </button>
          ) : (
            <button
              type="button"
              className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight disabled:opacity-50"
              onClick={() => requestConfirm("exit")}
              disabled={isProcessing}
            >
              약속 나가기
            </button>
          )}
        </div>
      </DrawerContent>

      {/* 확인 다이얼로그 — 같은 컴포넌트 안에서 disperse/exit 분기 */}
      <Dialog open={confirmType !== null} onOpenChange={(open) => !open && setConfirmType(null)}>
        <DialogContent showCloseButton={false} className="w-full p-5 bg-white">
          <DialogTitle className="sr-only">
            {confirmType === "disperse" ? "약속 해산" : "약속 나가기"}
          </DialogTitle>
          <div className="flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
            <span className="text-lg font-medium leading-tight">
              {confirmType === "disperse"
                ? "약속을 해산하시겠어요?"
                : "약속에서 나가시겠어요?"}
            </span>
            <span className="text-sm font-normal leading-tight text-gray-2">
              한번&nbsp;
              {confirmType === "disperse" ? "해산하면" : "나가면"}&nbsp;
              <span className="text-main">다시 복구할 수 없어요!</span>
            </span>
          </div>
          <DialogFooter className="flex flex-row gap-3.5">
            <button
              type="button"
              className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px] disabled:opacity-50"
              onClick={() => setConfirmType(null)}
              disabled={isProcessing}
            >
              취소
            </button>
            <button
              type="button"
              className="w-full bg-main text-white px-5 py-2.5 rounded-[8px] disabled:opacity-50"
              onClick={() =>
                confirmType === "disperse" ? handleDisperse() : handleExit()
              }
              disabled={isProcessing}
            >
              {isProcessing
                ? "처리 중..."
                : confirmType === "disperse"
                  ? "해산"
                  : "나가기"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
};
