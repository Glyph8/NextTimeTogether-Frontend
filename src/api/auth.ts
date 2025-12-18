import { Api, BaseResponse, UserSignUpDTO } from "@/apis/generated/Api";
import { clientBaseApi } from ".";

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

/** /api/v1/calendar/view1 : timeStampInfo 리스트로 encTimeStamp 리스트를 조회 */
export const logoutRequest = async () => {
  return clientBaseApi.auth
    .logout()
    .then((response) => {
      console.log("로그아웃 응답 : ", response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답을 받지 못한 경우
        console.error("API Error Request:", error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생한 경우
        console.error("API Error Message:", error.message);
      }
      console.error("API Error Config:", error.config); // 어떤 요청이었는지 확인
      throw error;
    });
};
