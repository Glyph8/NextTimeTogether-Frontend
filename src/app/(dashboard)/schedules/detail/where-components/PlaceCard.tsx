import Checked from "@/assets/svgs/icons/checked.svg"
import Unchecked from "@/assets/svgs/icons/unchecked.svg"
import X from "@/assets/svgs/icons/x-gray.svg"
interface PlaceCardProps {
    votedNumber: number;
    totalNumber: number;
    placeName: string;
    address: string;
    isMyPlace: boolean;
    isUserVoted: boolean;
}

export const PlaceCard = ({ placeInfo }: { placeInfo: PlaceCardProps }) => {
    const { votedNumber, totalNumber,
        placeName,
        address,
        isMyPlace,
        isUserVoted } = placeInfo;
        
    return (
        <div className="w-full flex justify-between rounded-[20px] p-4 bg-white border-gray-3 border-1 ">
            <div className="flex flex-col gap-2.5">
                <div className="flex justify-start items-center gap-2 text-base font-medium">
                    <span className="text-gray-2">
                        <span className="text-main">{votedNumber}</span> / {totalNumber}
                    </span>
                    <span className="text-black-1 leading-tight">
                        {placeName}
                    </span>
                    {
                        isMyPlace && 
                        <button>
                            <X className="text-gray-1"/>
                        </button>
                    }
                </div>
                <span className="text-gray-2 text-sm font-normal leading-tight">
                    {address}
                </span>
            </div>
            <button>
                {
                    isUserVoted ? <Checked className="w-7 h-7" /> : <Unchecked className="w-7 h-7" />
                }
            </button>
        </div>
    )
}