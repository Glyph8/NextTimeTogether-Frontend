import Checked from "@/assets/svgs/icons/checked.svg"
import Unchecked from "@/assets/svgs/icons/unchecked.svg"

export const PlaceCard = () => {

    return (
        <div className="w-full flex justify-between rounded-[20px] p-4 bg-white border-gray-3 border-1 ">
            <div className="flex flex-col gap-2.5">
                <span>
                    <span>
                        5/5
                    </span>
                    <span className="text-black-1 text-base font-medium leading-tight">
                        스타벅스 건국대점
                    </span>
                </span>
                <span className="text-gray-2 text-sm font-normal leading-tight">
                    서울 광진구 능동로 117 (화양동)
                </span>
            </div>
            <button>
                <Checked className="w-10 h-10" />
                <Unchecked width={40} height={40}/>
            </button>
        </div>
    )
}