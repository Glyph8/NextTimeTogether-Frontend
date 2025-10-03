import { z } from "zod";

export const userIdSchema = z
  .string()
  .min(5, "아이디는 5자 이상이어야 합니다.")
  .max(20, "아이디는 20자를 초과할 수 없습니다.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "아이디는 영어, 숫자, 언더바(_)만 사용할 수 있습니다."
  );

export const emailSchema = z
  .string()
  .max(50, "이메일은 50자를 초과할 수 없습니다.")
  .email("올바른 이메일 형식이 아닙니다.");

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .max(20, "비밀번호는 20자를 초과할 수 없습니다.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
    "비밀번호는 영어 대문자, 영어 소문자, 숫자를 모두 사용해야 합니다."
  );

export const nicknameSchema = z
  .string()
  .min(2, "닉네임은 2자 이상이어야 합니다.")
  .max(20, "닉네임은 20자를 초과할 수 없습니다.")
  .regex(/^[a-zA-Z0-9가-힣]+$/, "닉네임에는 특수문자를 사용할 수 없습니다.");

export const telephoneSchema = z
  .string()
  .regex(/^010-?\d{4}-?\d{4}$/, "올바른 휴대폰 번호 형식이 아닙니다.")
  .optional()
  .or(z.literal(""));

// --- 모듈화된 스키마들을 조합하여 전체 폼 스키마 생성 ---

export const userSignUpSchema = z
  .object({
    userId: userIdSchema,
    email: emailSchema,
    password: passwordSchema,
    // passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해주세요."),
    nickname: nicknameSchema,
    // wrappedDEK: z.string().min(1, "DEK 값이 비어있습니다."),
    telephone: telephoneSchema,
    age: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
  })
  // .refine((data) => data.password === data.passwordConfirm, {
  //   message: "비밀번호가 일치하지 않습니다.",
  //   path: ["passwordConfirm"],
  // });

// Zod 스키마로부터 TypeScript 타입을 자동으로 추론
export type UserSignUpDTO = z.infer<typeof userSignUpSchema>;
