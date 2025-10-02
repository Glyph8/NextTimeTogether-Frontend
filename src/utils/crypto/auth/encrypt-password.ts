import argon2 from "argon2";
import { hmacSha256 } from "../base-func";

export const hashPassword = async (
  // masterkey: string,
  masterkey: ArrayBuffer | string,
  password: string
): Promise<string> => {
  /** 1. 해시함수(마스터키, 원본 비밀번호)로 블라인딩 */
  const blind = await hmacSha256(masterkey, password);

  /** 2. argon2 알고리즘으로 최종 해시 생성. */
  const hashedPassword = await argon2.hash(blind, {
    type: argon2.argon2id,
    hashLength: 32,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  return hashedPassword;
};
