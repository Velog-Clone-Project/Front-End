import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../libs/api/axios";

export default function SocialSignup() {
  const navigate = useNavigate();

  // 입력 받을 필드 상태 (userId, profileName, introduction만 수정 가능)
  const [form, setForm] = useState({
    userId: "",
    profileName: "",
    introduction: "",
  });

  // 쿠키로 받은 값 (수정 불가능)
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");

  // ✅ 1. 쿠키에서 회원가입용 정보 불러오기
  useEffect(() => {
    const cookieObj = Object.fromEntries(
      document.cookie.split("; ").map((v) => v.split("="))
    );

    // 이메일, 서비스 타입은 수정 불가 (숨겨진 필드로 사용)
    setEmail(decodeURIComponent(cookieObj.email || ""));
    setServiceType(cookieObj.serviceType || "");

    // userId, profileName, introduction은 초기값만 설정, 수정 가능
    setForm((prev) => ({
      ...prev,
      userId: decodeURIComponent(cookieObj.userId || ""),
      profileName: decodeURIComponent(cookieObj.profileName || ""),
      introduction: decodeURIComponent(cookieObj.introduction || ""),
    }));
  }, []);

  // 인풋 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 2. 소셜 회원가입 요청
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // POST /auth/signup/oauth2/kakao 또는 /google
      await axios.post(`/auth/signup/oauth2/${serviceType}`, {
        email, // 수정 불가
        userId: form.userId,
        profileName: form.profileName,
        introduction: form.introduction,
      });

      setMessage("회원가입 성공! 홈으로 이동합니다.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      // 에러 메시지 처리
      if (status === 400) setMessage("모든 필드를 입력해주세요.");
      else if (status === 409 && msg?.includes("EMAIL"))
        setMessage("이미 등록된 이메일입니다.");
      else if (status === 409 && msg?.includes("USER_ID"))
        setMessage("이미 사용 중인 유저 ID입니다.");
      else setMessage(msg || "회원가입 실패");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center mb-6">소셜 회원가입</h2>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* 유저 ID */}
        <input
          type="text"
          name="userId"
          placeholder="유저 ID"
          value={form.userId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        {/* 프로필 이름 */}
        <input
          type="text"
          name="profileName"
          placeholder="프로필 이름"
          value={form.profileName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        {/* 한줄 소개 */}
        <input
          type="text"
          name="introduction"
          placeholder="한줄 소개"
          value={form.introduction}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          회원가입
        </button>

        {/* 에러/성공 메시지 */}
        {message && (
          <p className="text-center text-sm text-red-500 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
