"use client"; // [추가] window 객체 사용을 위해

import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface GroupInviteDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
}

export const GroupInviteDialog = ({
  isOpen,
  setIsOpen,
  groupId,
}: GroupInviteDialogProps) => {

  // [수정] API 호출 없이 "공개 신청 링크"를 직접 구성합니다.
  const publicInviteLink = `${window.location.origin}/group/join/${groupId}`;

  const hanldeCopyLink = async () => {
    try {
      // [수정] 생성된 공개 링크를 복사
      await navigator.clipboard.writeText(publicInviteLink);
      setIsOpen(false);
      toast("그룹 초대 링크를 클립보드에 복사했어요.");
    } catch (error) {
      toast("그룹 초대 링크를 복사하지 못했어요.");
      console.error("그룹 초대 링크 복사 실패", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="sr-only">그룹 초대 링크 생성하기</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full flex flex-col p-5 bg-white rounded-[28px] mx-auto"
      >
        <div className="w-full flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
          <div className="text-lg font-medium leading-loose">
            그룹에 초대할 분께 링크를 보내주세요.
          </div>

          <div className="block w-full min-w-0 truncate text-sm font-normal leading-snug text-gray-2 ">
            {publicInviteLink}
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3.5">
          <Button
            text={"링크 복사"}
            disabled={false} 
            onClick={hanldeCopyLink}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};