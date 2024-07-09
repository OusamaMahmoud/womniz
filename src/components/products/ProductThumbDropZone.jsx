import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete } from "react-icons/md";
import { HiMiniCamera } from "react-icons/hi2";

const ProductThumbDropZone = ({ className, onSubmit }) => {
  const maxSize = 50 * 1024 * 1024; // 50MB

  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    // Load saved files from localStorage
    const savedFiles = localStorage.getItem("ThumbnailImg");
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      const updatedFiles = parsedFiles.map((file) => {
        return {
          ...file,
          preview: file.preview || URL.createObjectURL(file),
        };
      });
      setFiles(updatedFiles);
    }
  }, []);

  useEffect(() => {
    // Save files to localStorage
    if (files.length > 0) {
      localStorage.setItem("ThumbnailImg", JSON.stringify(files));
    }
  }, [files, onSubmit]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
          return Object.assign(file, { preview: URL.createObjectURL(file) });
        }),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize,
    onDrop,
  });

  // useEffect(() => {
  //   // Revoke the data URIs to avoid memory leaks
  //   return () =>
  //     files.forEach((file) => {
  //       if (file.preview) {
  //         URL.revokeObjectURL(file.preview);
  //       }
  //     });
  // }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) return;
    // onSubmit(files);

    // const formData = new FormData()
    // files.forEach(file => formData.append('file', file))
    // formData.append('upload_preset', 'friendsbook')

    // const data = await fetch(URL, {
    //   method: 'POST',
    //   body: formData
    // }).then(res => res.json())

    // console.log(data)
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="flex items-center gap-10 border p-4 w-fit">
        <ul className="flex flex-wrap gap-10">
          {files.map((file, idx) => (
            <li
              key={file.name}
              className="relative h-40 w-52 rounded-md shadow-lg"
            >
              {file.type === "application/pdf" ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-neutral-500 text-[12px] font-medium">
                    PDF File
                  </p>
                  <p className="mt-2 text-neutral-500 text-sm font-medium">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#1b0a0a33] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                    onClick={() => removeFile(file.name)}
                  >
                    <MdDelete className="text-5xl text-white" />
                  </button>
                  {idx === 0 && (
                    <p className="top-[80%] absolute flex justify-center items-center text-center bg-[#00000033] w-[100%] rounded-t-lg p-1 text-white">
                      Default
                    </p>
                  )}
                </div>
              ) : (
                file.preview && (
                  <>
                    <img
                      src={file.preview}
                      alt={file.name}
                      // onLoad={() => {
                      //   URL.revokeObjectURL(file.preview);
                      // }}
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                      onClick={() => removeFile(file.name)}
                    >
                      <MdDelete className="text-5xl text-white" />
                    </button>
                    {idx === 0 && (
                      <p className="top-[80%] absolute flex justify-center items-center text-center bg-[#00000033] w-[100%] rounded-t-lg p-1 text-white">
                        Default
                      </p>
                    )}
                  </>
                )
              )}
            </li>
          ))}
        </ul>
        <div
          {...getRootProps({
            className: className,
          })}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2">
            <HiMiniCamera className="text-[80px] cursor-pointer" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default ProductThumbDropZone;
