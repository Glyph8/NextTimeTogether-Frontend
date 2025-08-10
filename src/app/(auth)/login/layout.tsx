import Header from "@/components/ui/header/Header";
import ArrowLeft from "@/assets/svgs/icons/arrow-left-black.svg";

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div>
            <Header
                leftChild={
                    <ArrowLeft/>
                }
                title={
                    <h1 className="text-center justify-start text-neutral-900 text-lg font-medium font-['Pretendard'] leading-tight">
                        아이디로 로그인
                    </h1>
                } />
            <main>
                {children}
            </main>
        </div>
    )
}