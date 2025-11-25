import { CreatePromise4Request, PromiseView1Response, Promiseview2Request, PromiseView2Response, PromiseView3Request, PromiseView3Response, PromiseView4Request, PromiseView4Response } from "@/apis/generated/Api";
import { BackendResponse, clientBaseApi } from ".";

/** promise/create4 */

export interface CreatePromiseResponse{
  promiseId: string;
}

export const createPromise = (data:CreatePromise4Request) =>{
  const clientApi = clientBaseApi;

    return clientApi.promise.createPromise4(data)
       .then((response) => {
      console.log("약속 생성 요청 응답 : ", response.data);
      const realData = response.data as unknown as BackendResponse<CreatePromiseResponse>;
      // return response.data;
      return realData.result || null;
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


/** promise/view1 */
export const getEncPromiseIdList = () =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.view1()
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<PromiseView1Response[]>;
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

/** promise/view2 */
export const getPromiseInProgress = (data:Promiseview2Request) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.view2(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
       const realData = response.data as unknown as BackendResponse<PromiseView2Response[]>;
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

/** promise/view3 */
export const getScheduleIdListPerPromise = (data: PromiseView3Request) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.view3(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<PromiseView3Response[]>;
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

/** promise/view4 */
export const getScheduleIdPerFixedPromise = (data: PromiseView4Request) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise.view4(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
      const realData = response.data as unknown as BackendResponse<PromiseView4Response[]>;
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