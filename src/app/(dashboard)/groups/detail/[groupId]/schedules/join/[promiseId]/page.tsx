"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button/Button";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { joinPromise } from "@/api/promise-invite-join";
import { getMasterKey } from "@/utils/client/key-storage";

export default function JoinPromisePage() {
  const params = useParams<{ groupId: string; promiseId: string }>();
  const router = useRouter();

  const groupId = params.groupId;
  const userId = localStorage.getItem("hashed_user_id_for_manager");
  const decryptedUserId = localStorage.getItem("hashed_user_id_for_manager");

  // E2EE 키 복구
  const {
    groupKey,
    isPending: isKeyLoading,
    error: keyError,
  } = useGroupDetail(groupId);

  // 상태 관리: ready(참여 가능), joining(처리 중), success(완료), error(실패)
  const [status, setStatus] = useState<"loading" | "ready" | "joining" | "success" | "error">("loading");
  const [message, setMessage] = useState("초대 정보를 확인하고 있습니다...");

  // 1. 초기 진입 시 자격 증명만 체크 (자동 실행 X)
  useEffect(() => {
    // 로그인 체크
    if (!userId || !decryptedUserId) {
      const currentPath = `/groups/detail/${groupId}/schedules/join/${params.promiseId}${window.location.search}${window.location.hash}`;
      const encodedReturnUrl = encodeURIComponent(currentPath);
      router.push(`/login?returnUrl=${encodedReturnUrl}`);
      return;
    }

    // 그룹 정보 체크
    if (!groupId) {
      setStatus("error");
      setMessage("잘못된 접근입니다. (그룹 정보 누락)");
      return;
    }

    // 키 복구 상태 체크
    if (keyError) {
      setStatus("error");
      setMessage("그룹 멤버만 참여할 수 있습니다.\n(키 복호화 실패)");
      return;
    }

    if (isKeyLoading) {
      setMessage("그룹 보안 키를 확인하고 있습니다...");
      return;
    }

    // 모든 체크 통과 -> 참여 대기 상태로 변경
    if (groupKey) {
      setStatus("ready");
      setMessage("약속에 참여하시겠습니까?");
    }
  }, [userId, groupId, groupKey, isKeyLoading, keyError, router, params.promiseId, decryptedUserId]);

  // 2. 사용자가 버튼을 눌렀을 때 실행되는 실제 참여 로직
  const handleJoinClick = async () => {
    if (status !== "ready") return;

    try {
      setStatus("joining");
      setMessage("보안 정보를 암호화하여 참여 중입니다...");

      // URL Hash에서 키 추출
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1));
      const extractedKeyString = hashParams.get("pkey") || "";

      const masterKey = await getMasterKey();
      if (!masterKey) throw new Error("마스터 키 오류");

      // 클라이언트 암호화 수행
      const encPromiseId = await encryptDataClient(params.promiseId, masterKey, "promise_proxy_user");
      const encPromiseMemberId = await encryptDataClient(decryptedUserId!, masterKey, "promise_proxy_user");
      const encUserId = await encryptDataClient(decryptedUserId!, groupKey!, "group_sharekey");
      const encPromiseKey = await encryptDataClient(extractedKeyString, masterKey, "promise_proxy_user");

      // API 호출
      const result = await joinPromise({
        promiseId: params.promiseId,
        encPromiseId,
        encPromiseMemberId,
        encUserId,
        encPromiseKey,
      });

      if (result) {
        setStatus("success");
        setMessage("성공적으로 약속에 참여했습니다!");

        // 성공 후 이동
        router.push(
          `/groups/detail/${groupId}/schedules/detail/${params.promiseId}#pkey=${encodeURIComponent(extractedKeyString)}`
        );
      } else {
        throw new Error("서버 응답 없음");
      }
    } catch (e) {
      console.error(e);
      // 이미 참여한 경우도 성공으로 간주하여 이동 처리 (UX 고려)
      setStatus("error");
      setMessage("이미 참여했거나 처리에 실패했습니다.\n상세 페이지로 이동합니다.");

      setTimeout(() => {
        const hash = window.location.hash;
        // 실패/이미참여 시에도 키를 가지고 이동해야 내용을 볼 수 있음
        router.push(`/groups/detail/${groupId}/schedules/detail/${params.promiseId}${hash}`);
      }, 1500);
    }
  };

  return (
    <div className="h-dvh flex flex-col items-center justify-center px-4 bg-white text-center">
      {/* 1. 로딩 중 */}
      {(status === "loading" || status === "joining") && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main mb-6" />
          <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>
        </div>
      )}

      {/* 2. 에러 발생 */}
      {status === "error" && (
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-3 text-red-500">알림</h3>
          <p className="text-base text-gray-600 whitespace-pre-wrap leading-relaxed">{message}</p>
        </div>
      )}

      {/* 3. 참여 대기 (버튼 노출) */}
      {status === "ready" && (
        <div className="w-full max-w-xs space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">약속 초대</h2>
            <p className="text-gray-500">{message}</p>
          </div>

          <Button
            text="약속 참여하기"
            onClick={handleJoinClick}
            className="w-full py-4 text-lg font-bold shadow-lg transition-transform active:scale-95"
          />

          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 underline decoration-gray-300 underline-offset-4 hover:text-gray-600"
          >
            다음에 참여하기
          </button>
        </div>
      )}
    </div>
  );
}