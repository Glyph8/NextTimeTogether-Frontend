
interface ButtonProps {
    text: string;
    disabled: boolean;
    onClick: () => void;
}

export const Button = ({ text, disabled, onClick }: ButtonProps) => {
    const base = "w-full max-w-200 flex justify-center items-center text-center text-white text-base font-medium leading-tight py-[15px] rounded-[8px]";

    return (
        <>
            {
                disabled ? (
                    <button
                        type="button"
                        className={`${base} bg-[#999999]`}
                        disabled
                    >
                        {text}
                    </button>
                ) : (
                    <button
                        type="button"
                        className={`${base} bg-main`}
                        onClick={onClick}>
                        {text}
                    </button>
                )
            }
        </>

    )
}