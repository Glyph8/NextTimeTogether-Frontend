interface ConfirmedPlaceCardProps {
    placeName: string;
    placeAddress: string;
}

export const ConfirmedPlaceCard = ({ placeName, placeAddress }: ConfirmedPlaceCardProps) => {
    return <div className="flex flex-col gap-5 p-4 w-full rounded-[20px] border border-[1px] border-gray-3 text-center bg-white">
        <h1 className="text-sm text-gray-2">장소 확정 완료</h1>

        <div className="flex flex-col gap-3 text-sm text-gray-2">
            <div className="flex items-center gap-3">
                <h1 className="w-10">장소명</h1>
                <p className="text-black text-base">{placeName}</p>
            </div>
            <div className="flex items-center gap-3">
                <h1 className="w-10">주소</h1>
                <p className="text-black text-base">{placeAddress}</p>
            </div>
        </div>

    </div>
}