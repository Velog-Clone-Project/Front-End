import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../libs/api/axios";
import { FaHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${postId}`);
        setPost(res.data.data);
        setLikeCount(res.data.data.likeCount);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) setError("글을 찾을 수 없습니다.");
        else if (status === 500) setError("서버 오류가 발생했습니다.");
        else setError("알 수 없는 오류");
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!post) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="max-w-3xl w-full mt-20">
        <h1 className="text-3xl font-bold mb-10">{post.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-12">
          <div className="flex items-center">
            <img
              src={post.authorProfileImageUrl}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="font-semibold mr-2">{post.authorName}</span>
            <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="space-x-2">
            <button className="hover:underline">수정</button>
            <button className="hover:underline">삭제</button>
          </div>
        </div>

        {/* 좋아요/공유 버튼 */}
        <div className="relative mb-20 ">
          <div className="absolute -left-20 top-0 flex flex-col items-center rounded-full p-2 bg-[#f8f9fa] border ">
            <button
              onClick={handleLike}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                liked ? "bg-green-400 text-white" : "bg-white"
              }`}
            >
              <FaHeart className={liked ? "text-white" : "text-gray-500"} />
            </button>
            <span className="text-sm font-medium text-gray-700 mt-1">
              {likeCount}
            </span>
            <button
              className="w-10 h-10 mt-2 flex items-center justify-center rounded-full bg-white"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <FiShare2 className="text-gray-500" />
            </button>
          </div>

          <div
            className="prose prose-lg min-h-[400px] mb-20"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/<hr\s*\/?>/gi, ""),
            }}
          />
        </div>

        <div className="flex items-center gap-4 py-6 mb-20">
          <img
            src={post.authorProfileImageUrl}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-bold">{post.authorName}</p>
            <p className="text-sm text-gray-500">작성자 소개글 자리</p>
          </div>
        </div>

        <div className="mt-20">
          <p className="font-bold mb-2">{post.commentCount}개의 댓글</p>
          <textarea
            placeholder="댓글을 작성하세요"
            className="w-full border rounded p-3"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
