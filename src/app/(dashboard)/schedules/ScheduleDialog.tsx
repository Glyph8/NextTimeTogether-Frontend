import { Button } from "@/components/ui/button/Button"
import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ScheduleDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ScheduleDialog = ({ isOpen, setIsOpen }: ScheduleDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                상세 일정
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-5 bg-[#E9E9EB]">

                <div className="flex flex-col justify-center items-start gap-3">
                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            제목
                        </span>
                        <span className="text-black-1 text-base font-medium leading-loose">
                            주제 정하기
                        </span>
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            목적
                        </span>
                        <div className="px-1 py-0.5 w-12 bg-indigo-600/10 rounded-lg inline-flex text-center justify-center items-center text-indigo-600 text-xs font-medium leading-none">
                            스터디
                        </div>
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            일시
                        </span>
                        <span className="text-black-1 text-base font-normal leading-loose">
                            10/12 (토) <br/>
오전 09:00 ~ 오전 12:00  오프라인
                        </span>
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            장소
                        </span>
                        <span className="text-black-1 text-base font-normal  leading-loose">
                            스타벅스 건국대점
                        </span>
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-loose">
                            그룹
                        </span>
                        <span className="text-black-1 text-base font-normal  leading-loose">
                            졸프 팀
                        </span>
                    </span>

                    <span className="flex gap-5">
                        <span className="text-gray-2 text-base font-normal leading-5">
                            참여<br/>
                            인원
                        </span>
                        <span className="text-black-1 text-base font-normal  leading-loose">
                            김OO, 김OO, 박OO, 이OO
                        </span>
                    </span>

                </div>

                <DialogFooter>
                    <Button text={"확인"} disabled={false} onClick={() => setIsOpen(false)} />
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}