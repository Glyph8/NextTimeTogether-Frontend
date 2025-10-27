import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getInviteLinkAction } from "../action";

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

  const {
    data: inviteLinkResult, 
    isPending, 
    isError,
    error,
  } = useQuery({
    // queryKey를 groupId에 따라 고유하게
    queryKey: ["inviteCode", groupId],
    queryFn: async () => {
      // 서버 액션을 호출
      const result = await getInviteLinkAction(groupId);
      // 서버 액션이 실패하면 에러를 throw하여 useQuery가 인지하게
      if (!result.success) {
        throw new Error(result.error || "링크를 가져오지 못했습니다.");
      }
      // 성공 시 실제 데이터 초대 코드를 반환합니다.
      return result.data;
    },
    // [옵션] 이 다이얼로그가 열려있을 때만 쿼리를 실행합니다.
    enabled: isOpen,
    // [옵션] 실패 시 재시도 횟수 (기본값 3)
    retry: 1,
  });
  const hanldeCopyLink = async () => {
    if (!inviteLinkResult) {
      toast("아직 링크를 불러오는 중입니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLinkResult); // [수정]
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
            {isPending && "초대 링크를 불러오는 중..."}
            {isError && `오류 발생: ${error.message}`}
            {inviteLinkResult && inviteLinkResult}
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
