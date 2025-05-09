import React, { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import axiosInstance from "../libs/api/axios";

function PostList() {
  // 게시글 리스트 상태
  const [posts, setPosts] = useState([]);
  // 다음 페이지 요청을 위한 커서 ID
  const [cursorId, setCursorId] = useState(null);
  // 다음 페이지가 있는지 여부
  const [hasNext, setHasNext] = useState(true);
  // 무한 스크롤 감지를 위한 ref
  const observerRef = useRef(null);

  // 게시글 리스트 불러오기 (처음 + 무한스크롤용)
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts", {
        params: cursorId ? { cursorId } : {}, // 커서 기반 페이징
        headers: {
          "x-mock-response-code": "200", // 성공 응답 강제
        },
      });

      console.log("글 목록 응답:", res.data);

      const newPosts = res.data.data.posts;
      setPosts((prev) => [...prev, ...newPosts]); // 기존 + 새 글
      setCursorId(res.data.data.nextCursorId); // 다음 요청용 커서 저장
      setHasNext(res.data.data.hasNext); // 다음 페이지 여부
    } catch (err) {
      console.error("글 목록 불러오기 실패:", err);
    }
  };

  // 컴포넌트 마운트 시 최초 데이터 호출
  useEffect(() => {
    fetchPosts();
  }, []);

  // 무한 스크롤 관찰자 설정
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
      {/* 관찰 대상: 마지막 요소로 추가 */}
      {hasNext && <div ref={observerRef} className="h-10"></div>}
    </div>
  );
}

export default PostList;
