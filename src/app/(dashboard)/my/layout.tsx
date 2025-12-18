import BottomNav from "@/components/shared/BottomNav/BottomNav";

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      <main className="flex-1 overflow-y-auto px-4">{children}</main>
      <BottomNav />
    </div>
  );
}
