import Header from "@/components/ui/header/Header";
import { GroupItem } from "./GroupItem";

export default function GroupsPage() {

    return (
        <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
            <Header title={
                <h1 className="text-center text-lg font-medium leading-tight">
                    그룹 관리
                </h1>
            } />

            <div className="w-full h-19 flex justify-end items-center px-4">
                <button className="inline-flex w-30 px-5 py-2.5 bg-main rounded-[8px] text-center justify-center text-white text-base font-medium leading-tight">
                    그룹 만들기
                </button>
            </div>

            <div className="w-full flex flex-col gap-2 px-4">
                <GroupItem />
                <GroupItem />
                <GroupItem />
            </div>

        </div>
    )
}