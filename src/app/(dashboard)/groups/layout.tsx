"use client"

import BottomNav from "@/components/shared/BottomNav/BottomNav";
import { usePathname } from "next/navigation";

export default function GroupsPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const pathName = usePathname();
    const showBottomNav = pathName === "/groups";
    return (
        <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
            {showBottomNav && <BottomNav/>}
        </div>
    )
}