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
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-1 flex flex-col overflow-y-auto">
                {children}
            </main>
            {showBottomNav && <BottomNav/>}
        </div>
    )
}