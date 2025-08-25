import BottomNav from "@/components/shared/BottomNav/BottomNav";

export default function GroupsPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
            <BottomNav/>
        </div>
    )
}