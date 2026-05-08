import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { leaveGroupFlow } from "@/api/group-invite-join";
import { getMasterKey } from "@/utils/client/key-storage";
import toast from "react-hot-toast";

interface ExitGroupDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 나가려는 그룹 정보. 호출 측이 선택된 그룹을 명시적으로 넘긴다. */
  groupId: string;
  groupName: string;
}

export const ExitGroupDialog = ({
  isOpen,
  setIsOpen,
  groupId,
  groupName,
}: ExitGroupDialogProps) => {
  const queryClient = useQueryClient();
  const [isExited, setIsExited] = useState(false);
  const [wasManager, setWasManager] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
    // 완료 화면 상태는 다이얼로그가 닫힌 직후 살짝 늦게 초기화 (UX flash 방지)
    setTimeout(() => {
      setIsExited(false);
      setWasManager(false);
    }, 200);
  };

  const handleExit = async () => {
    if (isProcessing) return;
    if (!groupId) {
      toast.error("그룹 정보가 없어요.");
      return;
    }
    setIsProcessing(true);
    try {
      const masterKey = await getMasterKey();
      if (!masterKey) {
        throw new Error("마스터 키를 찾을 수 없습니다.");
      }
      const { isManager } = await leaveGroupFlow(groupId, masterKey);
      setWasManager(isManager);
      setIsExited(true);
      // 그룹 목록·상세 캐시 무효화 → 재진입 시 최신 데이터
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetail"] });
    } catch (error) {
      console.error("[ExitGroupDialog] 그룹 나가기 실패:", error);
      toast.error("그룹 나가기에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => closeDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="sr-only">그룹에서 나가기</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-5 bg-white"
      >
        {isExited ? (
          <div className="flex flex-col items-center gap-3 py-5">
            <span className="flex justify-center items-center text-lg font-medium leading-tight">
              <span className="text-main">{groupName}</span>
              &nbsp;
              {wasManager ? "그룹이 삭제되었어요" : "그룹에서 나갔어요"}
            </span>
            <button
              type="button"
              className="bg-main text-white px-5 py-2 rounded-[8px] mt-2"
              onClick={closeDialog}
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
              <span className="text-lg font-medium leading-tight">
                <span className="text-main">{groupName}</span>
                &nbsp; 그룹에서 나가시겠어요?
              </span>

              <span className="text-sm font-normal leading-tight text-gray-2">
                한번 나가면 &nbsp;
                <span className="text-main">다시 복구할 수 없어요!</span>
                <br />
                <span className="text-xs">
                  그룹장이 나가면 그룹 자체가 삭제됩니다.
                </span>
              </span>
            </div>
            <DialogFooter className="flex flex-row gap-3.5">
              <button
                type="button"
                className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px] disabled:opacity-50"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                취소
              </button>
              <button
                type="button"
                className="w-full bg-main text-white px-5 py-2.5 rounded-[8px] disabled:opacity-50"
                onClick={handleExit}
                disabled={isProcessing}
              >
                {isProcessing ? "처리 중..." : "나가기"}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
