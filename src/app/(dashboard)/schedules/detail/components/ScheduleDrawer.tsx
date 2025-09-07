import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/col-drawer";
import { ParticipantCard } from "./ParticipantCard";

interface ScheduleDrawerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isMaster?: boolean;
}

export const ScheduleDrawer = ({ open, setOpen, isMaster = false }: ScheduleDrawerProps) => {
    
    const handleDisperse = () =>{

    }
    const handleExit = () =>{

    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right" >
            <DrawerContent className="flex flex-col gap-7 justify-start w-[70%] h-[80%] bg-[#EEF1F3] p-6 after:hidden overflow-y-scroll">
                {
                    isMaster && (
                        <div className="flex flex-col gap-5 text-start justify-start text-black-1 text-lg font-medium leading-tight">
                            일시 / 장소 확정
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-white outline-1 outline-offset-[-1px] outline-gray-3 rounded-[8px] px-5 py-2.5 text-main">
                                    일시 확정하기
                                </button>
                                <button className="w-full bg-gray-2 rounded-[8px] px-5 py-2.5 text-white">
                                    장소 확정하기
                                </button>
                            </div>
                        </div>
                    )
                }
                <DrawerTitle className="flex flex-col gap-5 text-start justify-start text-black-1 text-lg font-medium leading-tight">
                    <div className="text-start justify-start text-black-1 text-lg font-medium leading-tight">
                        참여 인원
                    </div>
                    <div className="flex flex-col gap-3 py-2 ">
                        <ParticipantCard/>
                        <ParticipantCard/>
                        <ParticipantCard/>
                        <ParticipantCard/>
                        <ParticipantCard/>
                    </div>
                </DrawerTitle>
                <div className="w-full text-center">
                    {isMaster ? (
                        <button className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight"
                        onClick={handleDisperse}>
                            약속 해산하기
                        </button>
                    ) : (
                        <span className="opacity-90 text-center text-gray-2 text-base font-semibold leading-tight"
                        onClick={handleExit}>
                            약속 나가기
                        </span>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}