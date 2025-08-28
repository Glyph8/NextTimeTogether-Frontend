import { toast } from "sonner";

interface ToastButtonProps {
    text: string;
    disabled: boolean;
    handleEventClick : () => void;
    toastMessage: string;
}

export const ToastButton = ({ text, disabled, handleEventClick, toastMessage }: ToastButtonProps) => {
    const base = "w-full max-w-200 flex justify-center items-center text-center text-white text-base font-medium leading-tight py-[15px] rounded-[8px]";
    const handleClick = () =>{
        handleEventClick();
        toast(
            <h1>{toastMessage}</h1>
        )
    }
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
                        onClick={handleClick}>
                        {text}
                    </button>
                )
            }
        </>

    )
}