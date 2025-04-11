import React from "react";

function PostCard({ post }) {
  return (
    <div className="bg-white">
      {/* 이미지 부분 */}
      <div className="w-full h-40 bg-gray-200" />

      {/* 내용 */}
      <div className="px-3 pt-4">
        <h2 className="text-base font-bold leading-tight mb-1">{post.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{post.description}</p>
        <div className="border-b mb-3" />

        {/* 날짜 + 댓글 */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>{post.date}</span>
          <span>댓글 17개</span>
        </div>

        {/* 유저 + 좋아요 */}
        <div className="flex justify-between items-center text-xs text-gray-700 mb-3">
          <span>by {post.author}</span>
          <span className="flex items-center gap-1">❤️ {post.likes}</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
