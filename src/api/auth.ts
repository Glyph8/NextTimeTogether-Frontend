// TODO : 추후 보안을 위해서 localStorage가 아닌 cookie로 토큰 관리할 수도 있음.
// import axios from "axios";
import { Api, BaseResponse, UserSignUpDTO } from "@/apis/generated/Api";

const api = new Api();

// login은 해당 페이지에서 직접 구현함.

/** sns 로그인 로직이 미완성인듯? */
export const snsLoginRequest = (userId: string, password: string) =>
  api.auth
    .login1({ userId: userId, password: password })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

export const signupRequest = async (
  signupData: UserSignUpDTO
): Promise<BaseResponse> =>
  api.auth
    .signUp(signupData)
    .then((response) => {
      console.log("##", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(signupData);
      console.error(error);
      throw error;
    });
