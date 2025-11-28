import { useState } from "react";
import { MemberCountPalette } from "./when-components/MemberCountPalette";
import { TimeTableGrid } from "./when-components/TimeTableGrid";
import { Button } from "@/components/ui/button/Button";

export const When2Meet = () => {
  // Mock data for group schedule (7 days x 15 hours)
  // Initialize with 0s
  const [groupData] = useState<number[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(15).fill(0))
  );

  // State for my schedule
  const [mySelection, setMySelection] = useState<boolean[][]>(
    Array(7)
      .fill(null)
      .map(() => Array(15).fill(false))
  );

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Group Schedule Section */}
      <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
        <div className="text-center text-black-1 text-lg font-semibold leading-tight">
          그룹 시간표
        </div>
        <div className="text-center text-gray-2 text-sm font-normal leading-tight">
          시간을 클릭하면 누가 체크했는지 볼 수 있어요.
        </div>
        <MemberCountPalette maxCount={5} />

        <div className="w-full mt-4">
          <TimeTableGrid mode="view" data={groupData} maxMembers={5} />
        </div>
      </div>

      <div className="h-2 bg-[#F9F9F9]" />

      {/* My Schedule Section */}
      <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
        <div className="text-center text-black-1 text-lg font-semibold leading-tight">
          내 시간표
        </div>
        <div className="text-center text-gray-2 text-sm font-normal leading-tight">
          가능한 시간대를 드래그해서 표시해주세요.
        </div>

        <div className="w-full mt-4">
          <TimeTableGrid
            mode="select"
            mySelection={mySelection}
            onChange={setMySelection}
          />
        </div>

        <div className="flex w-full gap-2 mt-6">
          <button className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium">
            캘린더 불러오기
          </button>
          <button className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium">
            우선순위 설정하기
          </button>
        </div>

        <div className="w-full mt-2">
          <Button
            text="저장"
            onClick={() => console.log("Save", mySelection)}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
