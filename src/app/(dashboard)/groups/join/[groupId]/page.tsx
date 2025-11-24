"use client";

import React from "react";
import { useJoinGroup } from "./use-join-group";

export default function JoinGroupRequestPage() {
  // 커스텀 훅에서 로직 가져오기
  const { status, handleJoinClick, router } = useJoinGroup();

  // --- UI 렌더링 ---
  if (status === "CHECKING") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-gray-500">초대장 확인 중...</p>
      </div>
    );
  }

  if (status === "ERROR") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-red-500">초대 링크 오류</h2>
        <p className="mt-2 text-gray-600">
          링크가 만료되었거나 잘못되었습니다.
        </p>
        <button onClick={() => router.push("/")} className="mt-4 underline">
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">그룹 초대</h1>
        <p className="mb-6 text-gray-500">
          보안 키가 확인되었습니다.
          <br />
          아래 버튼을 눌러 그룹에 참여하세요.
        </p>

        {/* 보안 안내 배지 */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          🔒 <span>안전하게 암호화되어 접속됩니다.</span>
        </div>

        <button
          onClick={handleJoinClick}
          disabled={status === "JOINING"}
          className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {status === "JOINING" ? "가입 처리 중..." : "그룹 참여하기"}
        </button>
      </div>
    </div>
  );
}