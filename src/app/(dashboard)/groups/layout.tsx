import BottomNav from "@/components/shared/BottomNav/BottomNav";

export default function GroupsPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="w-full h-screen flex flex-col justify-between">
            <main>
                {children}
            </main>
            <BottomNav/>
        </div>
    )
}