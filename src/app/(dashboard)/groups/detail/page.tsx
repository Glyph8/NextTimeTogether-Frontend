import Header from "@/components/ui/header/Header";
import Link from "next/link";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg"

export default function DetailGroupPage() {

    return (
        <div className="flex flex-col w-full flex-1 bg-[#F9F9F9]">
            <Header
                leftChild={
                    <Link href={"/groups"}>
                        <ArrowLeft />
                    </Link>
                }
                title={
                    <h1 className="text-center text-lg font-medium leading-tight">
                        소프트웨어공학 2조
                    </h1>
                } />
        </div>
    )
}