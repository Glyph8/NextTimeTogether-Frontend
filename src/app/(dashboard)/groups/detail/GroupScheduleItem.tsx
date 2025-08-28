interface GroupScheduleItemProps {
    category: string;
    title: string;
    time?: string;
    attendees?: string;
    place?: string;
}

export const GroupScheduleItem = ({ category, title, time, attendees, place }: GroupScheduleItemProps) => {

    return (
        <div className="w-full p-4 rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.04)] outline-1 outline-offset-[-1px] outline-gray-3 inline-flex flex-col justify-start items-start gap-2">
            <div className="flex gap-2 items-center">
                <span className="rounded-[20px] px-1 py-0.5 text-calendar-blue bg-[#3B4FFF1A]">
                    {category}
                </span>
                <span className="text-black-1 text-base font-medium leading-tight">
                    {title}
                </span>
            </div>

            <div className="text-sm font-normal leading-tight">
                {
                    time ? (
                        <span className="text-gray-2">
                            {[time, attendees].filter(Boolean).join(" ")}
                        </span>
                    ) : (
                        <span className="text-main">
                            언제 만날까?
                        </span>
                    )
                }
            </div>

            <div className="text-sm font-normal leading-tight">
                {
                    place ? (
                        <span className="text-gray-2">
                            {place}
                        </span>
                    ) : (
                        <span className="text-main">
                            어디서 만날까?
                        </span>
                    )
                }
            </div>
        </div>
    )
}