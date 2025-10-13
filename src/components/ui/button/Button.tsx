import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    text: string;
    isSubmit?: boolean;
}

export const Button = ({ text, isSubmit = false, disabled, ...props }: ButtonProps) => {
    const base = "w-full max-w-200 flex justify-center items-center text-center text-white text-base font-medium leading-tight py-[15px] rounded-[8px]";
    return (
        <button
            type={isSubmit ? "submit" : "button"}
            className={`${base} ${disabled ? 'bg-[#999999]' : 'bg-main'}`}
            disabled={disabled}
            {...props}
        >
            {text}
        </button>

    )
}