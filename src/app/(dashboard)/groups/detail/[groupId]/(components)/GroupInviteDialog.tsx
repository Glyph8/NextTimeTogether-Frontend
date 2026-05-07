"use client";

import {
  GroupInvitePreconditionError,
  ensureGroupMemberMappingForInvite,
  getInviteEncNewMemberIdWithLookupFallback,
  getInviteEncGroupsKeyRequest,
} from "@/api/group-invite-join";
import {
  getLookupErrorType,
  getLookupRequestId,
  getLookupUserMessage,
} from "@/api/lookup-error";
import { Button } from "@/components/ui/button/Button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import { clearGroupLookupCacheForGroup } from "@/utils/client/group-lookup";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GroupInviteDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
  groupKey?: CryptoKey;
  encGroupKey?: string;
}

export const GroupInviteDialog = ({
  isOpen,
  setIsOpen,
  groupId,
  groupKey,
  encGroupKey,
}: GroupInviteDialogProps) => {
  const [inviteLink, setInviteLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [lookupNotFoundError, setLookupNotFoundError] = useState<string | null>(null);

  // 모달이 열리면 초대 링크 생성 로직 실행
  useEffect(() => {
    if (!isOpen) return;
    if (inviteLink) return; // 이미 생성했으면 스킵

    const generateLink = async (forceSync: boolean = false) => {
      setIsLoading(true);
      setLookupNotFoundError(null);
      try {
        const masterKey = await getMasterKey();
        if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");

        if (!groupKey || !encGroupKey) {
          throw new GroupInvitePreconditionError(
            "그룹 키 동기화가 완료되지 않아 초대를 시작할 수 없습니다."
          );
        }

        // 1. 그룹 ID 암호화 및 1단계 요청
        const encGroupId = await encryptDataClient(
          groupId,
          masterKey,
          "group_proxy_user"
        );

        if (forceSync || !inviteLink) {
          await ensureGroupMemberMappingForInvite({
            groupId,
            encGroupId,
            groupKey,
            encGroupKey,
            masterKey,
          });
        }

        const inviteResult1 = await getInviteEncNewMemberIdWithLookupFallback({
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

        // 4. 링크 생성 (Hash에 키 포함)
        const link = `${
          window.location.origin
        }/groups/join/${groupId}#key=${encodeURIComponent(realGroupKey)}`;
        setInviteLink(link);
      } catch (error) {
        const requestId = getLookupRequestId(error);
        console.error("초대 링크 생성 실패:", {
          requestId,
          error,
          groupId,
        });
        const errorType = getLookupErrorType(error);
        if (errorType === "CONFLICT" || errorType === "NOT_FOUND") {
          clearGroupLookupCacheForGroup(groupId);
        }

        if (errorType === "NOT_FOUND") {
          setLookupNotFoundError(
            `매핑 정보가 없어 초대를 진행할 수 없습니다. 동기화 후 다시 시도해주세요.${
              requestId ? ` (requestId: ${requestId})` : ""
            }`
          );
          return;
        }

        if (errorType === "INVALID_LOOKUP") {
          toast.error("요청 데이터 검증에 실패했습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        if (error instanceof GroupInvitePreconditionError) {
          toast.error(error.message);
          return;
        }

        toast.error(getLookupUserMessage(error, "초대 링크를 생성하지 못했습니다."));
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    generateLink();
  }, [isOpen, groupId, inviteLink, groupKey, encGroupKey, setIsOpen]);

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

          {lookupNotFoundError && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <p>{lookupNotFoundError}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium underline"
                onClick={() => {
                  void (async () => {
                    setInviteLink("");
                    setLookupNotFoundError(null);
                    setIsLoading(true);
                    try {
                      const masterKey = await getMasterKey();
                      if (!masterKey) throw new Error("마스터키를 찾을 수 없습니다.");
                      if (!groupKey || !encGroupKey) {
                        throw new GroupInvitePreconditionError(
                          "그룹 키 동기화가 완료되지 않아 재시도할 수 없습니다."
                        );
                      }

                      const encGroupId = await encryptDataClient(
                        groupId,
                        masterKey,
                        "group_proxy_user"
                      );
                      await ensureGroupMemberMappingForInvite({
                        groupId,
                        encGroupId,
                        groupKey,
                        encGroupKey,
                        masterKey,
                      });
                      const inviteResult1 = await getInviteEncNewMemberIdWithLookupFallback({
                        groupId,
                        encGroupId,
                      });
                      if (!inviteResult1.encencGroupMemberId) {
                        throw new Error("초대 자격 증명 실패");
                      }

                      const encUserId = await decryptDataWithCryptoKey(
                        inviteResult1.encencGroupMemberId,
                        masterKey,
                        "group_proxy_user"
                      );
                      const inviteReseult2 = await getInviteEncGroupsKeyRequest({
                        groupId,
                        encUserId,
                      });

                      if (!inviteReseult2.encGroupKey) {
                        throw new Error("그룹 키 획득 실패");
                      }

                      const realGroupKey = await decryptDataWithCryptoKey(
                        inviteReseult2.encGroupKey,
                        masterKey,
                        "group_sharekey"
                      );

                      const link = `${
                        window.location.origin
                      }/groups/join/${groupId}#key=${encodeURIComponent(realGroupKey)}`;
                      setInviteLink(link);
                    } catch (retryError) {
                      const requestId = getLookupRequestId(retryError);
                      toast.error(
                        `동기화 재시도에 실패했습니다.${
                          requestId ? ` (requestId: ${requestId})` : ""
                        }`
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  })();
                }}
              >
                동기화 후 재시도
              </button>
            </div>
          )}
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
