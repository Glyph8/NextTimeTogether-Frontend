import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner";

interface GroupInviteDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroupInviteDialog = ({ isOpen, setIsOpen }: GroupInviteDialogProps) => {

    const dummyLink = "https://www.figma.com/design/Qaz3IaHmDJDKIfd5hZKl8i/%ED%83%80%EC%9E%84%ED%88%AC%EA%B2%8C%EB%8D%94-%EC%95%B1?node-id=617-10252&node-type=frame&t=PlEgiuoX8uTewyhm-0"

    const hanldeCopyLink = async () => {
        try{
            await navigator.clipboard.writeText(dummyLink);
            setIsOpen(false);
            toast(
                "그룹 초대 링크를 클립보드에 복사했어요."
            )
        }
        catch(error){
            toast("그룹 초대 링크를 복사하지 못했어요.")
            console.error("그룹 초대 링크 복사 실패", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle className="sr-only">
                그룹 초대 링크 생성하기
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full flex flex-col p-5 bg-white rounded-[28px] mx-auto">

                <div className="w-full flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
                    <div className="text-lg font-medium leading-loose">
                        그룹에 초대할 분께 링크를 보내주세요.
                    </div>

                    <div className="block w-full min-w-0 truncate text-sm font-normal leading-snug text-gray-2 ">
                        {dummyLink}
                    </div>
                </div>
                <DialogFooter className="flex flex-row gap-3.5">
                    <Button text={"링크 복사"} disabled={false} onClick={hanldeCopyLink} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}