import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { IoCloseCircle } from "react-icons/io5";

const Dropzone = ({ className, onSubmit }) => {
  const maxSize = 50 * 1024 * 1024; // 50MB

  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    onSubmit(files);
  }, [files]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
          if (file.type === "application/pdf") {
            return file;
          } else {
            return Object.assign(file, { preview: URL.createObjectURL(file) });
          }
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

  useEffect(() => {
    // Revoke the data URIs to avoid memory leaks
    return () =>
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
  }, [files]);

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
    // console.log(files);
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
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex  items-center justify-center gap-2">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
          <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Preview */}
      <section className="mt-2">
        <div className="flex gap-4 justify-between items-center">
          <h3 className="title text-sm font-semibold text-neutral-600 mt-2 border-b pb-3">
            Accepted Files
          </h3>
         {files.length > '0' && <button
            type="button"
            onClick={removeAll}
            className="mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 transition-colors"
          >
            Remove all files
          </button>}
        </div>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
          {files.map((file) => (
            <li key={file.name} className="relative h-10 rounded-md shadow-lg">
              {file.type === "application/pdf" ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-neutral-500 text-[12px] font-medium">
                    PDF File
                  </p>
                  <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    className="w-4 h-4 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                    onClick={() => removeFile(file.name)}
                  >
                    <IoCloseCircle />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    className="h-full w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    className="w-4 h-4 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                    onClick={() => removeFile(file.name)}
                  >
                    <IoCloseCircle />
                  </button>
                  <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                    {file.name}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Rejected Files */}
        {/* <h3 className="title text-lg font-semibold text-neutral-600 mt-5 border-b pb-3">
          Rejected Files
        </h3>
        <ul className="mt-6 flex flex-col">
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-neutral-500 text-sm font-medium">
                  {file.name}
                </p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul> */}
      </section>
    </form>
  );
};

export default Dropzone;
