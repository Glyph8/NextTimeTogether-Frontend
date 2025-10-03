"use server";

import { signupRequest } from "@/api/auth";
import { UserSignUpDTO } from "@/apis/generated/Api";
import { userSignUpSchema } from "@/lib/schemas/signupSchema";
import { encryptEmailPhone } from "@/utils/crypto/auth/encrypt-email-number";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/crypto/auth/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { redirect } from "next/navigation";

export interface RegisterActionState {
  error?: string | null; // 에러 메시지 (옵셔널 또는 null 가능)
}

export async function register(
  prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = userSignUpSchema.safeParse(data);

  if (!validationResult.success) {
    // 유효성 검사 실패
    // console.log(validationResult.data)
    console.log(validationResult.error.issues);
    return {
      error: validationResult.error.issues.map((e) => e.message).join(", "),
    };
  }

  // 유효성 검사를 통과한 데이터
  const validatedData = validationResult.data;

  // telephone은 생략될 수도 있음.
  const { userId, email, password, telephone, nickname } = validatedData;

  try {
    const masterKey = await deriveMasterKeyPBKDF2(userId, password);
    const hashedUserId = await hmacSha256Truncated(masterKey, userId, 256);
    const hashedPassword = await hashPassword(masterKey, password);
    const hashedEmail = await encryptEmailPhone(masterKey, email);
    const hashedTelephone = await encryptEmailPhone(masterKey, telephone ?? "");

    // TODO : encryptEmailPhone에서 iv 값을 어떻게 써야 할지
    const hashedUserDTO: UserSignUpDTO = {
      userId: hashedUserId,
      email: hashedEmail.ciphertext,
      password: hashedPassword,
      nickname: nickname,
      telephone: hashedTelephone.ciphertext,
      wrappedDEK: Buffer.from(masterKey).toString("base64"),
    };

     const signupResult = await signupRequest(hashedUserDTO);

    if (!signupResult || signupResult.code !== 200) {
      console.log("회원가입 요청 실패:", signupResult);
      return { error: signupResult?.message || "회원가입에 실패했습니다." };
    }

    console.log("✅ 회원가입 성공!");
  } catch (err) {
    console.error("로그인 처리 중 에러 발생:", err);
    // redirect 에러는 정상적인 흐름이므로 다시 throw
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      throw err;
    }
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
  redirect("/complete-signup"); // 성공 시 회원가입 완료 페이지로 이동
}
