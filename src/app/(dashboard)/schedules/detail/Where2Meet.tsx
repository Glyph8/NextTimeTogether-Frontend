import { PlaceCard } from "./where-components/PlaceCard"

export const Where2Meet = () =>{
    return(
        <div className="bg-[#F9F9F9] scrollbar-hidden">
            <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
                <div className="text-center text-black-1 text-lg font-semibold leading-tight">
                    장소 게시판
                </div>
                <div className="text-center text-gray-2 text-sm font-normal leading-tight">
                    모임을 원하는 장소에 투표해주세요.
                </div>
                <div className="w-full bg-[#F9F9F9]">
                    <PlaceCard/>
                    <PlaceCard/>
                    <PlaceCard/>
                </div>
            </div>
        </div>
    )
}