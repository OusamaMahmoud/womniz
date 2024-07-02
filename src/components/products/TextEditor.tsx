import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'mutationobserver-shim';

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean'],                                         // remove formatting button
  ],
};

const formats = [
  'header', 'font', 'list', 'bullet',
  'bold', 'italic', 'underline',
  'color', 'background', 'align'
];

const TextEditor: React.FC = () => {
  const [editorContent, setEditorContent] = useState<string>('');

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = () => {
    // Handle the form submission, e.g., send the editorContent to an API
    console.log('Submitted content:', editorContent);
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
