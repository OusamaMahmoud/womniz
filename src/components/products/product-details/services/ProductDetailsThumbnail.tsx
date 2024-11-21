import { ChangeEvent, useState } from "react";
import { ProductDetailsHeading } from "../ProductDetailsUI";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import apiClient from "../../../../services/api-client";
import { showToast } from "../../../reuse-components/ShowToast";
import { useLoading } from "../../../../contexts/LoadingContext";
import ProductMultipleImages from "../../new-product/sub-components/ProductMultipleImages";
import { ImageDownIcon } from "lucide-react";

export interface ProductImage {
  id: string;
  image: string;
}

const ProductDetailsThumbnail = ({
  thumbnail,
  images,
  productId,
}: {
  thumbnail: string;
  images: ProductImage[];
  productId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal visibility
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [thumbnailImg, setThumbnailImg] = useState(thumbnail);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const handleThumbnailFile = (e: ChangeEvent<HTMLInputElement>) => {
    const thumbnail = e.target.files && e.target?.files[0];
    if (thumbnail) setThumbnailFile(thumbnail);

    const blob = thumbnail && URL.createObjectURL(thumbnail);
    if (blob) setThumbnailPreview(blob);
  };

  const { setLoading } = useLoading();

  const handelChangeThumbnailImg = async () => {
    console.log("");
    const formData = new FormData();
    if (thumbnailFile) formData.append("image", thumbnailFile);
    try {
      setLoading(true);
      const res = await apiClient.post(
        `/products/updatethumbnail/${productId}`,
        formData
      );
      console.log(res);
      showToast(
        "The Product Thumbnail has been Updated Successfully.",
        "success"
      );

      if (thumbnailFile) {
        const blob = thumbnail && URL.createObjectURL(thumbnailFile);
        if (blob) setThumbnailImg(blob);
      }
      setLoading(false);

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!.", "error");
      setLoading(false);
    }
  };

  // State to manage images
  const [imageList, setImageList] = useState(images);

  // Function to handle the delete action
  const handleDelete = async (imageId: string) => {
    try {
      setLoading(true);
      // Send the DELETE request to the API
      const response = await apiClient.post(`/product-images/${imageId}`, {
        _method: "delete",
      });
      console.log(response);
      // Remove the deleted image from the state
      setImageList((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
      showToast("Image deleted successfully!", "success");
      setLoading(false);
    } catch (error) {
      console.error(error);
      showToast("Something went wrong while deleting the image.", "error");
      setLoading(false);
    }
  };

  const [productImages, setProductImages] = useState<File[]>([]);
  const [additionalImgs, setAdditionalImgs] = useState<File[]>([]);
  const [additionalImgsPreviews, setAdditionalImgsPreviews] = useState<
    string[]
  >([]);

  const handleUpdateScreen = () => {
    const blobImgs: ProductImage[] = productImages.map((imgFile, index) => {
      const blob = URL.createObjectURL(imgFile);
      return { id: index.toString(), image: blob };
    });
    setImageList((prev) => [...prev, ...blobImgs]);
  };
  const [imagesLoading, setImagesLoading] = useState(false);
  const handleAddAdditionlsImgs = async () => {
    const formImagesData = new FormData();

    productImages.forEach((item, idx) => {
      formImagesData.append(`images[${idx}]`, item);
    });

    try {
      setImagesLoading(true);
      // Send the DELETE request to the API
      const response = await apiClient.post(
        `/product-images/upload/${productId}`,
        formImagesData
      );
      console.log(response);
      // Remove the deleted image from the state
      showToast("Images have been added successfully!", "success");
      handleUpdateScreen();
      handleToggleModal("CLOSE");
      setImagesLoading(false);
    } catch (error) {
      console.error(error);
      showToast("Something went wrong..", "error");
      setImagesLoading(false);
    }
  };

  const handleToggleModal = (KEY: "OPEN" | "CLOSE") => {
    const modal = document.getElementById(
      "additionalsImages"
    ) as HTMLDialogElement;
    if (modal) {
      KEY === "OPEN" ? modal.showModal() : modal.close();
    }
  };
  return (
    <div className="border w-full 2xl:max-w-3xl mt-4 rounded-s-xl rounded-e-xl overflow-hidden shadow-md order-1 lg:order-none">
      <dialog id="additionalsImages" className="modal">
        <div className="modal-box max-w-xl mt-8 ">
          <p className="flex justify-between items-center font-medium gap-2 p-3  bg-slate-50 rounded-md">
            <span className="flex items-center  gap-2">
              Add Product Images <ImageDownIcon />
            </span>
            {imagesLoading && <span className="loading loading-spinner"></span>}
          </p>
          <ProductMultipleImages
            onProductImages={(images) => setProductImages(images)}
            images={additionalImgs}
            setImages={setAdditionalImgs}
            previews={additionalImgsPreviews}
            setPreviews={setAdditionalImgsPreviews}
          />
          <button
            className="btn bg-[#B6C9B599] px-8 mr-4"
            onClick={handleAddAdditionlsImgs}
          >
            Add Product Images
          </button>
          <button
            className="btn btn-outline"
            onClick={() => handleToggleModal("CLOSE")}
          >
            Close
          </button>
        </div>
      </dialog>
      <ProductDetailsHeading
        handleEditBtn={() => handleToggleModal("OPEN")}
        label="Thumbnail & Images"
        actionKey="Add"
      />
      <div className="flex flex-col items-center justify-center">
        {/* Main Thumbnail */}
        <div className="w-96 h-64 overflow-hidden rounded-lg mt-4 relative">
          {/* Thumbnail Image */}
          <img
            src={thumbnailImg}
            className="w-full h-full object-cover object-center"
            alt="Thumbnail"
          />

          {/* Overlay for Main Thumbnail */}
          <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-semibold">Thumbnail Image</span>

            {/* Edit Icon */}
            <button
              className="absolute top-2 right-2 p-2 bg-white rounded-full text-black hover:bg-gray-300"
              onClick={handleOpenModal}
            >
              <AiOutlineEdit size={20} />
            </button>
          </div>

          {/* Modal to edit thumbnail */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[550px]">
                <h3 className="text-lg font-semibold mb-4">Edit Thumbnail</h3>
                <div className="mb-3">
                  <input
                    type="file"
                    className="file-input  mb-4"
                    onChange={handleThumbnailFile}
                    // Add any necessary onChange handler to update the image preview or upload logic
                  />
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      className="w-full h-full object-cover object-center"
                      alt="Thumbnail"
                    />
                  )}
                </div>
                <div className="mt-10">
                  <button
                    onClick={handelChangeThumbnailImg}
                    className="bg-[#B6C9B599] hover:bg-[#93b09299] transition duration-150  px-12  py-2 mr-3 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="btn-ghost px-12  py-2  rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Thumbnails */}
        <div className="flex flex-wrap gap-4 justify-center items-center my-4 px-4">
          {imageList.map((image, index) => (
            <div
              key={image.id}
              className="w-36 h-36 overflow-hidden shadow-lg p-1 rounded-lg relative"
            >
              <img
                src={image.image}
                className="w-full h-full object-cover object-center"
                alt={`Thumbnail ${index + 1}`}
              />
              {/* Overlay for Each Thumbnail */}
              <div className="absolute inset-0 bg-black bg-opacity-55 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-semibold">
                  Image {index + 1}
                </span>

                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(image.id)} // Trigger delete action
                  className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-100"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductDetailsThumbnail;
