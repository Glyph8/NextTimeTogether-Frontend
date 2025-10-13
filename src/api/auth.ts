// TODO : 추후 보안을 위해서 localStorage가 아닌 cookie로 토큰 관리할 수도 있음.
import axios from "axios";
import { Api, BaseResponse, UserSignUpDTO } from "@/apis/generated/Api";

const api = new Api();
// const LOGIN_API_URL = "https://meetnow.duckdns.org/auth/login";
const LOGIN_API_URL = "http://43.202.154.29:8083/auth/login";

export const loginRequest = async (
  userId: string,
  password: string
): Promise<BaseResponse> =>
  axios
    .post(LOGIN_API_URL, {
      userId: userId,
      password: password,
    })
    .then((response) => {
      console.log("login api : ", response);
      if (response.headers["authorization"]) {
        localStorage.setItem("access_token", response.headers["authorization"]);
        // return true;
        return response.data;
      }
      console.log("로그인 응답에서 토큰을 찾을 수 없음.");
      return response.data;
    })
    .catch((error) => {
      console.error("auth.ts 로그인에서 에러 발생", error);
      throw new Error(error);
    });

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
