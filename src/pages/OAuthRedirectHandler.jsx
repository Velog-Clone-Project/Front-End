import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../libs/api/axios";

// 소셜 로그인 리다이렉트 처리 컴포넌트
// 백엔드에서 소셜 인증 완료 후 리디렉트되는 경로: /auth/oauth2-redirect
export default function OAuthRedirectHandler({ setUser, setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Refresh Token 쿠키를 통해 Access Token 재발급 요청
        // 명세: POST /auth/token (refreshToken은 쿠키로 전송됨)
        const res = await axios.post("/auth/token", null, {
          withCredentials: true, // 쿠키 전송 필수
        });

        // 발급받은 Access Token을 localStorage에 저장
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);

        // Access Token을 사용해 사용자 정보 요청
        // 예: /auth/user 또는 /user/profile 등의 API (백엔드 제공 형태에 따라 다름)
        const userRes = await axios.get("/auth/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 상태 갱신: 로그인 여부 및 사용자 정보 저장
        setUser(userRes.data.data);
        setIsLoggedIn(true);

        // 홈 화면으로 이동
        navigate("/");
      } catch (err) {
        // 실패한 경우 (예: refreshToken 없음 or 만료)
        // 명세에 따라, 쿠키에 소셜 회원가입 정보가 있다면 /auth/social-signup 으로 이동
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
