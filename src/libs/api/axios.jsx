import axios from "axios";

const instance = axios.create({
  baseURL: "https://4fe6b659-1d02-4414-89a5-3d6ee1d85875.mock.pstmn.io",
  withCredentials: true, // ✅ refreshToken 쿠키 전송을 위해 필수
});

// 요청 시 accessToken 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 시 401이면 → 토큰 재발급 시도 후 재요청
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await instance.post("/auth/token");
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (tokenErr) {
        console.error("토큰 재발급 실패:", tokenErr);
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
