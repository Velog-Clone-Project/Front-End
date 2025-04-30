// Header.jsx
import React, { useState, useEffect } from "react";
import VelogIcon from "../assets/velog-icon.svg";
import AlertIcon from "../assets/velog-alert.png";
import SearchIcon from "../assets/velog-search.png";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import axios from "../libs/api/axios"; // 🔥 axios 인스턴스 import 추가

function Header() {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

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
      console.log("로그아웃 성공");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      // 실패해도 클라이언트 상태 초기화
    } finally {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      setShowDropdown(false);
    }
  };

  return (
    <>
      <header className="w-full bg-[#F8F9FA]">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center h-16 px-[24px]">
          <img
            src={VelogIcon}
            alt="Velog logo"
            className="w-[71px] h-[20px] cursor-pointer"
            onClick={() => navigate("/")}
          />

          {isLoggedIn ? (
            <div className="flex items-center space-x-5 relative">
              <img
                src={SearchIcon}
                alt="Search"
                className="h-6 cursor-pointer"
              />
              <img src={AlertIcon} alt="Alert" className="h-6 cursor-pointer" />

              <button
                onClick={() => navigate("/write")}
                className="px-4 py-1 rounded-full bg-[#f1f3f5] text-sm font-medium border border-gray-300 hover:bg-gray-200"
              >
                새 글 작성
              </button>

              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <span className="text-sm">▼</span>
              </div>

              {showDropdown && (
                <ul className="absolute top-12 right-0 bg-white shadow-lg rounded border w-40 text-sm z-50">
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                    내 벨로그
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
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
              <img
                src={SearchIcon}
                alt="Search"
                className="h-6 cursor-pointer"
              />
              <img src={AlertIcon} alt="Alert" className="h-6 cursor-pointer" />
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
