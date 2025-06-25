import { useState } from "react";
import axios from "../libs/api/axios";
import SocialLoginButtons from "./SocialLoginButtons";

export default function AuthModal({ onClose, setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    email: "",
    password: "",
    userId: "",
    profileName: "",
    bio: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 일반 로그인 처리 (POST /auth/login)
  const handleLogin = async () => {
    setMessage("");
    try {
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // 응답에서 accessToken 저장 (refreshToken은 쿠키로 자동 세팅됨)
      const { accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      setMessage("로그인 성공!");
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 400) setMessage("이메일 또는 비밀번호를 입력해주세요.");
      else if (status === 401)
        setMessage("비밀번호가 일치하지 않거나 계정이 없습니다.");
      else if (status === 403) setMessage("소셜 로그인으로 가입된 계정입니다.");
      else setMessage(msg || "로그인 실패");
    }
  };

  // 일반 회원가입 처리 (POST /auth/signup)
  const handleSignup = async () => {
    setMessage("");
    try {
      await axios.post("/auth/signup", {
        email: form.email,
        password: form.password,
        userId: form.userId,
        profileName: form.profileName,
        bio: form.bio, // ⚠️ 명세 기준 bio 필드로 전송해야 함
      });

      // 성공 시 로그인 화면으로 전환
      setMessage("회원가입 성공! 로그인 화면으로 이동합니다.");
      setTimeout(() => setIsLogin(true), 1500);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 400) setMessage(msg || "모든 필드를 정확히 입력해주세요.");
      else if (status === 409 && msg?.includes("Email"))
        setMessage("이미 등록된 이메일입니다.");
      else if (status === 409 && msg?.includes("User ID"))
        setMessage("이미 사용 중인 유저 ID입니다.");
      else if (status === 500)
        setMessage("서버 오류로 회원가입에 실패했습니다.");
      else setMessage(msg || "회원가입 실패");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg relative">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-center mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="userId"
                placeholder="유저 ID"
                value={form.userId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="profileName"
                placeholder="프로필 이름"
                value={form.profileName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="bio"
                placeholder="한줄 소개"
                value={form.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>

          {/* 카카오/구글 버튼 포함 */}
          <SocialLoginButtons />
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <div className="mt-6 text-sm text-center">
          {isLogin ? (
            <span>
              계정이 없으신가요?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-green-600 font-semibold hover:underline"
              >
                회원가입
              </button>
            </span>
          ) : (
            <span>
              계정이 이미 있으신가요?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-green-600 font-semibold hover:underline"
              >
                로그인
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
