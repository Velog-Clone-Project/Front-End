import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../libs/api/axios";

export default function SocialSignup() {
  const navigate = useNavigate();

  // 입력 필드: 수정 가능한 정보
  const [form, setForm] = useState({
    userId: "",
    profileName: "",
    bio: "", // 명세에 따라 bio로 사용
  });

  // 쿠키 기반의 불변 필드
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState("");

  // 쿠키에서 이메일 / 유저 타입 / 초기값 불러오기
  useEffect(() => {
    const cookieObj = Object.fromEntries(
      document.cookie.split("; ").map((v) => v.split("="))
    );

    setEmail(decodeURIComponent(cookieObj.email || ""));
    setUserType(cookieObj.userType || "");

    setForm((prev) => ({
      ...prev,
      userId: decodeURIComponent(cookieObj.userId || ""),
      profileName: decodeURIComponent(cookieObj.profileName || ""),
      bio: decodeURIComponent(cookieObj.bio || ""),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 소셜 회원가입 요청 (POST /auth/signup/social)
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("/auth/signup/social", {
        email,
        userId: form.userId,
        profileName: form.profileName,
        bio: form.bio,
        userType, // 명세 필수 필드
      });

      setMessage("회원가입 성공! 홈으로 이동합니다.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 400) setMessage("모든 필드를 입력해주세요.");
      else if (status === 409 && msg?.includes("Email"))
        setMessage("이미 등록된 이메일입니다.");
      else if (status === 409 && msg?.includes("User ID"))
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

        {/* 한줄 소개 → bio */}
        <input
          type="text"
          name="bio"
          placeholder="한줄 소개"
          value={form.bio}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          회원가입
        </button>

        {message && (
          <p className="text-center text-sm text-red-500 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
