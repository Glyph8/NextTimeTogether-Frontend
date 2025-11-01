"use server";

import { signupRequest } from "@/api/auth";
import { UserSignUpDTO } from "@/apis/generated/Api";
import { redirect } from "next/navigation";
import axios from "axios";

export interface RegisterActionState {
  success?: boolean;
  error?: string | null;
}

/**
 * (수정됨) E2EE 회원가입 서버 액션
 * 이 함수는 이제 '암호화된' DTO를 클라이언트로부터 전달받아
 * 메인 백엔드로 그대로 전달(Passthrough)하는 역할만 합니다.
 * * @param userDto 클라이언트에서 *이미* 암호화/해시된 UserSignUpDTO
 */
export async function registerAction(
  userDto: UserSignUpDTO 
): Promise<RegisterActionState> {

  // 1. (BFF -> 백엔드) BFF는 DTO의 내용을 모른 채 메인 백엔드로 전달
  try {
    console.log("=== BFF가 메인 백엔드로 전달하는 DTO ===");
    console.log(JSON.stringify(userDto, null, 2));

    // 'signupRequest'는 axios 인스턴스를 사용한다고 가정
    const signupResult = await signupRequest(userDto);

    if (!signupResult || signupResult.code !== 200) {
      console.log("회원가입 요청 실패:", signupResult);
      return { success: false, error: signupResult?.message || "회원가입에 실패했습니다." };
    }

    console.log("✅ 회원가입 성공!");
    
  } catch (err) {
    console.error("BFF 회원가입 액션 처리 중 에러:", err);

    let errorMessage = "서버 오류가 발생했습니다.";
    if (axios.isAxiosError(err) && err.response) {
      // 메인 백엔드가 보낸 에러 메시지 (e.g., "이미 존재하는 ID입니다.")
      errorMessage = err.response.data?.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }

  // 2. 성공 시
  // (참고: Server Action에서 redirect()는 try-catch 블록 *바깥*에서 호출되어야 함)
  redirect("/complete-signup"); 
  
  // redirect()가 호출되면 이 부분은 실행되지 않지만, 타입 일관성을 위해 추가
  return { success: true };
}

// import { signupRequest } from "@/api/auth";
// import { UserSignUpDTO } from "@/apis/generated/Api";
// import { userSignUpSchema } from "@/lib/schemas/signupSchema";
// import { encryptEmailPhone } from "@/utils/crypto/auth/encrypt-email-number";
// import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
// import { hashPassword } from "@/utils/client/crypto/encrypt-password";
// import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
// import { redirect } from "next/navigation";

// export interface RegisterActionState {
//   error?: string | null; // 에러 메시지 (옵셔널 또는 null 가능)
// }

// export async function register(
//   prevState: RegisterActionState,
//   formData: FormData
// ): Promise<RegisterActionState> {
//   // 1. FormData 내용 확인
//   console.log("=== FormData entries ===");
//   for (const [key, value] of formData.entries()) {
//     console.log(`${key}:`, value);
//   }

//   // const data = Object.fromEntries(formData.entries());
//   const data = {
//     userId: formData.get("userId"),
//     password: formData.get("password"),
//     email: formData.get("email"),
//     age: formData.get("age"),
//     gender: formData.get("gender"),
//     nickname: formData.get("nickname"),
//     telephone: formData.get("telephone"),
//   };
//   console.log("=== 변환된 data 객체 ===", data);
//   const validationResult = userSignUpSchema.safeParse(data);

//   if (!validationResult.success) {
//     // 유효성 검사 실패
//     // console.log(validationResult.data)
//     console.log(validationResult.error.issues);
//     return {
//       error: validationResult.error.issues.map((e) => e.message).join(", "),
//     };
//   }

//   // 유효성 검사를 통과한 데이터
//   const validatedData = validationResult.data;
//   console.log("=== 유효성 검사 통과 ===", validatedData);
//   const { userId, email, password, telephone, nickname, age, gender } =
//     validatedData;

//   try {
//     const masterKey = await deriveMasterKeyPBKDF2(userId, password);
//     const hashedUserId = await hmacSha256Truncated(masterKey, userId, 256);
//     const hashedPassword = await hashPassword(masterKey, password);
//     const hashedEmail = await encryptEmailPhone(masterKey, email);
//     const hashedTelephone = await encryptEmailPhone(masterKey, telephone ?? "");

//     // TODO : encryptEmailPhone에서 iv 값을 어떻게 써야 할지
//     const hashedUserDTO: UserSignUpDTO = {
//       // userId: hashedUserId.ciphertext,
//       // imgIv: hashedUserId.iv,
//       userId: hashedUserId,
//       imgIv: 'hashedUserId.iv',
//       email: hashedEmail.ciphertext,
//       emailIv: hashedEmail.iv,
//       password: hashedPassword,
//       nickname: nickname,
//       telephone: hashedTelephone.ciphertext,
//       phoneIv: hashedTelephone.iv,
//       age: age,
//       gender: gender,
//     };

//     console.log("=== API 전송 직전 DTO ===");
//     console.log(JSON.stringify(hashedUserDTO, null, 2));
//     console.log("=== DTO 타입 체크 ===");
//     console.log("typeof hashedUserDTO:", typeof hashedUserDTO);
//     console.log(
//       "hashedUserDTO instanceof FormData:",
//       hashedUserDTO instanceof FormData
//     );

//     const signupResult = await signupRequest(hashedUserDTO);
//     // const signupResult = await signupRequest(userDto);
//     if (!signupResult || signupResult.code !== 200) {
//       console.log("회원가입 요청 실패:", signupResult);
//       return { error: signupResult?.message || "회원가입에 실패했습니다." };
//     }

//     console.log("✅ 회원가입 성공!");
//   } catch (err) {
//     console.error("회원가입 처리 중 에러 발생:", err);
//     // redirect 에러는 정상적인 흐름이므로 다시 throw
//     if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
//       throw err;
//     }
//     return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
//   }
//   redirect("/complete-signup"); // 성공 시 회원가입 완료 페이지로 이동
// }
