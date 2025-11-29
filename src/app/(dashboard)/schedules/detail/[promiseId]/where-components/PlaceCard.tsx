import { PlaceBoardItem } from "@/api/where2meet";
import Checked from "@/assets/svgs/icons/checked.svg"
import Unchecked from "@/assets/svgs/icons/unchecked.svg"
import X from "@/assets/svgs/icons/x-gray.svg"

interface PlaceCardProps{
    placeInfo:PlaceBoardItem, 
    totalMemberCount:number
}

// TODO: 내가 만든 장소임을 의미하는 데이터가 isRemoved인지? 어떤 의미의 데이터임? + 트펴
export const PlaceCard = ({placeInfo, totalMemberCount}:PlaceCardProps) => {
    const { voting,
        placeName,
        placeAddr,
        isRemoved,
        voted } =placeInfo;
        
    return (
        <div className="w-full flex justify-between rounded-[20px] p-4 bg-white border-gray-3 border-1 ">
            <div className="flex flex-col gap-2.5">
                <div className="flex justify-start items-center gap-2 text-base font-medium">
                    <span className="text-gray-2">
                        <span className="text-main">{voting}</span> / {totalMemberCount}
                    </span>
                    <span className="text-black-1 leading-tight">
                        {placeName}
                    </span>
                    {
                        isRemoved && 
                        <button>
                            <X className="text-gray-1"/>
                        </button>
                    }
                </div>
                <span className="text-gray-2 text-sm font-normal leading-tight">
                    {placeAddr}
                </span>
            </div>
            <button>
                {
                    voted ? <Checked className="w-7 h-7" /> : <Unchecked className="w-7 h-7" />
                }
            </button>
        </div>
    )
}