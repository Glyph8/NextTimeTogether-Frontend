"use client";

import React, { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { useGroupJoinRequest } from "./use-group-join";
import { useAuthStore } from "@/store/auth.store";

export default function JoinGroupRequestPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string; // URL에서 groupId 추출

  // 1. 로그인 상태를 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 2. 로그인 체크가 완료되었는지 관리 (중복 리디렉션 방지)
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const accessToken  = useAuthStore.getState().accessToken;
    // const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      // --- 시나리오 2: 로그인 안 된 상태 ---
      console.log("로그인 필요, 리디렉션 시작...");
      // "로그인 후 여기로 돌아와!" (callback URL 생성)
      // 현재 URL: /group/join/[groupId]
      const callbackUrl = window.location.pathname;
      
      // 로그인 페이지로 callbackUrl을 쿼리 파라미터로 넘기며 이동
      window.location.replace(`/login?redirect_url=${encodeURIComponent(callbackUrl)}`);
    }
    setAuthChecked(true); // 인증 체크 완료
  }, []);

  // 3. [수정] useGroupJoinRequest 훅 사용
  //    enabled: true (로그인 확인) 및 groupId (URL에서)
  const { 
    data: joinRequestEmail, 
    isLoading, 
    isError, 
    error 
  } = useGroupJoinRequest({
    groupId: groupId,
    // 4. [수정] 인증이 확인된 경우에만 훅을 실행
    enabledOption: authChecked && isAuthenticated, 
  });

  // 5. 상태에 따른 UI 렌더링
  let statusUI;
  
  if (!authChecked) {
    // 5-1. 인증 체크 중 (또는 리디렉션 직전)
    statusUI = (
      <>
        <p className="text-lg font-medium text-gray-700">로그인 상태를 확인 중입니다...</p>
        <div className="mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </>
    );
  } else if (isLoading) {
    // 5-2. 참가 신청(API 호출) 진행 중
    statusUI = (
      <>
        <p className="text-lg font-medium text-blue-600">그룹 참가 신청 중입니다...</p>
        <div className="mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </>
    );
  } else if (isError) {
    // 5-3. API 에러 발생
    statusUI = (
      <div>
        <p className="text-lg font-medium text-red-600">오류 발생</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : "알 수 없는 오류"}
        </p>
      </div>
    );
  } else if (joinRequestEmail) {
    // 5-4. 참가 신청 성공
    statusUI = (
      <div>
        <p className="text-lg font-medium text-green-600">참가 신청 완료!</p>
        <p className="text-sm text-gray-500 mt-2">
          그룹장의 승인을 기다려주세요.
        </p>
        <p className="text-xs text-gray-400 mt-2">(신청 이메일: {joinRequestEmail})</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-sm w-full text-center">
        {statusUI}
      </div>
    </div>
  );
}