"use server"; // 이 파일의 모든 함수는 서버에서만 실행되도록 명시

import { loginRequest } from "@/api/auth";
import { BaseResponse } from "@/apis/generated/Api";
import { redis } from "@/lib/redis";
import { setSessionCookie } from "@/lib/session";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/crypto/auth/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { encryptKey } from "@/utils/crypto/generate-key/manage-session-key";
import axios from "axios";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- 로그인 처리를 위한 메인 Server Action 함수 ---
export interface LoginActionState {
  error?: string | null; // 에러 메시지 (옵셔널 또는 null 가능)
  success?: string | null; // 성공 메시지 (옵셔널 또는 null 가능)
  // 필요하다면 다른 필드도 추가할 수 있습니다. ex) isLoading: boolean
}
const LOGIN_API_URL = "https://meetnow.duckdns.org/auth/login";
// const LOGIN_API_URL = "http://43.202.154.29:8083/auth/login";


export async function loginRequestWithCookie(userId : string, password:string): Promise<BaseResponse> {
  const cookieStore = await cookies();
  
  try {
    // 1. 외부 백엔드 API로 로그인 요청 (axios 사용)
    const response = await axios.post(LOGIN_API_URL, {
      userId,
      password,
    });

    // 2. 응답 헤더에서 토큰 추출
    const token = response.headers['authorization'];

    if (token) {
      // localStorage 대신 cookies()를 사용하여 토큰을 쿠키에 저장
      // httpOnly: true 옵션으로 자바스크립트 접근을 막아 훨씬 안전합니다.
      cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60, // 1시간
      });

      return response.data;
    } else {
      console.log('로그인 응답에서 토큰을 찾을 수 없음.');
      return { code: response.data.message || '로그인에 실패했습니다.' };
    }

  } catch (error) {
    console.error('로그인 액션에서 에러 발생', error);
    // 실제 에러 메시지를 반환하는 것이 더 좋습니다.
    return { result: '아이디 또는 비밀번호가 잘못되었습니다.' };
  }
  
}


export async function login(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  // 1. 기본적인 입력값 유효성 검사
  if (!userId || !password) {
    return { error: "아이디와 비밀번호를 모두 입력해주세요." };
  }

  try {

    const masterKey = await deriveMasterKeyPBKDF2(userId, password);
    const hashedUserId = await hmacSha256Truncated(masterKey, userId, 256);
    const hashedPassword = await hashPassword(masterKey, password);

    console.log("요청 전 데이터 점검 - masterkey = ", masterKey, 
      "해시된 아이디 : ", hashedUserId, " 해시된 비번 : ", hashedPassword);

    const loginResult = await loginRequestWithCookie(hashedUserId, hashedPassword);
    // const loginResult = await loginRequest(hashedUserId, hashedPassword);

    if (!loginResult || loginResult.code !== 200) {
      console.log("로그인 요청 응답에 문제 발생");
      return { error: "아이디 또는 비밀번호가 잘못되었습니다." };
    }

    console.log("✅ 로그인 성공!");
    // 2. 로그인 성공 시, 고유한 세션 토큰 생성

    // 마스터 키를 한번 더 암호화하는 경우.
    // const encryptedMasterKey = encryptKey(masterKey);

    // 그냥 마스터키를 쓰는 경우
    const decoder = new TextDecoder();
    const encryptedMasterKey = decoder.decode(masterKey);

    
    const cookieStore = await cookies();
    const sessionToken = randomBytes(32).toString("hex");

    // 세션 토큰 쿠키
    cookieStore.set("session-token", sessionToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    // 암호화된 키 쿠키 (별도 저장)
    cookieStore.set("encrypted-master-key", encryptedMasterKey, {
      httpOnly: true, // ✅ JavaScript 접근 불가
      secure: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    // Redis에는 키 저장 안 함
    const sessionData = { userId: hashedUserId };
    await redis.hset(`session:${sessionToken}`, sessionData);

    // const sessionToken = randomBytes(32).toString("hex");
    // 2. Redis에 저장할 데이터를 정의합니다.
    //    🚨 여기에는 절대 비밀번호나 개인키 같은 민감 정보를 저장하지 않습니다!
    // const sessionData = {
    //   userId: userId, // 사용자를 식별할 수 있는 ID
    //   key: masterKey,
    // };
    // 3. Redis에 세션 정보를 저장합니다. 토큰이 'Key'가 됩니다.
    //    - Key: "session:[세션토큰]"
    //    - Value: { userId: "..." }
    // await redis.hset(`session:${sessionToken}`, sessionData);
    // 4. 세션 만료 시간을 설정합니다. (예: 1시간)
    // await redis.expire(`session:${sessionToken}`, 3600);
    // await setSessionCookie(sessionToken)

    // 6. 모든 검증 통과! 로그인 성공 처리
  } catch (err) {
    console.error("로그인 처리 중 에러 발생:", err);
    console.log("!!!", err);
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
  redirect("/calendar"); // 성공 시 메인 페이지로 이동
}
