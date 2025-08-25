interface ScheduleItemProps{
    type: string;
    title: string;
    date: string;
}

export const ScheduleItem = ({type, title, date}: ScheduleItemProps) => {

    return(
        <div className="flex flex-col p-4 gap-2">
            <div className="flex gap-2 items-center">
                <div className="bg-indigo-600/10 text-center text-indigo-600 text-xs font-medium leading-none">
                    {type}
                </div>
                <div className="text-black text-base font-medium leading-tight">
                    {title}
                </div>
            </div>
            <div className="flex text-sm text-gray-2 font-normal leading-tight">
                {date}
            </div>
        </div>
    )
}