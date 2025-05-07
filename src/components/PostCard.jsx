import React from "react";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white cursor-pointer"
      onClick={() => navigate(`/posts/${post.postId}`)}
    >
      {/* 썸네일 이미지 */}
      {post.thumbnailUrl ? (
        <img
          src={post.thumbnailUrl}
          alt="썸네일"
          className="w-full h-40 object-cover bg-gray-100"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200" />
      )}

      {/* 내용 */}
      <div className="px-3 pt-4">
        <h2 className="text-base font-bold leading-tight mb-1">{post.title}</h2>
        <p className="text-sm text-gray-600 mb-4">작성자: {post.authorName}</p>
        <div className="border-b mb-3" />

        {/* 날짜 + 댓글 */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>댓글 {post.commentCount}개</span>
        </div>

        {/* 유저 + 좋아요 */}
        <div className="flex justify-between items-center text-xs text-gray-700 mb-3">
          <span>by {post.authorName}</span>
          <span className="flex items-center gap-1">❤️ {post.likeCount}</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
