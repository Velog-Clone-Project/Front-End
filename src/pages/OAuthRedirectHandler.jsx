import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../libs/api/axios";

// ✅ 백엔드에서 소셜 로그인 후 리다이렉트 되는 경로 (/auth/oauth2-redirect)
export default function OAuthRedirectHandler({ setUser, setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    // 소셜 로그인 완료 후 토큰 발급 및 유저 정보 요청
    const handleOAuth = async () => {
      try {
        // 1. refreshToken 쿠키로 accessToken 재발급 요청
        const res = await axios.post("/auth/token", null, {
          withCredentials: true, // ✅ 쿠키 전송 (필수)
        });

        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken); // ✅ accessToken 저장

        // 2. accessToken을 이용해 유저 정보 요청
        const userRes = await axios.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 3. App 상태 갱신 (user + 로그인 여부)
        setUser(userRes.data.data);
        setIsLoggedIn(true);

        // 4. 홈으로 이동
        navigate("/");
      } catch (err) {
        // ✅ 실패 시: refreshToken이 없거나 → 회원가입 정보 쿠키가 있으면 소셜 회원가입으로
        navigate("/auth/social-signup");
      }
    };

    handleOAuth();
  }, []);

  return (
    <div className="text-center mt-10 text-lg font-semibold">
      소셜 로그인 처리 중...
    </div>
  );
}
