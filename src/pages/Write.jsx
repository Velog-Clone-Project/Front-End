// 필요한 라이브러리 및 에디터 확장들 import
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  Quote,
  Link as LinkIcon,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../libs/api/axios";
import "../styles/write.css";

// 툴바 버튼 컴포넌트 (재사용 가능)
function ToolbarButton({ onClick, children, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } rounded-md transition`}
    >
      {children}
    </button>
  );
}

export default function Write() {
  const navigate = useNavigate();
  const [title, setTitle] = useState(""); // 제목 상태

  // 에디터 초기화
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "당신의 이야기를 적어보세요..." }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure(),
      CodeBlock.configure(),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: "",
  });

  // 글 출간 처리 함수
  const handlePublish = async () => {
    if (!title.trim() || !editor?.getHTML().trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/posts",
        {
          title,
          content: editor.getHTML(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const postId = res.data?.data?.postId;
      if (postId) navigate(`/posts/${postId}`); // 작성 완료 시 상세 페이지로 이동
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) alert("요청 형식이 잘못되었습니다.");
      else if (status === 401) alert("로그인이 필요합니다.");
      else if (status === 500) alert("서버 오류입니다.");
      else alert("출간 실패");
    }
  };

  return (
    <div className="h-screen flex">
      {/* 왼쪽 영역: 제목, 툴바, 본문 작성 */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* 제목 입력창 */}
        <div className="p-6 bg-white">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-extrabold outline-none mb-6"
          />
        </div>

        {/* 툴바 */}
        <div className="sticky top-0 bg-white z-30 shadow-sm border-b p-4 flex items-center gap-2">
          {/* 제목 스타일 토글 */}
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <Heading4 size={20} />
          </ToolbarButton>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* 텍스트 스타일 토글 */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={20} />
          </ToolbarButton>

          {/* 인용/링크/코드 */}
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("링크 URL 입력");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            <LinkIcon size={20} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={20} />
          </ToolbarButton>

          {/* 이미지 업로드 */}
          <ToolbarButton
            onClick={async () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("image", file);

                try {
                  const res = await axiosInstance.post(
                    "/posts/images",
                    formData,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  );

                  const imageUrl = res.data?.data?.imageUrl;
                  if (imageUrl) {
                    editor
                      ?.chain()
                      .focus()
                      .insertContent(`<img src="${imageUrl}" alt="" />`)
                      .run();
                  } else {
                    alert("이미지 URL을 받지 못했습니다.");
                  }
                } catch (err) {
                  alert(err.response?.data?.message || "이미지 업로드 실패");
                }
              };
              input.click();
            }}
          >
            <ImageIcon size={20} />
          </ToolbarButton>
        </div>

        {/* 본문 작성 영역 */}
        <div className="flex-1 p-6">
          <EditorContent
            editor={editor}
            className="focus:outline-none prose prose-lg max-w-full min-h-[500px]"
          />
        </div>

        {/* 하단 고정 버튼 */}
        <div className="sticky bottom-0 bg-white z-20 p-4 border-t flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            ← 나가기
          </button>
          <button
            onClick={handlePublish}
            className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold text-sm"
          >
            출간하기
          </button>
        </div>
      </div>

      {/* 오른쪽 실시간 미리보기 */}
      <div className="w-[50%] bg-[#F8F9FA] p-12 overflow-y-auto">
        {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
        <div
          className="prose prose-lg max-w-full"
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}
        />
      </div>
    </div>
  );
}
