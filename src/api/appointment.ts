import { GetPromiseBatchReqDTO, TimestampReqDTO } from "@/apis/generated/Api";
import { clientBaseApi } from ".";


export interface PromiseResDTO {
  scheduleId: string;
  title: string;
  purpose: string
}

/** /promise/get : 약속 일정 리스트를 전부 조회 */
export const getAllScheduleList = async (data: GetPromiseBatchReqDTO,) => {
  return clientBaseApi.promise.getPromiseView1(data)
    .then((response) => {
      console.log("약속 일정 탭 - 약속 일정 리스트 받음 : ", response.data);
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
// ```jsx
// {
//     "code": 200,
//     "message": "요청에 성공했습니다.",
//     "result": {
//         "promiseResDTOList": [
//             {
//                 "scheduleId": "schedule1111",
//                 "title": "연초회의",
//                 "purpose": "스터디"
//             },
//             {
//                 "scheduleId": "schedule1234",
//                 "title": "연말TTD",
//                 "purpose": "식사"
//             },
//             {
//                 "scheduleId": "schedule5678",
//                 "title": "백엔드 스터디에용",
//                 "purpose": "스터디"
//             }
//         ]
//     }
// }
// ```


/** /promise/get/{groupId} : 특정 그룹 내 약속 일정 리스트 조회 */
export const getScheduleListPerGroups = async (groupId: string,
  data: GetPromiseBatchReqDTO,) => {
  return clientBaseApi.promise.getPromiseView2(groupId, data)
    .then((response) => {
      console.log("약속 일정 탭 -약속 일정 리스트 받음 : ", response.data);
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

/** /promise/search : 약속 일정 검색 */
export const searchScheduleList = async (
  query: string) => {
  return clientBaseApi.promise.searchPromiseView({ query })
    .then((response) => {
      console.log("약속 일정 탭 - 약속 일정 리스트 받음 : ", response.data);
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

/** /promise/get/{scheduleId}/detail : 약속 일정 상세 조회 */
export const getScheduleListDetail = async (scheduleId: string) => {
  return clientBaseApi.promise.getPromiseDetailView(scheduleId)
    .then((response) => {
      console.log("약속 일정 탭 -약속 일정 리스트 받음 : ", response.data);
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

// export interface TimestampReqDTO {
//   dates?: string[];
// }

export interface TimestampResDTO {
  date: string;
  timestamp: string;
}

/** /timestamp/get : "2025-12-14"형식 dates 배열으로 요청, 개인키로 암호화된 스케쥴 아이디 리스트 TimestampResDTO[] 반환 */
export const getTimeStampList = async (data: TimestampReqDTO) => {
  return clientBaseApi.timestamp.getTimeStampList(data)
    .then((response) => {
      console.log("약속 일정 탭 -약속 일정 리스트 받음 : ", response.data);
      return response.data.result;
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

