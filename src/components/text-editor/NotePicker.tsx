import React, { useEffect, useState } from "react";
import Tiptap from "./Tiptap";

interface TodoProps {
  onEditorContent: (content: string) => void;
}

const Todo: React.FC<TodoProps> = ({ onEditorContent }) => {
  const [content, setContent] = useState<string>("");

  const stripHtmlTags = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const handleContentChange = (newContent: string) => {
    const plainTextContent = stripHtmlTags(newContent);
    setContent(plainTextContent);
    onEditorContent(plainTextContent);
  };

  return (
    <div className="max-w-3xl w-full grid place-items-center mx-auto pt-5 mb-10">
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </div>
  );
};

export default Todo;
