"use client";

// [수정] Next.js 전용 훅 대신 React의 훅만 사용합니다.
import React, { useEffect, useState } from "react";
import { joinGroupAction } from "./action";
// [수정] "./action" 임포트 제거
// import { joinGroupAction } from "./action"; // 2. 서버 액션

/**
 * [임시] 서버 액션(joinGroupAction)을 대체하는 비동기 모의 함수입니다.
 * 실제 환경에서는 이 함수를 별도의 파일과 API 호출로 분리해야 합니다.
 * @param token 초대 링크의 토큰
 */



export default function JoinGroupLoadingPage() {
  // [수정] Next.js의 router 훅 제거
  // const router = useRouter();

  // 3. UI 상태를 관리 (로딩, 성공, 에러)
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    // [수정] Next.js 훅 대신 Web API를 사용합니다.
    const searchParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname; // 현재 경로 (/group/join)

    // 1. 초대 토큰 가져오기
    const token = searchParams.get("token");

    // 4. useEffect 내부에 async 함수를 만들어 실행
    const processGroupJoin = async () => {
      if (!token) {
        setStatus("error");
        setError("유효하지 않은 초대 링크입니다.");
        // 에러가 나면 그룹 목록이나 메인으로 보낼 수 있습니다.
        // window.location.replace("/groups"); 
        return;
      }

      // 5. 클라이언트 스토리지에서 access_token 확인
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        // --- 시나리오 1: 로그인 된 상태 ---
        setStatus("joining"); // "그룹 가입 중..." 상태로 변경
        try {
          // 6. [수정] 임포트된 서버 액션 대신 모의 함수 호출
          const result = await joinGroupAction(token);

          if (result.success) {
            setStatus("success");
            // 7. 성공 시, 가입된 그룹 페이지로 이동
            // [수정] router.replace -> window.location.replace
            window.location.replace(`/group/${result.groupId}`);
          } else {
            // 8. 서버 액션이 실패한 경우 (예: 만료된 토큰)
            setStatus("error");
            setError(result.error || "그룹 가입에 실패했습니다.");
          }
        } catch (err) {
          // 9. access_token이 만료/위조된 경우 (서버 액션이 401 등 에러 throw)
          //    이 경우, 토큰을 삭제하고 로그인 페이지로 보냅니다.
          console.log(err);
          localStorage.removeItem("access_token");
          redirectToLogin();
        }
      } else {
        // --- 시나리오 2: 로그인 안 된 상태 ---
        redirectToLogin();
      }
    };

    const redirectToLogin = () => {
      setStatus("redirecting");
      // 10. "로그인 후 여기로 돌아와!" (callback URL 생성)
      // 현재 URL: /group/join?token=...
      const callbackUrl = `${pathname}?${searchParams.toString()}`;
      
      // 11. 로그인 페이지로 callbackUrl을 쿼리 파라미터로 넘기며 이동
      // [수정] router.replace -> window.location.replace
      window.location.replace(`/login?redirect_url=${encodeURIComponent(callbackUrl)}`);
    };

    processGroupJoin();
    
    // [수정] 의존성 배열에서 Next.js 훅 관련 변수 제거
  }, []);

  // 12. 상태에 따른 UI 렌더링
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-sm w-full text-center">
        {status === "loading" && (
          <p className="text-lg font-medium text-gray-700">초대 링크를 확인 중입니다...</p>
        )}
        {status === "joining" && (
          <p className="text-lg font-medium text-blue-600">그룹에 가입하는 중입니다...</p>
        )}
        {status === "redirecting" && (
          <p className="text-lg font-medium text-gray-700">로그인 페이지로 이동합니다...</p>
        )}
        {status === "success" && (
          <p className="text-lg font-medium text-green-600">그룹 가입 성공! 이동합니다...</p>
        )}
        {status === "error" && (
          <div>
            <p className="text-lg font-medium text-red-600">오류 발생</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        )}
        {(status === "loading" || status === "joining" || status === "redirecting") && (
           <div className="mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        )}
      </div>
    </div>
  );
}

