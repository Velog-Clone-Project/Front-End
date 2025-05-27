import { useEffect, useState } from "react";
import axiosInstance from "../libs/api/axios";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("light");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/me", {
          headers: { "x-mock-response-code": "200" },
        });
        setProfile(res.data.data);
        setEmail(res.data.data.profileEmail);
      } catch (err) {
        console.error("프로필 로딩 실패", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* 프로필 영역 */}
      <div className="flex items-start gap-16 pb-12">
        {/* 왼쪽 - 이미지 */}
        <div className="flex flex-col items-center">
          <img
            src={profile.profileImageUrl}
            alt="프로필"
            className="w-32 h-32 rounded-full object-cover"
          />
          <button className="bg-green-500 text-white px-6 py-2 rounded mt-6">
            이미지 업로드
          </button>
          <button className="text-green-500 text-sm mt-2">이미지 제거</button>
        </div>

        {/* 구분선 */}
        <div className="w-px h-60 bg-gray-100" />

        {/* 오른쪽 - 텍스트 */}
        <div>
          <h2 className="text-4xl font-bold mb-3">{profile.profileName}</h2>
          <p className="text-gray-500 text-lg mb-3">{profile.introduction}</p>
          <button className="text-green-500 font-semibold text-sm underline">
            수정
          </button>
        </div>
      </div>

      {/* 아래 설정들 */}
      <div className="space-y-10">
        {/* 이메일 주소 */}
        <div>
          <h3 className="font-bold mb-1">이메일 주소</h3>
          {isEditingEmail ? (
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="border px-3 py-2 rounded w-full"
              />
              <button className="bg-green-500 text-white px-4 rounded">
                변경
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-sm text-gray-400">
                회원 인증 또는 시스템에서 발송하는 이메일을 수신하는 주소입니다.
              </p>
              <button
                className="text-green-500 font-semibold text-sm underline"
                onClick={() => setIsEditingEmail(true)}
              >
                변경
              </button>
            </div>
          )}
        </div>

        {/* 테마 설정 */}
        <div>
          <h3 className="font-bold mb-2">테마</h3>
          <div className="flex gap-4">
            {["light", "dark", "system"].map((option) => (
              <button
                key={option}
                onClick={() => setTheme(option)}
                className={`px-6 py-3 border rounded font-medium text-sm ${
                  theme === option
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {option === "light"
                  ? "라이트"
                  : option === "dark"
                  ? "다크"
                  : "시스템"}
              </button>
            ))}
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div>
          <h3 className="font-bold mb-2">회원 탈퇴</h3>
          <p className="text-sm text-gray-500 mb-4">
            탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
          </p>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
