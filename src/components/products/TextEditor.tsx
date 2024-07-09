import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  onEditorContent: (text: string) => void;
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ],
};

const formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "align",
];

const TextEditor: React.FC<TextEditorProps> = ({ onEditorContent }) => {
  const [editorContent, setEditorContent] = useState<string>("");

  const handleEditorChange = (
    content: string,
    _delta: any,
    _source: string,
    editor: any
  ) => {
    const text = editor.getText().trim(); // Get text content without HTML tags
    setEditorContent(text);
    onEditorContent(text);
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default TextEditor;
