"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/client/crypto/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { login, LoginActionState } from "../action";
import { storeMasterKey } from "@/utils/client/key-storage";
import { arrayBufferToBase64 } from "@/utils/client/helper";
import { useAuthStore } from "@/store/auth.store";

export const useLogin = () => {
  // --- 1. 기본 상태 및 훅 ---
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 서버 액션 상태
  const initialState: LoginActionState = { error: null, success: false, accessToken: null  };
  const [state, setState] = useState<LoginActionState>(initialState);

  // 로딩(Pending) 상태
  const [isPending, startTransition] = useTransition();
  
  // --- 2. 폼 제출 핸들러 (E2EE 암호화 로직 포함) ---
  // const handleSubmit = async (formData: FormData) => {
  // --- middleWare 도입으로 인한 충돌 가시화 대처.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(initialState);
    const formData = new FormData(event.currentTarget);
    try {
      // 1. (클라이언트) 마스터 키 파생
      const masterKey = await deriveMasterKeyPBKDF2(id, pw);

      // 2. (클라이언트) 서버 인증용 해시 생성
      const hashedUserId = await hmacSha256Truncated(masterKey, id, 256);
      const hashedPassword = await hashPassword(pw, masterKey);

      // 3. 서버 액션에 전달할 FormData 수정
      formData.set("hashedUserId", hashedUserId);
      formData.set("hashedPassword", hashedPassword);
      formData.delete("userId");
      formData.delete("password");

      // 4. 서버 액션 실행 (트랜지션 시작)
      startTransition(async () => {
        const result = await login(formData);
        setState(result);
      });

    } catch (err) {
      console.error("클라이언트 암호화 실패:", err);
      setState({ error: "암호화 중 오류가 발생했습니다." });
    }
  };

  // --- 3. 서버 액션 '성공' 시 후처리 (키 저장, 리다이렉트) ---
  useEffect(() => {
    if (state.success && state.accessToken) {
      console.log("로그인 성공! MasterKey를 IndexedDB에 저장합니다...");
       const newAccessToken = state.accessToken;
      (async () => {
        try {
          // 1. AccessToken을 Zustand 전역 상태(메모리)에 저장
          setAccessToken(newAccessToken);
          // 서버 인증 성공 시, 사용했던 id/pw로 masterKey 재파생
          const masterKey = await deriveMasterKeyPBKDF2(id, pw);
          // IndexedDB에 '추출 불가' 키로 저장
          await storeMasterKey(masterKey);
          
          // TODO : 리프레쉬 로직 완성될 떄까지 임시 사용
          localStorage.setItem('access_token', newAccessToken)
          
          // 모든 것이 성공하면 페이지 이동
          router.push("/calendar");

        } catch (err) {
          console.error("MasterKey 저장 또는 리다이렉트 실패", err);
          setState({ error: "로그인 중 오류가 발생했습니다." });
        }
      })();
    }
  }, [state, router, id, pw]); // id, pw 의존성 포함

  // --- 4. 훅이 반환하는 값들 ---
  return {
    id,
    setId,
    pw,
    setPw,
    handleSubmit,       // <form action={...}>에 전달할 함수
    isPending,          // 로딩 상태
    error: state.error
  };
};