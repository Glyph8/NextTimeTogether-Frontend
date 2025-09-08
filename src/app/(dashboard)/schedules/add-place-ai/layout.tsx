'use client'
import Header from "@/components/ui/header/Header";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";
import { useRouter } from "next/navigation";

export default function AddPlaceLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const handleBackClick = () => router.back();
    console.log(ArrowLeft); 
    return (
        <div className="flex flex-col flex-1 bg-white">
            <Header
        leftChild={
          <ArrowLeft
            className="w-6 h-6 text-black fill-current"
            onClick={handleBackClick}
          />
        }
        title={"AI 장소 검색"}
        setShadow={true}
      />
            <main className="flex flex-col flex-1 overflow-y-auto px-4">
                {children}
            </main>
        </div>
    )
}