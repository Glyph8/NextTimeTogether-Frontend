"use client"

import Header from "@/components/ui/header/Header";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";
import { useRouter } from "next/navigation";

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const handleBackClick = () => router.push("/")
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header
                leftChild={
                    <ArrowLeft onClick={handleBackClick}/>
                }
                title={
                        "아이디로 로그인"
                } />
            <main className="flex-1 overflow-y-auto px-4">
                {children}
            </main>
        </div>
    )
}