"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button/Button";
import { useGroupDetail } from "@/app/(dashboard)/groups/detail/[groupId]/hooks/use-group-detail";
import { invitePromiseService } from "../../create/[groupId]/utils/join-promise";

export default function JoinPromisePage() {
  const params = useParams<{ promiseId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 groupId 추출
  const groupId = searchParams.get("groupId");
  const { userId } = useAuthStore();

  // E2EE 키 복구 훅 (groupId가 있어야 동작)
  const {
    groupKey,
    isPending: isKeyLoading,
    error: keyError,
  } = useGroupDetail(groupId);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("보안 정보를 확인하고 있습니다...");

  // 중복 실행 방지 락
  const isJoinAttempted = useRef(false);

  useEffect(() => {
    const handleJoin = async () => {
      // 1. 로그인 체크 및 리다이렉트 처리
      if (!userId) {
        // 현재 페이지의 전체 경로(쿼리 파라미터 포함)를 저장
        const currentPath = `/schedules/join/${params.promiseId}?groupId=${groupId}`;
        const encodedReturnUrl = encodeURIComponent(currentPath);
        
        // 로그인 페이지로 이동하되, 로그인 성공 후 돌아올 주소를 넘겨줌
        // (참고: 로그인 페이지에서 returnUrl 쿼리 파라미터를 처리해야 함)
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

          const result = await invitePromiseService(
            userId,
            params.promiseId,
            groupKey
          );

          if (result) {
            setStatus("success");
            setMessage("성공적으로 약속에 참여했습니다!");
            
            // [수정 1] 성공 시 목록이 아닌 '해당 약속의 상세 페이지'로 이동
            router.push(`/schedules/detail/${params.promiseId}`);
          } else {
            throw new Error("서버 응답 없음");
          }
        } catch (e) {
          console.error(e);
          setStatus("error");
          setMessage("참여에 실패했거나 이미 참여한 약속입니다.");
        }
      }
    };

    handleJoin();
  }, [userId, groupId, params.promiseId, groupKey, isKeyLoading, keyError, router]);

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
      
      {/* 성공 시엔 useEffect에서 router.push가 일어나지만, 
          혹시 모를 딜레이나 수동 이동을 위해 버튼 유지 (경로 수정됨) */}
      {status !== "loading" && (
        <div className="w-full max-w-xs">
          <Button
            text={status === "success" ? "약속 바로가기" : "홈으로 돌아가기"}
            onClick={() => {
              if (status === "success") {
                router.push(`/schedules/detail/${params.promiseId}`);
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