import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Write from "./pages/Write.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import MyVelog from "./pages/MyVelog.jsx";
import Settings from "./pages/Settings.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/my-velog" element={<MyVelog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
