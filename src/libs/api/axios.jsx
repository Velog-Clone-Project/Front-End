// libs/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 전송
});

// 요청 시 accessToken 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 시 401 → 토큰 재발급 & 재요청
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 이미 재시도한 요청이면 무한루프 방지
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refreshToken으로 새 accessToken 받기
        const res = await instance.post("/auth/token");
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);

        // 새 토큰으로 Authorization 헤더 다시 설정
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 실패했던 요청 재시도
        return instance(originalRequest);
      } catch (tokenErr) {
        console.error("토큰 재발급 실패:", tokenErr);
        localStorage.removeItem("accessToken");
        window.location.href = "/"; // 또는 로그아웃 처리
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
