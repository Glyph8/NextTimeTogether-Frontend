import argon2 from "argon2";
import { hmacSha256 } from "../base-func";
// import { hmacSha256Truncated } from "./encrypt-id-img";

export const hashPassword = async (
  // masterkey: string,
  masterkey: ArrayBuffer | string,
  password: string
): Promise<string> => {
  /** 1. 해시함수(마스터키, 원본 비밀번호)로 블라인딩 */

  const blind = await hmacSha256(
    typeof masterkey === "string" ? masterkey : Buffer.from(masterkey),
    password
  );

  /** 2. argon2 알고리즘으로 최종 해시 생성. */
  const hashedPassword = await argon2.hash(blind, {
    type: argon2.argon2id,
    hashLength: 32,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    // TODO : 서버에서 verify 하도록하는 기능을 추가해줘야 한다.. 일단은 salt 고정하여 해결
    salt: Buffer.alloc(16, 0), // 고정된 salt 사용
    raw: true, // 인코딩 없이 raw 해시만 반환
  });
  // return hashedPassword;
  return hashedPassword.toString('base64');
};
