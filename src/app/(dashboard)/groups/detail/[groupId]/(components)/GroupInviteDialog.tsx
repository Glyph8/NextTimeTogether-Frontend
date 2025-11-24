"use client";

import {
  getInviteEncENcNewMemberId,
  getInviteEncGroupsKeyRequest,
} from "@/api/group-invite-join";
import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GroupInviteDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
}

export const GroupInviteDialog = ({
  isOpen,
  setIsOpen,
  groupId,
}: GroupInviteDialogProps) => {
  const [inviteLink, setInviteLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열리면 초대 링크 생성 로직 실행
  useEffect(() => {
    if (!isOpen) return;
    if (inviteLink) return; // 이미 생성했으면 스킵

    const generateLink = async () => {
      setIsLoading(true);
      try {
        const masterKey = await getMasterKey();
        if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

        // 1. 그룹 ID 암호화 및 1단계 요청
        const encGroupId = await encryptDataClient(
          groupId,
          masterKey,
          "group_proxy_user"
        );
        const inviteResult1 = await getInviteEncENcNewMemberId({
          groupId,
          encGroupId,
        });

        if (!inviteResult1.encencGroupMemberId)
          throw new Error("초대 자격 증명 실패");

        // 2. 자격 증명 복호화 및 2단계 요청
        const encUserId = await decryptDataWithCryptoKey(
          inviteResult1.encencGroupMemberId,
          masterKey,
          "group_proxy_user"
        );
        const inviteReseult2 = await getInviteEncGroupsKeyRequest({
          groupId,
          encUserId,
        });

        if (!inviteReseult2.encGroupKey) throw new Error("그룹 키 획득 실패");

        // 3. 그룹 키 최종 복호화 (평문 획득)
        const realGroupKey = await decryptDataWithCryptoKey(
          inviteReseult2.encGroupKey,
          masterKey,
          "group_sharekey"
        );

        // TODO : 얻은 groupKey를 같이 줘야하는게 맞는 지 체크.
        // 4. 링크 생성 (Hash에 키 포함)
        const link = `${
          window.location.origin
        }/groups/join/${groupId}#key=${encodeURIComponent(realGroupKey)}`;
        setInviteLink(link);
      } catch (error) {
        console.error("초대 링크 생성 실패:", error);
        toast.error("초대 링크를 생성하지 못했습니다.");
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    generateLink();
  }, [isOpen, groupId, inviteLink]);

  // 3-1. 초대 링크 생성하여 초대할 대상에게 전달,
  // 3-2. 초대 대상은 링크를 눌러, 로그인 한다. (회원가입시의 이메일로 그룹 참여 메일이 온다)
  // 3-3. 메일의 group/member/save 링크를 눌러 post 요청..?

  const hanldeCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsOpen(false);
      toast("그룹 초대 링크를 클립보드에 복사했어요.");
    } catch (error) {
      toast("그룹 초대 링크를 복사하지 못했어요.");
      console.error("그룹 초대 링크 복사 실패", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className="sr-only">그룹 초대 링크 생성하기</DialogTitle>
      <DialogContent
        showCloseButton={false}
        className="w-full flex flex-col p-5 bg-white rounded-[28px] mx-auto"
      >
        <div className="w-full flex flex-col justify-center items-center gap-4 text-black-1 mb-5">
          <div className="text-lg font-medium leading-loose">
            그룹에 초대할 분께 링크를 보내주세요.
          </div>

          <div className="block w-full min-w-0 truncate text-sm font-normal leading-snug text-gray-2 ">
            {inviteLink}
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3.5">
          <Button
            text={isLoading ? "생성 중..." : "링크 복사"}
            disabled={false}
            onClick={hanldeCopyLink}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
