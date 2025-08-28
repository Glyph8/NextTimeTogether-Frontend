import Header from "@/components/ui/header/Header";
import LeftArrow from "@/assets/svgs/icons/arrow-left-black.svg";
import Menu from "@/assets/svgs/icons/menu-black.svg"
export default function ScheduleDetailPage() {

    return (
        <div className="w-full h-full bg-main">
            <Header 
            leftChild={
                <button>
                    <LeftArrow/>
                </button>
            }
            title={"발표 주제 정하기"}
            rightChild={
                <button>
                    <Menu/>
                </button>
            }/>
        </div>
    )

}