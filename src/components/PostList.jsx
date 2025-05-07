import React, { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import axiosInstance from "../libs/api/axios";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts", {
        params: cursorId ? { cursorId } : {},
        headers: {
          // "x-mock-response-code": "500", // ✅ 테스트용
        },
      });

      console.log("글 목록 응답:", res.data);

      const newPosts = res.data.data.posts;
      setPosts((prev) => [...prev, ...newPosts]);
      setCursorId(res.data.data.nextCursorId);
      setHasNext(res.data.data.hasNext);
    } catch (err) {
      console.error("글 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursorId, hasNext]);

  return (
    <div className="max-w-screen-2xl mx-auto px-[24px] grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
      {hasNext && <div ref={observerRef} className="h-10"></div>}
    </div>
  );
}

export default PostList;
