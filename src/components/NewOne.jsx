import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

const NewOne = ({ onHtmlContent , localKey }) => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(localKey) || "";
  });

  const handleChange = (value) => {
    setContent(value);
    localStorage.setItem(localKey, value);
  };


  useEffect(() => {
    const rawHtml = marked(content);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    onHtmlContent(sanitizedHtml);
  }, [content]);

  return (
    <div className="text-editor">
      <SimpleMDE value={content} onChange={handleChange} />
    </div>
  );
};

export default NewOne;
