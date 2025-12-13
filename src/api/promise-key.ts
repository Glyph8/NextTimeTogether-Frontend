import { GetPromiseRequest } from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi } from ".";

export interface EncPromiseIdList{
    encPromiseIdList:string[];
}

/** /promise/promisekey1 promise_proxy_user 테이블에 있는 enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환 */
export const getEncPromiseId =  () =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.getPromiseKey1()
    .then((response) => {
      console.log("암호화된 약속 아이디 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<EncPromiseIdList>;
      // return response.data;
       return realData.result || [];
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
}

export interface EncPromiseKey{
    encPromiseKey : string;
}

/** /promise/promisekey2 전달한 promiseId의 개인키로 암호화된 promiseKey 반환 */
export const getEncPromiseKey =  (data: GetPromiseRequest) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.getPromiseKey2(data)
    .then((response) => {
      console.log("암호화된 약속 키 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<EncPromiseKey>;
      // return response.data;
       return realData.result || [];
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
}
