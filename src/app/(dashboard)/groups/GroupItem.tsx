import Image from "next/image";
import Trashcan from "@/assets/svgs/icons/trashcan.svg";

export const GroupItem = () =>{

    return(
        <div className="w-full flex flex-row bg-white gap-3 px-4 py-3 border-gray-3 border-1 rounded-[8px]">
            <Image src={"https://placehold.co/600x400"} alt="image" width={64} height={64}
            className="border-gray-1 rounded-[8px]"/>
            <div className="w-full flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <p className="text-black-1 text-base font-medium leading-tight tracking-tight">
                        팀 1
                    </p>
                    <Trashcan/>
                </div>

                <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
                    2024-2학기 소프트웨어공학 팀플
                </span>
                <span className="text-gray-2 text-sm font-normal leading-tight tracking-tight">
                    김OO, 김OO, 박OO, 이OO
                </span>
            </div>
        </div>
    )
}