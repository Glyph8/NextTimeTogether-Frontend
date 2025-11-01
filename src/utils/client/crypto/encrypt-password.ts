"use client";

// import { hash} from "argon2-browser";
// SSR 환경과 충돌함.. server인지 스스로 검사하는 과정이 있음

import { arrayBufferToBase64} from "@/utils/client/helper";

export const hashPassword = async (
  password: string,
  saltKey: ArrayBuffer
): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // 2. PBKDF2 '키' 임포트 (원본 비밀번호)
    const baseKey = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // 3. PBKDF2로 256비트(32바이트) 해시 파생
    // (마스터키 생성시와 Iteration을 다르게 설정하는 것이 좋음)
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltKey,
        iterations: 200000, // 인증용 해시 Iteration
        hash: "SHA-256",
      },
      baseKey,
      256 // 256비트
    ); // 결과는 ArrayBuffer

    // 4. ArrayBuffer를 Base64로 변환하여 반환
    return arrayBufferToBase64(derivedBits);

  } catch (err) {
    console.error("PBKDF2 해싱 실패:", err);
    throw new Error("비밀번호 해싱 중 오류가 발생했습니다.");
  }
};
