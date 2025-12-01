import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
// import Image from "next/image";

interface EnterGroupDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EnterGroupDialog = ({ isOpen, setIsOpen }: EnterGroupDialogProps) => {

    const [isEntered, setIsEntered] = useState(false);

    const handleEnterGroup = () => {
        setIsEntered(true);
    }

    const handleReject = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        if (!isOpen) {
            setIsEntered(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                그룹에 참여하기
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-8 bg-white">
                {
                    isEntered ? (
                        <span className="flex justify-center items-center text-lg font-medium leading-tight py-5">
                            <span className="text-main">
                                소프트웨어공학 2조
                            </span>
                            &nbsp; 에 참여했어요.
                        </span>
                    ) : (
                        <>
                            <div className="flex flex-col justify-center items-center gap-3 text-black-1">

                                <div className="w-16 h-16 bg-amber-500 border-gray-1 rounded-[8px]"/>

                                <div className="flex flex-col justify-center items-center gap-1.5">
                                    <span className="text-black-1 text-base font-medium leading-tight">
                                        소프트웨어공학 2조
                                    </span>
                                    <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
                                        2024-2학기 소프트웨어공학 팀플
                                    </span>
                                    <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
                                        김OO, 김OO, 박OO, 이OO
                                    </span>
                                </div>

                            </div>

                            <span className="flex justify-center items-center text-lg font-medium leading-tight my-7">
                                <span className="text-main">
                                    소프트웨어공학 2조
                                </span>
                                &nbsp; 에 참여하시겠어요?
                            </span>

                            <DialogFooter className="flex flex-row gap-3.5">
                                <button className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px]"
                                    onClick={handleReject}>
                                    아니오
                                </button>
                                <button className="w-full bg-main text-white px-5 py-2.5 rounded-[8px]"
                                    onClick={handleEnterGroup}>
                                    참여
                                </button>
                            </DialogFooter>
                        </>
                    )
                }

            </DialogContent>
        </Dialog>
    )
}