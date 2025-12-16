import { getScheduleDetail, GetScheduleDetailRes } from "@/api/appointment";
import { Button } from "@/components/ui/button/Button"
import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useQuery } from "@tanstack/react-query";
import { parseScheduleString } from "../[scheduleId]/detail/utils/formatter";

interface ScheduleDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scheduleId: string;
}

export const ScheduleDialog = ({ isOpen, setIsOpen, scheduleId }: ScheduleDialogProps) => {
    const { data: scheduleDetail, isPending } = useQuery({
        queryKey: ["scheduleDetail", scheduleId],
        queryFn: async () => {
            const result = await getScheduleDetail(scheduleId);
            return result;
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                상세 일정
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-5 bg-[#E9E9EB]">
                {
                    isPending ? <DefaultLoading /> : scheduleDetail && (
                        <div className="flex flex-col justify-center items-start gap-3 overflow-auto no-scrollbar">
                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-loose">
                                    제목
                                </span>
                                <span className="text-black-1 text-base font-medium leading-loose">
                                    {scheduleDetail.title}
                                </span>
                            </span>

                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-loose">
                                    목적
                                </span>
                                <div className="px-1 py-0.5 w-12 bg-indigo-600/10 rounded-lg inline-flex text-center justify-center items-center text-indigo-600 text-sm font-medium leading-none">
                                    {scheduleDetail.type ?? "약속"}
                                </div>
                            </span>

                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-loose">
                                    일시
                                </span>
                                <span className="text-black-1 text-base font-normal leading-loose">
                                    {parseScheduleString(scheduleDetail.scheduleId).date} <br />
                                    {parseScheduleString(scheduleDetail.scheduleId).time}
                                </span>
                            </span>

                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-loose">
                                    장소
                                </span>
                                <span className="text-black-1 text-base font-normal  leading-loose">
                                    {scheduleDetail.placeName}
                                </span>
                            </span>

                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-loose">
                                    그룹
                                </span>
                                <span className="text-black-1 text-base font-normal  leading-loose">
                                    {scheduleDetail.groupName}
                                </span>
                            </span>

                            <span className="flex gap-5">
                                <span className="text-gray-2 text-base font-normal leading-5 whitespace-nowrap">
                                    참여<br />
                                    인원
                                </span>
                                {/* TODO : 암호화된 아이디 복호화 필요 */}
                                <span className="text-black-1 text-base font-normal  leading-loose overflow-scroll no-scrollbar">
                                    {scheduleDetail.encUserIds.map((member) => member).join(", ")}
                                </span>
                            </span>

                        </div>
                    )
                }


                <DialogFooter>
                    <Button text={"확인"} disabled={false} onClick={() => setIsOpen(false)} />
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}