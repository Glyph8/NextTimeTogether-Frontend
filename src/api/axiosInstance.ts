// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// const axiosInstance = axios.create({
//   // baseURL: "http://43.202.154.29:8083/auth/login",
//   baseURL: "https://meetnow.duckdns.org",
//   // httpOnly 쿠키를 주고받기 위해 꼭 필요한 설정
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       // securityWorker를 대체하는 로직
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // --- 토큰 재발급 로직

// let isRefreshing = false;
// let failedQueue: Array<(token: string) => void> = [];

// const processQueue = (error: Error | null, token: string | null = null) => {
//   failedQueue.forEach(async (prom) => {
//     if (error) {
//       prom(await Promise.reject(error));
//     } else {
//       prom(token as string);
//     }
//   });

//   failedQueue = [];
// };

// // Response Interceptor (응답 가로채기)
// axiosInstance.interceptors.response.use(
//   (response) => response, // 성공 응답은 그대로 통과
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // 401 에러이고, 재시도한 요청이 아닐 때 재발급 진행
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, _reject) {
//           failedQueue.push((token: string) => {
//             originalRequest.headers["Authorization"] = token;
//             resolve(axiosInstance(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // httpOnly 쿠키에 담긴 Refresh Token으로 새로운 Access Token 요청
//         // 이 요청은 withCredentials: true 설정 덕분에 자동으로 쿠키를 포함합니다.

//         const { data } = await axiosInstance.post("/auth/refresh");

//         console.log("리프레쉬 응답 : ", data);
//         const newAccessToken = data.accessToken;
//         localStorage.setItem("access_token", newAccessToken);
//         axiosInstance.defaults.headers.common["Authorization"] = newAccessToken;

//         // 대기열의 모든 요청을 새로운 토큰으로 재시도
//         processQueue(null, newAccessToken);

//         // 현재 실패한 요청도 재시도
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError as Error, null);
//         // 리프레시 토큰이 만료되었거나, 재발급에 실패한 경우
//         // 로그아웃 처리 (localStorage 비우기, 로그인 페이지로 리디렉션)
//         localStorage.removeItem("access_token");
//         console.error("세션 만료됨. 재로그인 필요");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
