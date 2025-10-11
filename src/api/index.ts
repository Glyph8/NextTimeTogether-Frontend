import { Api } from "@/apis/generated/Api";
// import axiosInstance from "@/api/axiosInstance";
const baseApi = new Api({
  // baseURL: "https://meetnow.duckdns.org",
  baseURL: "http://43.202.154.29:8083",
  securityWorker: () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }
    return {
      headers: {
        Authorization: token,
      },
    };
  },
  secure: true, // security가 필요한 엔드포인트에 자동 적용
});

const api = baseApi;

export default api;


// const baseApi = new Api({
//     // baseURL, securityWorker 등은 이제 axiosInstance가 모두 처리
//     customAxios: axiosInstance,
// });
