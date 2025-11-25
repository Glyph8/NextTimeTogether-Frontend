import { GetPromiseBatchReqDTO } from "@/apis/generated/Api";
import { clientBaseApi } from "."


/** promise/get */
export const getSchedulesOfAllGroup = (data:GetPromiseBatchReqDTO) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise
    .getPromiseView1(data)
    .then((response) => {
      console.log("전체 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
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
}

/** promise/get/{groupId} */
export const getSchedulesOfGroup = (groupId:string, data:GetPromiseBatchReqDTO) =>{
    const clientApi = clientBaseApi;

    return clientApi
    .promise
    .getPromiseView2(groupId, data)
    .then((response) => {
      console.log("특정 그룹의 스케쥴 DTO 리스트 요청  : ", response.data);
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
}