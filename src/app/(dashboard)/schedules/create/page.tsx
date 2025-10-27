"use client"

import Header from "@/components/ui/header/Header";
import X from "@/assets/svgs/icons/x-black.svg"
import XWhite from "@/assets/svgs/icons/x-white.svg"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GroupMemberItem } from "../../groups/detail/[groupId]/(components)/GroupMemberItem";
import { Button } from "@/components/ui/button/Button";
import { RadioButton } from "@/components/shared/Input/RadioButton";

type PurposeType = "study" | "meal";

export default function CreateSchedulePage() {
    const router = useRouter()
    const [progress, setProgress] = useState(1);
    const [topic, setTopic] = useState("");
    const [purpose, setPurpose] = useState<PurposeType>("study");
    
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('선택된 값:', event.target.value);
         setPurpose(event.target.value as PurposeType);
    };

    return (
        <div className="bg-white">
            <Header
                leftChild={
                    <button onClick={() => router.back()} >
                        <X />
                    </button>
                }
                title={
                    "약속 만들기"} />
            <div className="w-full px-4">
                <div className="w-full h-16 py-7 relative">
                    <div className="h-2 bg-main rounded-[20px] transition-all duration-300 z-10 absolute" style={{
                        width: `${progress / 6 * 100}%`
                    }} />
                    <div className="w-full h-2 bg-gray-3 rounded-[20px] z-1" />
                </div>

                <nav className="text-black-1 text-xl font-medium leading-loose">
                    약속 정보를 입력해주세요.
                </nav>

                <div className="py-4">
                    <span className="text-gray-1 text-sm font-normal leading-tight">
                        주제
                    </span>
                    <div className="w-full flex justify-between relative">
                        <input placeholder="그룹명을 입력해주세요."
                            className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main"
                            onChange={(e) => setTopic(e.target.value)} value={topic} />

                        {topic !== "" &&
                            <button className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
                                onClick={() => setTopic("")}>
                                <XWhite />
                            </button>}
                    </div>
                </div>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex justify-between py-2 gap-2 items-center text-gray-2 text-sm font-medium leading-tight">
                        <div>
                            참여 그룹원
                        </div>
                        <span>
                            8 / 30
                        </span>
                    </div>

                    <div className="flex p-4 bg-[#F9F9F9] gap-2 rounded-[20px]">
                        <GroupMemberItem marker={["사용자"]} name={"김나박이"} selectable={true} isSelected={true} />
                        <GroupMemberItem marker={["그룹장"]} name={"가나다람바사아자차카파타하"} selectable={true} isSelected={true} />
                        <GroupMemberItem marker={["사용자", "그룹장"]} name="둘다" selectable={true} isSelected={false} />
                        <GroupMemberItem name={"먼데이"} selectable={true} isSelected={false} />
                    </div>
                </div>

                <div className="py-4">
                    <span className="text-gray-1 text-sm font-normal leading-tight">
                        목적
                    </span>
                    <div className="flex gap-3">
                        <RadioButton id="study" name="purpose" value="study" label="스터디"
                            checked={purpose === "study"} handleChange={handleOptionChange} />
                        <RadioButton id="meal" name="purpose" value="meal" label="식사"
                            checked={purpose === "meal"} handleChange={handleOptionChange} />
                    </div>
                </div>
                <div className="pt-11 pb-5">
                    <Button text={"다음"} disabled={false} onClick={() => { setProgress(2) }} />
                </div>
            </div>
        </div>
    )
}