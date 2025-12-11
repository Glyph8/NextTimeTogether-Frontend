"use client";

import { PromiseView2Response, PromiseView4Response } from "@/apis/generated/Api";
import { usePromiseStore } from "@/store/promise-detail.store";
import { useRouter } from "next/navigation";

interface GroupScheduleItemProps {
    promiseInfo : PromiseView2Response | PromiseView4Response
    id: string;
    category: string;
    title: string;
    time?: string;
    attendees?: string;
    place?: string;
    groupId: string;
}

export const GroupScheduleItem = ({id, category, title, time, attendees, place,  promiseInfo, groupId }: GroupScheduleItemProps) => {
    const router = useRouter();
    const setPromise = usePromiseStore((state) => state.setPromise);
    const handleNavToDetail = async () => {

        const promiseKey = "TODO : promiseKey API 필요"
        setPromise(promiseInfo, promiseKey);
        const encodedTitle = encodeURIComponent(title);
        // router.push(`/schedules/detail/${id}`);
        // router.push(`/schedules/detail/${id}?title=${encodedTitle}`);
        router.push(`/schedules/detail/${id}?title=${encodedTitle}&groupId=${groupId}`);
    }
    return (
        <div role="button" tabIndex={0} className="w-full p-4 rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.04)] outline-1 outline-offset-[-1px] outline-gray-3 bg-white inline-flex flex-col justify-start items-start gap-2"
        onClick={handleNavToDetail}>
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