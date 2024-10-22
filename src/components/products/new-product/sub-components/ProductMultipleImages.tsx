import { useCallback, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { MdDelete } from "react-icons/md";

const ProductMultipleImages = ({
  onProductImages,
  images,
  setImages,
  previews,
  setPreviews,
}: {
  onProductImages: (imgs: File[]) => void;
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  // Function to handle dropped files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Update images state
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
    // Generate preview URLs for the images
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  }, []);

  useEffect(() => {
    if (images && images.length > 0) {
      onProductImages(images);
    } else {
      onProductImages([]);
    }
  }, [images, previews]);

  // Correctly typing the accept prop for images
  const accept: Accept = {
    "image/jpeg": [".jpeg", ".jpg"], // Add valid extensions for JPEG
    "image/png": [".png"], // Add valid extension for PNG
    "image/gif": [".gif"], // Add valid extension for GIF
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept, // Accept only images
    multiple: true, // Enable multiple file selection
  });

  const handleDeleteProductImage = (idx: number) => {
    // Remove the image from the images state by filtering out the image at the given index
    setImages((prevImages) => prevImages.filter((_, index) => index !== idx));

    // Also remove the corresponding preview
    setPreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== idx)
    );
  };

  return (
    <div className="w-full p-4 border border-dashed border-gray-400 my-5">
      <div
        {...getRootProps()}
        className="cursor-pointer bg-gray-50 p-4 text-center rounded-md"
      >
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select images</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative border rounded-md group" // Add group class here
          >
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="w-full h-40 object-cover"
            />
            <p
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer p-2 rounded-full bg-white shadow-md"
              onClick={() => handleDeleteProductImage(index)}
            >
              <MdDelete className="text-2xl text-red-600" />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMultipleImages;
