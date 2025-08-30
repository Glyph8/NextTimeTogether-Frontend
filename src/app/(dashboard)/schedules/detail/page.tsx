"use client"

import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg"
import { useState } from "react";
import { When2Meet } from "./components/When2Meet";
import { Where2Meet } from "./components/Where2Meet";

export default function ScheduleDetailPage() {
    const [tab, setTab] = useState(true);
    return (
        <div className="w-full h-full bg-white">
            <Header
                leftChild={
                    <button>
                        <LeftArrow />
                    </button>
                }
                title={"발표 주제 정하기"}
                rightChild={
                    <button>
                        <Menu />
                    </button>
                } />

            <nav className="w-full flex h-12 text-base font-medium leading-tight bg-white">
                <div className={`w-full flex justify-center items-center border-b-2 
                    ${tab ? "text-main border-main" : "text-[#999999] border-[#D4D4D4]"}  transition-all duration-200`}
                    onClick={()=>setTab(true)}>
                    언제
                </div>
                <div className={`w-full flex justify-center items-center border-b-2 
                    ${tab ? "text-[#999999] border-[#D4D4D4]" : "text-main border-main"}  transition-all duration-200`}
                     onClick={()=>setTab(false)}>
                    어디서
                </div>
            </nav>

            {tab ? <When2Meet/> : <Where2Meet/>}
            
        </div>
    )

}