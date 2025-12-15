import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import PencilIcon from "@/assets/pngs/pencil.png";
import LocationIcon from "@/assets/pngs/location.png";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface AddPlaceDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    promiseId: string
}

export const AddPlaceDialog = ({ isOpen, setIsOpen, promiseId }: AddPlaceDialogProps) => {
    const router = useRouter();
    const params = useParams<{ groupId: string }>();
    const groupId = params.groupId;

    const handleEnterDirect = () => router.push(`/groups/detail/${groupId}/schedules/add-place-direct?promiseId=${promiseId}`);
    const handleEnterAI = () => router.push(`/groups/detail/${groupId}/schedules/add-place-ai?promiseId=${promiseId}`);

    const buttonStyle = "flex flex-col justify-center items-center gap-3 w-full bg-white border-1 border-gray-3 text-black-1 p-4 rounded-[8px]"
    const descriptionStyle = "text-gray-2 text-sm font-normal leading-tight";
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                장소 등록 방식 선택하기
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-8 bg-white">
                <div className="text-center text-black-1 text-lg font-medium leading-l">
                    어떤 방식으로 장소를 등록할까요?
                </div>
                <DialogFooter className="flex flex-row gap-3.5">
                    <button className={buttonStyle}
                        onClick={handleEnterDirect}>
                        직접 입력하기
                        <Image src={PencilIcon} alt="연필 아이콘" />
                        <div className={descriptionStyle}>
                            직접 공간 정보를<br />
                            입력해요.
                        </div>
                    </button>
                    <button className={buttonStyle}
                        onClick={handleEnterAI}>
                        AI 장소 검색
                        <Image src={LocationIcon} alt="장소 핀 아이콘" />
                        <div className={descriptionStyle}>
                            AI가 알맞는 장소를<br />
                            추천해 드려요.
                        </div>
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}