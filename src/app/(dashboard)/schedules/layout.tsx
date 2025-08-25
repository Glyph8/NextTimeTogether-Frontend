import BottomNav from "@/components/shared/BottomNav/BottomNav";
import Header from "@/components/ui/header/Header";

export default function SchedulePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header title={<h1 className="text-center text-lg font-medium leading-tight">
                그룹 관리
            </h1>} />
            <main className="flex-1 flex flex-col overflow-y-auto">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}