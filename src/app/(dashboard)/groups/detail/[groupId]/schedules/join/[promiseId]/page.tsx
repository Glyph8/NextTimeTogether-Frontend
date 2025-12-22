"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button/Button";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";
import { invitePromiseService } from "../../create/utils/join-promise";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { joinPromise } from "@/api/promise-invite-join";
import { getMasterKey } from "@/utils/client/key-storage";

export default function JoinPromisePage() {
  const params = useParams<{ groupId: string; promiseId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 groupId 추출
  const groupId = params.groupId;
  const { userId } = useAuthStore();

  // E2EE 키 복구 훅 (groupId가 있어야 동작)
  const {
    groupKey,
    isPending: isKeyLoading,
    error: keyError,
  } = useGroupDetail(groupId);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("보안 정보를 확인하고 있습니다...");
  const decryptedUserId = localStorage.getItem("hashed_user_id_for_manager");

  // 중복 실행 방지 락
  const isJoinAttempted = useRef(false);

  useEffect(() => {
    const handleJoin = async () => {
      // 0. URL Hash에서 Promise Key 추출 (#pkey=...)
      // window 객체는 클라이언트 사이드에서만 접근 가능하므로 useEffect 내부에서 실행
      const hash = window.location.hash; // 예: "#pkey=BASE64STRING..."
      let extractedKeyString = "";

      if (hash) {
        // # 제거 후 파싱
        const hashParams = new URLSearchParams(hash.substring(1));
        extractedKeyString = hashParams.get("pkey") || "";
      }

      // 키가 URL에 없으면 -> 이미 멤버이거나, 잘못된 링크일 수 있음 (일단 진행해보고 실패 시 처리)
      // 하지만 초대 흐름에서는 키가 필수이므로 체크하는 것이 좋음.
      if (!extractedKeyString) {
        console.warn(
          "URL에 약속 키가 없습니다. 기존 멤버인지 확인이 필요할 수 있습니다."
        );
      }

      // 1. 로그인 체크 및 리다이렉트 처리
      if (!userId || !decryptedUserId) {
        // [중요] 로그인 후 돌아올 때 Hash(#pkey=...)까지 포함해야 키를 잃어버리지 않음
        // window.location.search는 '?groupId=...' 부분을 포함하지 않을 수 있음
        const currentPath = `/groups/detail/${groupId}/schedules/join/${params.promiseId}${window.location.search}${window.location.hash}`;
        const encodedReturnUrl = encodeURIComponent(currentPath);

        router.push(`/login?returnUrl=${encodedReturnUrl}`);
        return;
      }

      // 2. 잘못된 접근(링크 손상) 체크
      if (!groupId) {
        setStatus("error");
        setMessage("잘못된 접근입니다. (그룹 정보 누락)");
        return;
      }

      // 3. 키 복구 중
      if (isKeyLoading) {
        setMessage("그룹 보안 키를 복호화하고 있습니다...");
        return;
      }

      // 4. 키 복구 실패
      if (keyError || !groupKey) {
        setStatus("error");
        setMessage("그룹 멤버만 참여할 수 있습니다.\n(키 복호화 실패)");
        return;
      }

      // 5. 키 확보 완료 -> 약속 참여 시도
      if (!isJoinAttempted.current) {
        isJoinAttempted.current = true;

        try {
          setMessage("약속 목록에 추가하는 중입니다...");

          const masterKey = await getMasterKey();
          if (!masterKey) {
            throw new Error("마스터 키를 불러올 수 없습니다.");
          }

          const encPromiseId = await encryptDataClient(
            params.promiseId,
            masterKey,
            "promise_proxy_user"
          );
          const encPromiseMemberId = await encryptDataClient(
            decryptedUserId,
            masterKey,
            "promise_proxy_user"
          );

          const encUserId = await encryptDataClient(
            decryptedUserId,
            groupKey,
            "group_sharekey"
          );
          const encPromiseKey = await encryptDataClient(
            extractedKeyString,
            masterKey,
            "promise_proxy_user"
          );

          const result = await joinPromise({
            promiseId: params.promiseId,
            encPromiseId: encPromiseId,
            encPromiseMemberId: encPromiseMemberId,
            encUserId: encUserId,
            encPromiseKey: encPromiseKey,
          });

          if (result) {
            setStatus("success");
            setMessage("성공적으로 약속에 참여했습니다!");

            // [수정 1] 성공 시 목록이 아닌 '해당 약속의 상세 페이지'로 이동
            router.push(
              `/groups/detail/${groupId}/schedules/detail/${
                params.promiseId
              }#pkey=${encodeURIComponent(extractedKeyString)}`
            );
          } else {
            throw new Error("서버 응답 없음");
          }
        } catch (e) {
          console.error(e);
          setStatus("error");
          setMessage("참여에 실패했거나 이미 참여한 약속입니다.");
          // 이미 참여한 경우라도 상세 페이지로 이동시켜주는 것이 UX상 좋음
          setTimeout(() => {
            router.push(
              `/groups/detail/${groupId}/schedules/detail/${
                params.promiseId
              }#pkey=${encodeURIComponent(extractedKeyString)}`
            );
          }, 1500);
        }
      }
    };

    handleJoin();
  }, [
    userId,
    groupId,
    params.promiseId,
    groupKey,
    isKeyLoading,
    keyError,
    router,
  ]);

  // 로딩 중이거나 자동 이동 전 보여줄 UI
  return (
    <div className="h-dvh flex flex-col items-center justify-center px-4 bg-white text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main mb-6" />
          <p className="text-gray-400 text-sm font-medium animate-pulse">
            약속 정보를 확인하고 있습니다...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-3 text-red-500">참여 실패</h3>
          <p className="text-base text-gray-600 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>
        </div>
      )}

      {status !== "loading" && (
        <div className="w-full max-w-xs">
          <Button
            text={status === "success" ? "약속 바로가기" : "홈으로 돌아가기"}
            onClick={() => {
              if (status === "success" || message.includes("이미 참여")) {
                // [수정 3] 버튼 클릭 시에도 변경된 경로로 이동
                // 여기서도 키를 유지하고 싶다면 hash 추가
                const hash = window.location.hash;
                router.push(
                  `/groups/detail/${groupId}/schedules/detail/${params.promiseId}${hash}`
                );
              } else {
                router.push("/");
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
