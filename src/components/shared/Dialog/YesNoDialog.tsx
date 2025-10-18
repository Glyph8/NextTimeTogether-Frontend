import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, useEffect, useRef, useState } from "react";

interface YesNoDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: ReactNode;
  acceptedTitle: ReactNode;
  rejectText: string;
  acceptText: string;
  extraHandleReject: () => void;
  extraHandleAccept: () => void;
}

export const YesNoDialog = ({
  isOpen,
  setIsOpen,
  title,
  acceptedTitle,
  rejectText,
  acceptText,
  extraHandleReject,
  extraHandleAccept,
}: YesNoDialogProps) => {
  const [isAccept, setIsAccept] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleAccept = () => {
    setIsAccept(true);
    timerRef.current = setTimeout(() => {
      extraHandleAccept();
      timerRef.current = null;
    }, 1000);
  };

  const handleReject = () => {
    setIsOpen(false);
    extraHandleReject();
  };

  useEffect(() => {
    if (!isOpen) {
      setIsAccept(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle hidden>{title}</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full p-8 bg-white rounded-4xl"
      >
        {isAccept ? (
          <span className="flex justify-center items-center text-lg font-medium leading-tight py-5">
            {acceptedTitle}
          </span>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center gap-3 text-black-1">
              {title}
            </div>

            <DialogFooter className="flex flex-row gap-3.5">
              <button
                className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px]"
                onClick={handleReject}
              >
                {rejectText}
              </button>
              <button
                className="w-full bg-main text-white px-5 py-2.5 rounded-[8px]"
                onClick={handleAccept}
              >
                {acceptText}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
