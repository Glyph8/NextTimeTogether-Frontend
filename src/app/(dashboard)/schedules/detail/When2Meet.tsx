import { MemberCountPalette } from "./when-components/MemberCountPalette"

export const When2Meet = () => {
    return (
        <div>
            <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
                <div className="text-center text-black-1 text-lg font-semibold leading-tight">
                    약속 시간표
                </div>
                <div className="text-center text-gray-2 text-sm font-normal leading-tight">
                    시간을 클릭하면 누가 체크했는지 볼 수 있어요.
                </div>
                <MemberCountPalette/>
            </div>

            <div className="bg-[#F9F9F9] px-4 py-3">
                <div>
                    약속 시간표
                </div>
            </div>

            <div className="flex flex-col gap-3 px-4 py-5 items-center bg-white">
                <div className="text-center text-black-1 text-lg font-semibold leading-tight">
                    내 시간표
                </div>
                <div className="text-center text-gray-2 text-sm font-normal leading-tight">
                    가능한 시간대를 드래그해서 표시해주세요.
                </div>
            </div>
            
            <div className="bg-[#F9F9F9] px-4 py-3">
                내 시간표
            </div>
        </div>
    )
}