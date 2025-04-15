import React from "react";
import KakaoIcon from "../assets/velog-kakao-long.png";
import "../styles/GoogleButton.css";

export default function AuthModal({ mode = "login", onClose, setMode }) {
  const isSignup = mode === "signup";

  const handleKakaoLogin = () => {
    console.log(`${isSignup ? "카카오 회원가입" : "카카오 로그인"} 클릭`);
  };

  const handleGoogleLogin = () => {
    console.log(`${isSignup ? "구글 회원가입" : "구글 로그인"} 클릭`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-md flex shadow-lg overflow-hidden">
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-[#f8f9fa] px-8">
          <p className="text-xl font-semibold text-center">환영합니다!</p>
        </div>

        <div className="flex flex-col justify-center w-full md:w-1/2 px-10 py-12 relative gap-y-6">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="text-xl font-bold">
            {isSignup ? "회원가입" : "로그인"}
          </h2>

          {/* 이메일 로그인/회원가입 */}
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-sm text-gray-800 font-medium">
              이메일로 {isSignup ? "회원가입" : "로그인"}
            </label>
            <div className="flex h-[40px]">
              <input
                type="email"
                placeholder="이메일을 입력하세요."
                className="w-full px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button className="bg-green-500 text-white px-4 rounded-r-md hover:bg-green-600 text-sm whitespace-nowrap">
                {isSignup ? "회원가입" : "로그인"}
              </button>
            </div>
          </div>

          {/* 소셜 로그인/회원가입 */}
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-sm text-gray-800 font-medium">
              소셜 계정으로 {isSignup ? "회원가입" : "로그인"}
            </label>

            {/* 카카오 */}
            <button onClick={handleKakaoLogin} className="w-full h-[48px]">
              <img
                src={KakaoIcon}
                alt="카카오 로그인"
                className="w-full h-full object-contain rounded-md"
              />
            </button>

            {/* 구글 */}
            <button
              onClick={handleGoogleLogin}
              className="gsi-material-button w-full h-[48px] rounded-md flex items-center justify-center gap-x-2"
              aria-label="구글 로그인"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper flex items-center justify-center gap-2 w-full">
                <div className="gsi-material-button-icon w-5 h-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-full h-full"
                  >
                    <path fill="#EA4335" d="..." />
                    <path fill="#4285F4" d="..." />
                    <path fill="#FBBC05" d="..." />
                    <path fill="#34A853" d="..." />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="gsi-material-button-contents whitespace-nowrap text-sm font-medium">
                  Sign in with Google
                </span>
              </div>
            </button>
          </div>

          {/* 전환 링크 */}
          <p className="text-sm text-center text-gray-500 mt-4">
            {isSignup ? (
              <>
                계정이 이미 있으신가요?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-green-600 font-semibold hover:underline cursor-pointer"
                >
                  로그인
                </span>
              </>
            ) : (
              <>
                아직 회원이 아니신가요?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-green-600 font-semibold hover:underline cursor-pointer"
                >
                  회원가입
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
