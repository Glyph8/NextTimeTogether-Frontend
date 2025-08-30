// src/schemas/loginSchema.ts
import { z } from 'zod';

// 1. 유효성 검사 스키마를 정의합니다.
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일은 필수 입력 항목입니다.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하이어야 합니다.'),
});

// 2. 스키마로부터 TypeScript 타입을 추론합니다.
export type LoginFormInputs = z.infer<typeof loginSchema>;