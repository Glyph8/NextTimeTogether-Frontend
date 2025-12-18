"use client";

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import DefaultLoading from "@/components/ui/Loading/DefaultLoading";
import { useState } from "react";
import { ConfirmedTimeCard } from "./components/ConfirmedTimeCard";
import { ConfirmedPlaceCard } from "./components/ConfirmedPlaceCard";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getScheduleDetail } from "@/api/appointment";
import { parseScheduleString } from "./utils/formatter";

export default function FixedScheduleDetailPage() {
  const router = useRouter();
  const [tab, setTab] = useState(true);
  const params = useParams<{ scheduleId: string }>();
  const scheduleId = params.scheduleId;

  const { data: scheduleDetail, isPending } = useQuery({
    queryKey: ["scheduleDetail", scheduleId],
    queryFn: async () => {
      const result = await getScheduleDetail(scheduleId);
      return result;
    },
  });

  const handleBack = () => {
    router.push("/appointment");
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-[#f9f9f9]">
      <Header
        leftChild={
          <button type="button" aria-label="뒤로가기" onClick={handleBack}>
            <LeftArrow />
          </button>
        }
        title={scheduleDetail?.title || "약속 상세"}
        setShadow={false}
      />
      <nav
        role="tablist"
        aria-label="일정 장세 탭"
        className="w-full flex h-12 text-base font-medium leading-tight bg-white"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${
                      tab
                        ? "text-main border-main"
                        : "text-[#999999] border-[#D4D4D4]"
                    }  transition-all duration-200`}
          onClick={() => setTab(true)}
        >
          언제
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab}
          className={`w-full flex justify-center items-center border-b-2 
                    ${
                      tab
                        ? "text-[#999999] border-[#D4D4D4]"
                        : "text-main border-main"
                    }  transition-all duration-200`}
          onClick={() => setTab(false)}
        >
          어디서
        </button>
      </nav>
      {isPending || !scheduleDetail ? (
        <DefaultLoading />
      ) : tab ? (
        <div className="p-4">
          <ConfirmedTimeCard
            date={parseScheduleString(scheduleDetail?.scheduleId).date}
            time={parseScheduleString(scheduleDetail?.scheduleId).time}
          />
        </div>
      ) : (
        <div className="p-4">
          <ConfirmedPlaceCard
            placeName={scheduleDetail.placeName}
            placeAddress={scheduleDetail.placeAddress}
          />
        </div>
      )}
    </div>
  );
}
