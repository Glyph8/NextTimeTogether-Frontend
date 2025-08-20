import BottomNav from "@/components/shared/BottomNav/BottomNav";

export default function CalendarPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="flex flex-col h-dvh bg-white">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
            <BottomNav/>
        </div>
    )
}