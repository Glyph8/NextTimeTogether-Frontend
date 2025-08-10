"use client"
import Link from "next/link";
import { useState } from "react";

import CalendarOn from "@/assets/svgs/icons/calender-on.svg";
import ScheduleOn from "@/assets/svgs/icons/schedule-on.svg";
import GroupOn from "@/assets/svgs/icons/group-on.svg";
import MyPageOn from "@/assets/svgs/icons/mypage-on.svg";

import CalendarOff from "@/assets/svgs/icons/calender-off.svg";
import ScheduleOff from "@/assets/svgs/icons/schedule-off.svg";
import GroupOff from "@/assets/svgs/icons/group-off.svg";
import MyPageOff from "@/assets/svgs/icons/mypage-off.svg";

const BottomNav = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");

  return (
    <div
      className="flex flex-row justify-between items-start
        h-21 py-3 px-6.5
         bg-white border-t border-gray-200 box-border z-50 rounded-t-[32px]"
    >
      <Link href="/calendar" className="flex flex-col w-25 h-11 justify-center items-center 
                bg-[#FFFFFF] rounded-[10px] cursor-pointer gap-2">
        {selectedMenu === "calendar" ? <CalendarOn className="w-6 h-6" />
          : <CalendarOff className="w-6 h-6" />}
        <div className="text-center justify-start text-neutral-900 text-[10px] font-medium font-Pretendard leading-tight">
          캘린더
        </div>
      </Link>

      <Link href="/calendar" className="flex flex-col w-25 h-11 justify-center items-center 
                bg-[#FFFFFF] rounded-[10px] cursor-pointer gap-2">
        {selectedMenu === "calendar" ? <ScheduleOn className="w-6 h-6" />
          : <ScheduleOff className="w-6 h-6" />}
       <div className="text-center justify-start text-neutral-900 text-[10px] font-medium font-Pretendard leading-tight">
          약속 일정
        </div>
      </Link>

      <Link href="/calendar" className="flex flex-col w-25 h-11 justify-center items-center 
                bg-[#FFFFFF] rounded-[10px] cursor-pointer gap-2">
        {selectedMenu === "calendar" ? <GroupOn className="w-6 h-6" />
          : <GroupOff className="w-6 h-6" />}
        <div className="text-center justify-start text-neutral-900 text-[10px] font-medium font-Pretendard leading-tight">
          그룹 관리
        </div>
      </Link>

      <Link href="/calendar" className="flex flex-col w-25 h-11 justify-center items-center 
                bg-[#FFFFFF] rounded-[10px] cursor-pointer gap-2">
        {selectedMenu === "calendar" ? <MyPageOn className="w-6 h-6" />
          : <MyPageOff className="w-6 h-6" />}
       <div className="text-center justify-start text-neutral-900 text-[10px] font-medium font-Pretendard leading-tight">
          마이페이지
        </div>
      </Link>


    </div>
  );
};

export default BottomNav;