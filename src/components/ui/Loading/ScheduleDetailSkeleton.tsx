import React from "react";

export const ScheduleDetailSkeleton = () => {
    // 공통적인 스켈레톤 라인 스타일
    const LabelSkeleton = () => (
        <div className="h-6 w-10 bg-gray-300/50 rounded animate-pulse" />
    );
    const ValueSkeleton = ({ width = "w-32" }: { width?: string }) => (
        <div className={`h-6 ${width} bg-gray-300/50 rounded animate-pulse`} />
    );

    return (
        <div className="flex flex-col justify-center items-start gap-5 w-full">
            {/* 제목 */}
            <div className="flex gap-5 w-full items-center">
                <LabelSkeleton />
                <ValueSkeleton width="w-48" />
            </div>

            {/* 목적 */}
            <div className="flex gap-5 w-full items-center">
                <LabelSkeleton />
                <div className="h-6 w-12 bg-indigo-100 rounded-lg animate-pulse" />
            </div>

            {/* 일시 (2줄 고려) */}
            <div className="flex gap-5 w-full items-start">
                <LabelSkeleton />
                <div className="flex flex-col gap-2">
                    <ValueSkeleton width="w-24" />
                    <ValueSkeleton width="w-20" />
                </div>
            </div>

            {/* 장소 */}
            <div className="flex gap-5 w-full items-center">
                <LabelSkeleton />
                <ValueSkeleton width="w-40" />
            </div>

            {/* 그룹 */}
            <div className="flex gap-5 w-full items-center">
                <LabelSkeleton />
                <ValueSkeleton width="w-28" />
            </div>

            {/* 참여 인원 */}
            <div className="flex gap-5 w-full items-center">
                <div className="flex flex-col gap-1">
                    <LabelSkeleton />
                </div>
                <ValueSkeleton width="w-full" />
            </div>
        </div>
    );
};