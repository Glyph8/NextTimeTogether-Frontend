import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react";

interface ExitGroupDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExitGroupDialog = ({ isOpen, setIsOpen }: ExitGroupDialogProps) => {

    const [isExited, setIsExited] = useState(false);

    const handleExit = () => {
        // 나가기 요청 추가
        setIsExited(true);
    }

    const handleCancel = () => {
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle className="sr-only">
                그룹에서 나가기
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-5 bg-white">
                {
                    isExited ? (
                        <span className="flex justify-center items-center text-lg font-medium leading-tight py-5">
                            <span className="text-main">
                                졸프 팀
                            </span>
                            &nbsp; 그룹에서 나갔어요
                        </span>
                    ) : (
                        <>
                            <div className="flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
                                <span className="text-lg font-medium leading-tight">
                                    <span className="text-main">
                                        졸프 팀
                                    </span>
                                    &nbsp; 그룹에서 나가시겠어요?
                                </span>

                                <span className="text-sm font-normal leading-tight text-gray-2">
                                    한번 나가면 &nbsp;
                                    <span className="text-main">
                                        다시 복구할 수 없어요!
                                    </span>
                                </span>
                            </div>
                            <DialogFooter className="flex flex-row gap-3.5">
                                <button className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px]"
                                    onClick={handleCancel}>
                                    취소
                                </button>
                                <button className="w-full bg-main text-white px-5 py-2.5 rounded-[8px]"
                                    onClick={handleExit}>
                                    나가기
                                </button>
                            </DialogFooter>
                        </>
                    )
                }


            </DialogContent>
        </Dialog>
    )
}