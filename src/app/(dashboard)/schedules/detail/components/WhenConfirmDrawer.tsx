import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

interface ScheduleDrawerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WhenConfirmDrawer = ({ open, setOpen }: ScheduleDrawerProps) => {
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent aria-label="신고할 공공기관 번호 모음" className="h-96 bg-[#EEF1F3]">
                <div className="flex flex-col justify-start px-4 bg-[#EEF1F3]">
                    <div className="flex-4 flex justify-center items-center mb-7.5 ">

                        <DrawerTitle className="text-center justify-center text-slate-950 text-2xl font-bold leading-9">
                            신고 접수하기
                        </DrawerTitle>

                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    )
}