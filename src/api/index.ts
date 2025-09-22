import {Api} from "@/apis/generated/Api";

const baseApi = new Api({
    baseURL: 'https://meetnow.duckdns.org',
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


// 인터셉터가 적용된 이 'api' 객체를 프로젝트 전역에서 사용하도록 + 주로 사용하는 v1을 export
const api = baseApi;

export default api;