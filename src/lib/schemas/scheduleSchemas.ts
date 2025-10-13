// src/schemas/loginSchema.ts
import { z } from 'zod';

// 1. 유효성 검사 스키마를 정의합니다.
export const scheduleSchema = z.object({
  topic: z
    .string()
    .min(1, '약속 주제는 필수 입력 항목입니다.'),
//   password: z
//     .string()
//     .min(8, '비밀번호는 8자 이상이어야 합니다.')
//     .max(20, '비밀번호는 20자 이하이어야 합니다.'),
});

// 2. 스키마로부터 TypeScript 타입을 추론합니다.
export type ScheduleFormInputs = z.infer<typeof scheduleSchema>;