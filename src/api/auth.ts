import { Api, BaseResponse, UserSignUpDTO } from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";

const api = new Api();

// login은 해당 페이지에서 직접 구현함.

/** sns 로그인 로직이 미완성인듯? */
export const snsLoginRequest = (userId: string, password: string) =>
  api.auth
    .login1({ userId, password })
    .then((response) => response.data)
    .catch(() => false);

export const signupRequest = async (
  signupData: UserSignUpDTO
): Promise<BaseResponse> =>
  api.auth
    .signUp(signupData)
    .then((response) => response.data)
    .catch(handleApiError);

/** /api/v1/calendar/view1 : timeStampInfo 리스트로 encTimeStamp 리스트를 조회 */
export const logoutRequest = async () => {
  return clientBaseApi.auth
    .logout()
    .then((response) => response.data)
    .catch(handleApiError);
};
