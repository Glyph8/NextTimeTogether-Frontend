import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
// import LinkIcon from "@/assets/svgs/icons/link.svg";

interface SharePromiseProps {
  promiseId: string;
  groupId: string;
  // promiseKey: CryptoKey | null;
  promiseKey: string | null;
  onClose: () => void; // 부모에서 전달받은 router.push 함수 실행
}

export default function SharePromise({
  promiseId,
  groupId,
  promiseKey,
  onClose,
}: SharePromiseProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  // 초대 링크: 로그인 리다이렉트 처리를 위해 groupId 필수
  // const inviteLink = `${window.location.origin}/schedules/join/${promiseId}?groupId=${groupId}`;

  useEffect(() => {
    const generateLink = async () => {
      if (!promiseKey) return;
      // 3. URL Hash에 키 포함 (#pkey=...)
      // URL Encoding 필수 (Base64에 특수문자가 포함될 수 있음)
      const encodedKey = encodeURIComponent(promiseKey);

      // [수정된 경로 구조 반영]
      // SharePromise.tsx 예시
      const link = `${window.location.origin}/groups/detail/${groupId}/schedules/join/${promiseId}#pkey=${encodedKey}`;
      setInviteLink(link);
    };

    generateLink();
  }, [promiseId, groupId, promiseKey]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center h-full">
      <div className="mb-6 p-4 bg-main/10 rounded-full">
        <div className="w-8 h-8 bg-main rounded-full" />
      </div>

      <h2 className="text-xl font-bold text-black-1 mb-2">
        약속이 생성되었어요!
      </h2>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">
        아래 링크를 공유하여
        <br />
        그룹원들을 바로 초대해보세요.
      </p>

      <div className="w-full bg-gray-50 p-4 rounded-xl flex items-center justify-between gap-3 mb-8 border border-gray-200 shadow-sm">
        <span className="text-sm text-gray-600 truncate flex-1 text-left font-medium">
          {inviteLink}
        </span>
        <button
          onClick={handleCopy}
          className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${isCopied
            ? "bg-green-500 text-white"
            : "bg-main text-white hover:bg-main/90"
            }`}
        >
          {isCopied ? "복사됨" : "복사"}
        </button>
      </div>

      <div className="w-full flex justify-center">
        {/* 버튼 텍스트 변경: 목록 이동 -> 상세 이동 */}
        <Button text="확인 (상세 페이지로 이동)" onClick={onClose} />
      </div>
    </div>
  );
}
