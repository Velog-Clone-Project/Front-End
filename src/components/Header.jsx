import React, { useState, useEffect } from "react";
import VelogIcon from "../assets/velog-icon.svg";
import AlertIcon from "../assets/velog-alert.png";
import SearchIcon from "../assets/velog-search.png";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import axios from "../libs/api/axios";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 로그인/회원가입 모달 상태
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 모달 모드: "login" 또는 "signup"
  const [authMode, setAuthMode] = useState("login");

  // 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 드롭다운 메뉴 표시 여부
  const [showDropdown, setShowDropdown] = useState(false);

  // 처음 렌더링 시 로컬스토리지에서 토큰 확인하여 로그인 상태 설정
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

  // 로그아웃 요청 및 상태 초기화
  const handleLogout = async () => {
    try {
      await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      setShowDropdown(false);
    }
  };

  return (
    <>
      {/* 헤더 배경색: 홈화면은 연한 회색, 그 외는 흰색 */}
      <header className={`w-full ${isHome ? "bg-[#F8F9FA]" : "bg-white"}`}>
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center h-16 px-[24px]">
          {/* 좌측: 로고 */}
          <img
            src={VelogIcon}
            alt="Velog logo"
            className="w-[71px] h-[20px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* 우측: 로그인 여부에 따라 다른 UI */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-5 relative">
              {/* 검색, 알림 아이콘 */}
              <img
                src={SearchIcon}
                alt="Search"
                className="h-6 cursor-pointer"
              />
              <img src={AlertIcon} alt="Alert" className="h-6 cursor-pointer" />

              {/* 새 글 작성 버튼 */}
              <button
                onClick={() => navigate("/write")}
                className="px-4 py-1 rounded-full bg-[#ffffff] text-sm font-medium border border-gray-300 hover:bg-gray-200"
              >
                새 글 작성
              </button>

              {/* 프로필 버튼 */}
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <span className="text-sm">▼</span>
              </div>

              {/* 드롭다운 메뉴 */}
              {showDropdown && (
                <ul className="absolute top-12 right-0 bg-white shadow-lg rounded border w-40 text-sm z-50">
                  <li
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                    onClick={() => {
                      navigate("/my-velog");
                      setShowDropdown(false);
                    }}
                  >
                    내 벨로그
                  </li>
                  <li
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                    onClick={() => {
                      navigate("/settings");
                      setShowDropdown(false);
                    }}
                  >
                    설정
                  </li>
                  <li
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-red-500"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              {/* 검색, 알림 아이콘 */}
              <img
                src={SearchIcon}
                alt="Search"
                className="h-6 cursor-pointer"
              />
              <img src={AlertIcon} alt="Alert" className="h-6 cursor-pointer" />

              {/* 로그인 버튼 */}
              <button
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthOpen(true);
                }}
                className="bg-[#212529] text-white text-sm px-4 py-[2px] rounded-full hover:bg-[#343a40]"
              >
                로그인
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 로그인/회원가입 모달 */}
      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setIsAuthOpen(false)}
          setMode={setAuthMode}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default Header;
