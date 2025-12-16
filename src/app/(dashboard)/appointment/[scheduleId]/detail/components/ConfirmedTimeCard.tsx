interface ConfirmedPlaceCardProps {
    date: string;
    time: string;
}

export const ConfirmedTimeCard = ({ date, time }: ConfirmedPlaceCardProps) => {
    return <div className="flex flex-col gap-5 p-4 w-full rounded-[20px] border border-[1px] border-gray-3 text-center bg-white">
        <h1 className="text-sm text-gray-2">일시 확정 완료</h1>

        <div className="flex flex-col gap-3 text-sm text-gray-2">
            <div className="flex items-center gap-3">
                <h1 className="w-10">날짜</h1>
                <p className="text-black text-base">{date}</p>
            </div>
            <div className="flex items-center gap-3">
                <h1 className="w-10">시간</h1>
                <p className="text-black text-base">{time}</p>
            </div>
        </div>

    </div>
}