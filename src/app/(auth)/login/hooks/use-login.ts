import { loginRequest } from "@/api/auth";
import { hmacSha256Truncated } from "@/utils/crypto/auth/encrypt-id-img";
import { hashPassword } from "@/utils/crypto/auth/encrypt-password";
import { deriveMasterKeyPBKDF2 } from "@/utils/crypto/generate-key/derive-masterkey";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [warnMsg, setWarnMsg] = useState("");

  const getMaskterkey = async (id: string, pw: string) => {
    return await deriveMasterKeyPBKDF2(id, pw);
  };

  const getHashedId = async (id: string, masterKey: ArrayBuffer) => {
    const encryptedId = hmacSha256Truncated(masterKey, id, 128);
    return encryptedId;
  };

  const getHashedPw = async (pw: string, maskterKey: ArrayBuffer) => {
    const encryptedPw = hashPassword(maskterKey, pw);
    return encryptedPw;
  };

  const handleLogin = async () => {
    const masterKey = await getMaskterkey(id, pw);
    const hashedId = await getHashedId(id, masterKey);
    const hashedPw = await getHashedPw(pw, masterKey);

    await loginRequest(hashedId, hashedPw)
      .then((res) => {
        // 에러 응답이 와도 main 진입하는 문제 해결 필요
        console.log("로그인 성공 res : ", res);
        if (res) router.push("/calendar");
        else alert("로그인에서 문제 발생. 토큰 관련 오류 추정");
      })
      .catch((err) => {
        console.log("로그인 실패", err);
        setWarnMsg("일치하지 않는 ID, 비밀번호 입니다.");
      });
  };

  return{
    id, setId, pw, setPw, warnMsg, setWarnMsg, handleLogin
  }
};
