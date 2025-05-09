import { useState } from "react";
import axios from "../libs/api/axios";

export default function AuthModal({ onClose, setIsLoggedIn }) {
  // 로그인 / 회원가입 모드 상태
  const [isLogin, setIsLogin] = useState(true);

  // 입력 폼 상태
  const [form, setForm] = useState({
    email: "",
    password: "",
    userId: "", // 회원가입 시만 사용
  });

  // 사용자에게 보여줄 메시지 (성공 / 실패)
  const [message, setMessage] = useState("");

  // input 변화 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 요청 처리
  const handleLogin = async () => {
    setMessage("");
    try {
      const res = await axios.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            "x-mock-response-code": "200", // ✅ 로그인 성공 응답 강제
          },
        }
      );

      // 로그인 성공 시 토큰 저장 및 상태 변경
      const { accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      setMessage("로그인 성공!");
      onClose(); // 모달 닫기
    } catch (err) {
      // 🔥 로그인 실패 시 에러 처리
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 400) setMessage("이메일 또는 비밀번호를 입력해주세요.");
      else if (status === 401) setMessage("비밀번호가 일치하지 않습니다.");
      else if (status === 404) setMessage("존재하지 않는 사용자입니다.");
      else setMessage(msg || "로그인 실패");
    }
  };

  // 회원가입 요청 처리
  const handleSignup = async () => {
    setMessage("");
    try {
      const res = await axios.post("/auth/signup", {
        email: form.email,
        password: form.password,
        userId: form.userId,
      });

      setMessage("회원가입 성공! 로그인 화면으로 이동합니다.");
      setTimeout(() => setIsLogin(true), 1500); // 잠시 후 로그인 화면으로 전환
    } catch (err) {
      // 회원가입 실패 시 에러 처리
      const status = err.response?.status;
      const error = err.response?.data?.error;
      const msg = err.response?.data?.message;

      if (status === 400) setMessage("이메일 또는 비밀번호를 입력해주세요.");
      else if (status === 409 && error === "DUPLICATE_EMAIL")
        setMessage("이미 등록된 이메일입니다.");
      else if (status === 409 && error === "DUPLICATE_USER_ID")
        setMessage("이미 사용 중인 유저 ID입니다.");
      else if (status === 500)
        setMessage("서버 오류로 회원가입에 실패했습니다.");
      else setMessage(msg || "회원가입 실패");
    }
  };

  // 폼 제출 핸들러 (로그인 또는 회원가입 실행)
  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  // UI 렌더링
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* 모드별 제목 */}
        <h2 className="text-xl font-bold text-center mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h2>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && ( // 회원가입일 때만 userId 입력칸 노출
            <input
              type="text"
              name="userId"
              placeholder="유저 ID"
              value={form.userId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
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
        </form>

        {/* 결과 메시지 */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        {/* 로그인/회원가입 전환 링크 */}
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
