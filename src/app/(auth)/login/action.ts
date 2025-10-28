"use server"; // 이 파일의 모든 함수는 서버에서만 실행되도록 명시

// import { loginRequest } from "@/api/auth";
import { BaseResponse } from "@/apis/generated/Api";
import { redis } from "@/lib/redis";
// import { setSessionCookie } from "@/lib/session";
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
  accessToken?: string | null; // 클라이언트에 전달할 액세스 토큰
}
const LOGIN_API_URL = "https://meetnow.duckdns.org/auth/login";
// const LOGIN_API_URL = "http://43.202.154.29:8083/auth/login";

interface ContainAccessToken extends BaseResponse {
  tokenErrorMessage?: string;
  accessToken?: string;
}

export async function loginRequestWithCookie(
  userId: string,
  password: string
): Promise<ContainAccessToken> {
  const cookieStore = await cookies();

  try {
    // 1. 외부 백엔드 API로 로그인 요청 (axios 사용)
    const response = await axios.post(LOGIN_API_URL, {
      userId,
      password,
    });
    // 2. 응답 헤더에서 토큰 추출
    const accessToken = response.headers["authorization"];
    const setCookieHeader = response.headers["set-cookie"];
    if (!accessToken || !setCookieHeader) {
      return { tokenErrorMessage: "로그인에 실패했습니다. (토큰 없음)" };
    }
    // 서버에서 localStorage 사용이 불가한 경우, 쿠키로 사용.
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 https 강제
      maxAge: 60 * 60 * 2, // 2시간
      path: "/", // 사이트 전체에서 사용
    });
    // 리프레시 토큰은 httpOnly 쿠키에 저장 (보안 강화)
    // TODO : 'set-cookie'가 토큰 값만 반환해주면 더 좋을 듯.. 백엔드 팀!!!!!
    const refreshTokenValue = setCookieHeader[0].split(";")[0].split("=")[1];
    cookieStore.set("refresh_token", refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 https 강제
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/", // 사이트 전체에서 사용
    });

    return { ...response.data, accessToken: accessToken };
  } catch (error) {
    console.error("로그인 액션에서 에러 발생", error);
    // 실제 에러 메시지를 반환하는 것이 더 좋습니다.
    return { result: "아이디 또는 비밀번호가 잘못되었습니다." };
  }
}

export async function login(
  _prevState: LoginActionState,
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

    console.log(
      "요청 전 데이터 점검 - masterkey = ",
      masterKey,
      "해시된 아이디 : ",
      hashedUserId,
      " 해시된 비번 : ",
      hashedPassword
    );

    const loginResult = await loginRequestWithCookie(
      hashedUserId,
      hashedPassword
    );
    // const loginResult = await loginRequest(hashedUserId, hashedPassword);
    if (!loginResult || loginResult.code !== 200) {
      console.log("로그인 요청 응답에 문제 발생");
      return { error: "아이디 또는 비밀번호가 잘못되었습니다." };
    }

    console.log("✅ 로그인 성공!");

    // 마스터 키를 한번 더 암호화하는 경우.
    const encryptedMasterKey = encryptKey(masterKey);
    const encryptedUserId = encryptKey(userId);
    // 그냥 마스터키를 쓰는 경우
    // const decoder = new TextDecoder();
    // const encryptedMasterKey = decoder.decode(masterKey);

    const cookieStore = await cookies();

    // 암호화된 키 쿠키 (별도 저장)
    cookieStore.set("encrypted-master-key", encryptedMasterKey, {
      httpOnly: true, // ✅ JavaScript 접근 불가
      secure: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("encrypted-user-id", encryptedUserId, {
      httpOnly: true, // ✅ JavaScript 접근 불가
      secure: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    // 6. 모든 검증 통과! 로그인 성공 처리
    return {
      success: "로그인에 성공했습니다. 로그인 최종 단계 통과",
      accessToken: loginResult.accessToken,
    };
  } catch (err) {
    console.error("로그인 처리 중 에러 발생:", err);
    console.log("!!!", err);
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
