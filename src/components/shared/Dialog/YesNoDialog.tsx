import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, useEffect, useRef, useState } from "react";
// cn (classnames) 유틸리티가 있다면 사용하는 것이 좋지만, 여기선 템플릿 리터럴로 처리합니다.

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
      {/* 접근성을 위해 Visually Hidden 처리된 Title은 유지 */}
      <DialogTitle hidden>{typeof title === 'string' ? title : '알림'}</DialogTitle>

      <DialogContent
        showCloseButton={false}
        // [수정 1] max-w-sm 등으로 모달의 최대 너비를 고정하여 화면이 넓어도 퍼지지 않게 함
        // [수정 2] max-h-[80vh] 등으로 너무 길어지면 뷰포트 밖으로 나가지 않게 제한
        className="w-full max-w-sm p-8 bg-white rounded-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {isAccept ? (
          <span className="flex justify-center items-center text-lg font-medium leading-tight py-5 text-center break-keep">
            {acceptedTitle}
          </span>
        ) : (
          <>
            {/* [수정 3] overflow-y-auto: 내용이 길면 스크롤 생성 */}
            <div className="flex flex-col justify-center items-center gap-3 text-black-1 overflow-y-auto px-1">
              {/* [수정 4] 텍스트 스타일링 강화 */}
              <div className="text-center break-keep whitespace-pre-wrap">
                {title}
              </div>
            </div>

            {/* Footer는 스크롤 되어도 항상 하단에 고정되도록 flex 구조상 분리 */}
            <DialogFooter className="flex flex-row gap-3.5 mt-6 shrink-0">
              <button
                className="w-full bg-gray-3 text-gray-1 px-5 py-2.5 rounded-[8px] whitespace-nowrap"
                onClick={handleReject}
              >
                {rejectText}
              </button>
              <button
                className="w-full bg-main text-white px-5 py-2.5 rounded-[8px] whitespace-nowrap"
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