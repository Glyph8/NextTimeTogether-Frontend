"use client"

import CalendarOn from "@/assets/svgs/icons/calender-on.svg";
import ScheduleOn from "@/assets/svgs/icons/schedule-on.svg";
import GroupOn from "@/assets/svgs/icons/group-on.svg";
import MyPageOn from "@/assets/svgs/icons/mypage-on.svg";

import CalendarOff from "@/assets/svgs/icons/calender-off.svg";
import ScheduleOff from "@/assets/svgs/icons/schedule-off.svg";
import GroupOff from "@/assets/svgs/icons/group-off.svg";
import MyPageOff from "@/assets/svgs/icons/mypage-off.svg";
import { usePathname, useRouter } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleNavigate = (path:string) => router.push(path);
  const navItem = [
    {
      iconOn: CalendarOn,
      iconOff: CalendarOff,
      label: "캘린더",
      path: "/calendar",
      active: pathname.startsWith("/calendar"),
    },
    {
      iconOn: ScheduleOn,
      iconOff: ScheduleOff,
      label: "약속 일정",
      path: "/schedules",
      active: pathname.startsWith("/schedules"),
    },
    {
      iconOn: GroupOn,
      iconOff: GroupOff,
      label: "그룹 관리",
      path: "/groups",
      active: pathname.startsWith("/groups"),
    },
    {
      iconOn: MyPageOn,
      iconOff: MyPageOff,
      label: "마이페이지",
      path: "/my",
      active: pathname.startsWith("/my"),
    },
  ]

  return (
    <div
      className="flex flex-row justify-between items-start
        h-21 py-3 px-6.5
         bg-white border-t border-gray-200 box-border z-50 rounded-t-[32px]"
    >

      {
        navItem.map((item) => {
          return ((
            <button className="flex flex-col w-25 h-11 justify-center items-center 
                bg-[#FFFFFF] rounded-[10px] cursor-pointer gap-2" 
                key={item.path} onClick={()=>handleNavigate(item.path)}>
                  
              {item.active ? 
              <item.iconOn/>
                : 
                <item.iconOff/>
                }
              
              <div className="text-center justify-start text-neutral-900 text-[10px] font-medium font-Pretendard leading-tight">
                {item.label}
              </div>
            </button>
          ))
        })
      }

    </div>
  );
};

export default BottomNav;