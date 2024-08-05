import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

const TextEditor = ({ onHtmlContent, localKey, prodDesc }) => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(localKey) || "";
  });

  useEffect(() => {
    const stripHtmlTags = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };
    
    setContent(stripHtmlTags(prodDesc));
  }, [prodDesc]);

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

export default TextEditor;
