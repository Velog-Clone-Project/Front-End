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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 후 유저 정보 가져오기
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
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
