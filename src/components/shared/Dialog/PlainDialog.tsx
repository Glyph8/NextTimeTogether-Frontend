import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ReactNode } from "react";

interface PlainDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: ReactNode;
    hasButton: boolean;
    buttonText: string;
    handleButton: () => void;
}

export const PlainDialog = ({ isOpen, setIsOpen, title, hasButton, buttonText, handleButton }: PlainDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTitle hidden>
                {title}
            </DialogTitle>
            <DialogContent showCloseButton={false}
                className="w-full p-8 bg-white">

                <div className="flex flex-col justify-center items-center gap-3 text-black-1">
                    {
                        title
                    }
                </div>

                {hasButton ? (
                    <DialogFooter className="flex flex-row gap-3.5">
                        <Button text={buttonText} disabled={false} onClick={handleButton} />
                    </DialogFooter>
                ) : null}

            </DialogContent>
        </Dialog>
    )
}