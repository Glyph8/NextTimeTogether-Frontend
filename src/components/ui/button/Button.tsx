
interface ButtonProps {
    text: string;
    disabled: boolean;
    onClick: ()=>void;
}

export const Button = ({ text, disabled, onClick }: ButtonProps) => {

    return (
        <>
            {
                disabled ? (
                    <button className="w-full max-w-200 flex justify-center items-center text-center text-white
                    bg-[#999999] text-base font-medium font-['Pretendard'] leading-tight py-[15px] rounded-[8px]" disabled>
                        {text}
                    </button>
                ) : (
                    <button className="w-full max-w-200 flex justify-center items-center text-center text-white
                    bg-main text-base font-medium font-['Pretendard'] leading-tight py-[15px] rounded-[8px]"
                    onClick={onClick}>
                        {text}
                    </button>
                )
            }
        </>

    )
}