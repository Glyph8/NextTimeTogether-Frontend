"use client"

import Header from "@/components/ui/header/Header";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const handleBackClick = () => router.push("/")
    const pathname = usePathname();
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        if (pathname.includes('/step1')) setProgress(25);
        else if (pathname.includes('/step2')) setProgress(50);
        else if (pathname.includes('/step3')) setProgress(75);
        else if (pathname.includes('/complete')) setProgress(100);
        else setProgress(0);
    }, [pathname]); // pathname이 바뀔 때마다 progress를 다시 계산
    
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header
                leftChild={
                    <ArrowLeft onClick={handleBackClick} />
                }
                title={
                    <h1 className="text-center text-lg font-medium leading-tight">
                        회원가입
                    </h1>
                } />
            <main className="flex-1 overflow-y-auto px-4">
                <div className="w-full h-16 py-7 relative">
                    <div className="h-2 bg-main rounded-[20px] transition-all duration-300 z-10 absolute" style={{
                        width: `${progress / 6 * 100}%`
                    }} />
                    <div className="w-full h-2 bg-gray-3 rounded-[20px] z-1" />
                </div>
                {children}
            </main>
        </div>
    )
}