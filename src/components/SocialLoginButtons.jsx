// 소셜 로그인 버튼 컴포넌트 (카카오 / 구글)
export default function SocialLoginButtons() {
  // 버튼 클릭 시 백엔드 소셜 로그인 URL로 이동
  const handleSocialLogin = (provider) => {
    // 백엔드 서버로 리다이렉트 (카카오 또는 구글)
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/oauth2/${provider}`;
  };

  return (
    <div className="space-y-3 mt-6">
      {/* 카카오 로그인 버튼 */}
      <button
        onClick={() => handleSocialLogin("kakao")}
        className="w-full py-2 rounded bg-yellow-300 text-black font-semibold"
      >
        카카오로 로그인
      </button>

      {/* 구글 로그인 버튼 */}
      <button
        onClick={() => handleSocialLogin("google")}
        className="w-full py-2 rounded bg-white text-black border font-semibold"
      >
        구글로 로그인
      </button>
    </div>
  );
}
