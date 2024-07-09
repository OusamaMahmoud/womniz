import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HiMiniCamera } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

const ProductDropZone = ({ className, onSubmit }) => {
  const maxSize = 50 * 1024 * 1024; // 50MB

  const [file, setFile] = useState(null);
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    if (file) onSubmit([file]);
  }, [file]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      const newFile = acceptedFiles[0];
      setFile(
        Object.assign(newFile, { preview: URL.createObjectURL(newFile) })
      );
    }

    if (rejectedFiles?.length) {
      setRejected(rejectedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    maxSize,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data URIs to avoid memory leaks
    return () => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;
    // console.log(file);
    // onSubmit([file]);

    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("upload_preset", "your_preset");

    // const data = await fetch(URL, {
    //   method: "POST",
    //   body: formData,
    // }).then((res) => res.json());

    // console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="flex items-center gap-10 border p-4 w-fit">
        {file ? (
          <div className="relative h-40 w-52 rounded-md shadow-lg">
            <img
              src={file.preview}
              alt={file.name}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
              className="h-full w-full object-cover rounded-md"
            />
            <button
              type="button"
              className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
              onClick={removeFile}
            >
              <MdDelete className="text-5xl text-white" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps({
              className: "cursor-pointer border-2 border-dashed p-4",
            })}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center gap-2">
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag & drop an image here, or click to select an image</p>
              )}
              <HiMiniCamera className="text-[80px]" />
            </div>
          </div>
        )}
      </section>
    </form>
  );
};

const ProductDropZoneJustImg = ({ onSubmit }) => {
  return (
    <dialog id="my_modal_1" className="modal w-[800px]">
      <div className="modal-box">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-lg">Service category (Arabic)</h3>
            <input type="text" className="input input-bordered mt-2 w-full" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Service category (English)</h3>
            <input type="text" className="input input-bordered mt-2 w-full" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Service name</h3>
            <input type="text" className="input input-bordered mt-2 w-full" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Service Price</h3>
            <input type="text" className="input input-bordered mt-2 w-full" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sales percentage</h3>
            <select className="input input-bordered mt-2 w-full"></select>
          </div>
          <div>
            <h3 className="font-bold text-lg">Time taken for this service</h3>
            <select className="input input-bordered mt-2 w-full"></select>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Thumbnail Image</h3>
          <ProductDropZone onSubmit={onSubmit} />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ProductDropZoneJustImg;
