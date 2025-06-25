import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "./libs/api/axios";

import Home from "./pages/Home.jsx";
import Write from "./pages/Write.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import MyVelog from "./pages/MyVelog.jsx";
import Settings from "./pages/Settings.jsx";
import Search from "./pages/Search.jsx";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler.jsx";
import SocialSignup from "./pages/SocialSignup.jsx";

import Header from "./components/Header.jsx";

function App() {
  const location = useLocation();
  const isWritePage = location.pathname === "/write";

  const [user, setUser] = useState(null);

  // 초기값을 localStorage 기준으로 설정하면 초기 렌더링 깔끔하게 가능
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("accessToken")
  );

  // accessToken이 있을 경우 유저 정보 요청
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Authorization 헤더는 axios 인터셉터로 자동 처리됨
        const res = await axios.get("/auth/user");

        setUser(res.data.data);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {!isWritePage && (
        <Header
          user={user}
          isLoggedIn={isLoggedIn}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<Home user={user} isLoggedIn={isLoggedIn} />}
        />
        <Route path="/write" element={<Write />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/my-velog" element={<MyVelog user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/auth/oauth2-redirect"
          element={
            <OAuthRedirectHandler
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
          }
        />
        <Route path="/auth/social-signup" element={<SocialSignup />} />
      </Routes>
    </>
  );
}

export default App;
