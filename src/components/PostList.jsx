import React, { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";

const dummyPost = {
  id: 1,
  title: "벨로그 클론 프로젝트 진행 중!",
  description: "지금까지 만든 걸 바탕으로 Velog 클론 개발 중입니다.",
  author: "이승헌",
  date: "2025년 4월 10일",
  likes: 12,
};

function PostList() {
  const [posts, setPosts] = useState(
    Array.from({ length: 12 }).map((_, index) => ({
      ...dummyPost,
      id: index + 1,
    }))
  );

  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPosts((prev) => [
            ...prev,
            ...Array.from({ length: 8 }).map((_, index) => ({
              ...dummyPost,
              id: prev.length + index + 1,
            })),
          ]);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-[24px] grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}

export default PostList;
