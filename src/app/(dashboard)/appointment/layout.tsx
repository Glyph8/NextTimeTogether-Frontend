"use client";

import BottomNav from "@/components/shared/BottomNav/BottomNav";
import { usePathname } from "next/navigation";

export default function SchedulePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
