import { useEffect, useState } from "react";
import axiosInstance from "../libs/api/axios";
import { FaHeart } from "react-icons/fa";

export default function MyVelog() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("글");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/users/jihyun01/blog", {
          headers: {
            "x-mock-response-code": "200",
          },
        });

        const user = response.data?.data?.user;
        const posts = response.data?.data?.posts;

        console.log("user:", user);
        console.log("posts:", posts);

        if (!user || !Array.isArray(posts)) {
          throw new Error("응답 구조 이상");
        }

        setUser(user);
        setPosts(posts);
        setLoading(false);
      } catch (err) {
        console.error("블로그 불러오기 실패:", err);
        setError("블로그 정보를 불러올 수 없습니다.");
        setLoading(false);
        // const status = err.response?.status;

        // if (status === 400) {
        //   setError("요청 형식이 잘못되었습니다.");
        // } else if (status === 404) {
        //   setError("해당 사용자의 블로그를 찾을 수 없습니다.");
        // } else if (status === 500) {
        //   setError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        // } else {
        //   setError("블로그 정보를 불러올 수 없습니다.");
        // }
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error || !user) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="relative min-h-screen">
      {/* 태그 목록 - 썸네일 위치 기준으로 고정 */}
      <aside className="absolute left-[calc(50%-640px)] top-[335px] w-48">
        <h2 className="text-sm font-semibold mb-2">태그 목록</h2>
        <hr className="mb-3" />
        <p className="text-green-400 cursor-pointer">전체보기</p>
      </aside>

      {/* 중앙 콘텐츠 영역 */}
      <main className="mx-auto w-[768px]">
        {/* 프로필 */}
        <div className="flex items-center gap-4 mt-10 mb-6">
          <img
            src={user.profileImageUrl}
            alt="프로필"
            className="w-32 h-32 rounded-full"
          />
          <div>
            <p className="text-xl font-bold mb-2">{user.profileName}</p>
            <p className="text-gray-600 text-sm">{user.introduction}</p>
          </div>
        </div>

        {/* 프로필 아래 구분선 */}
        <div className="border-b mb-20 mt-10" />

        {/* 탭 메뉴 */}
        <nav className="flex justify-center gap-16 mb-10 text-gray-600 font-semibold relative">
          {["글", "소개"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 transition-colors ${
                activeTab === tab
                  ? "text-green-500 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-[2px] after:bg-green-500"
                  : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* 탭 내용 */}
        {activeTab === "글" && (
          <div className="grid gap-8">
            {posts.map((post) => (
              <div key={post.postId} className="border-b pb-6">
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt="썸네일"
                    className="w-[768px] h-[400px] object-cover rounded mb-8"
                  />
                )}
                <h2 className="text-xl font-bold mb-8">{post.title}</h2>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  {new Date(post.createdAt).toLocaleDateString()} 댓글{" "}
                  {post.commentCount}{" "}
                  <span className="flex items-center gap-1">
                    <FaHeart />
                    {post.likeCount}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "소개" && (
          <div className="text-center text-gray-500 mt-10">
            소개글을 작성해보세요 ✍️
          </div>
        )}
      </main>
    </div>
  );
}
