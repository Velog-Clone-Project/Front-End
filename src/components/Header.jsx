import React, { useState } from "react";
import VelogIcon from "../assets/velog-icon.svg";
import AlertIcon from "../assets/velog-alert.png";
import SearchIcon from "../assets/velog-search.png";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

function Header() {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

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

          <div className="flex items-center space-x-5">
            <img src={SearchIcon} alt="Search" className="h-6 cursor-pointer" />
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
        </div>
      </header>

      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setIsAuthOpen(false)}
          setMode={setAuthMode} // 내부 전환용
        />
      )}
    </>
  );
}

export default Header;
