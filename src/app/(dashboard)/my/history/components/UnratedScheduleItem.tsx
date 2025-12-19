interface UnratedScheduleItemProps {
    type: string;
    title: string;
    date: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isRated?: boolean
}

export const UnratedScheduleItem = ({ type, title, date, setIsOpen }: UnratedScheduleItemProps) => {

    const handleShowDetail = () => { setIsOpen(true) }

    return (
        <div className="flex p-4 justify-between items-center border-b border-[#F1F2F4] cursor-pointer" onClick={handleShowDetail}>
            <div className="flex gap-2 items-center">
                <div className="bg-indigo-600/10 text-center text-indigo-600 text-xs font-medium leading-none p-2 whitespace-nowrap rounded-[8px]">
                    {type}
                </div>
                <div className="text-black text-base font-medium leading-tight">
                    {title}
                </div>
            </div>

            <div className="px-3 py-1.5 bg-indigo-600 rounded-[20px] flex justify-center items-center whitespace-nowrap shadow-sm hover:bg-indigo-700 transition-colors">
                <div className="text-white text-xs font-semibold leading-none">평가하기</div>
            </div>
        </div>
    )
}