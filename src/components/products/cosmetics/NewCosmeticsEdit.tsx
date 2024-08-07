import React, { useEffect, useRef, useState } from "react";
import { MdCancel, MdDelete, MdDrafts } from "react-icons/md";
import { FaCheckCircle, FaDraft2Digital } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CameraIcon } from "@heroicons/react/24/solid";
import useVendorCategories from "../../../hooks/useVendorCategories";
import { Brand } from "../../../services/vendor-category-sevice";
import apiClient from "../../../services/api-client";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from "../../text-editor/simpleMDE/TextEditor";
import { Product } from "../../../services/clothes-service";
import { useNavigate, useParams } from "react-router-dom";

// type FormData = z.infer<typeof schema>;
// interface Image {
//   preview: string;
//   name: string;
// }

interface ProductImage {
  file: File;
  preview: string;
}

const NewCosmeticsEdit = () => {


  useEffect(() => {
    setModalId(targetProduct?.model_id?.toString());
    setProNameEn(targetProduct?.name_en);
    setProNameAr(targetProduct?.name_ar);
    setBrand(targetProduct?.brand?.id?.toString());
    if (targetProduct.categories) {
      setCategory(targetProduct?.categories[0]?.id?.toString());
      setSubBrandCategory(targetProduct?.categories[1]?.id);
    }
    setPrice(targetProduct?.price);
    setPercentage(targetProduct?.discount);
    if (targetProduct?.variants) {
      const { sku, stock } = targetProduct?.variants[0];
      setBagObject({ sku, quantity: stock?.toString() });
    }
  }, []);

  // STATE VARIABLES
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Partial<Brand>>(
    {} as Brand
  );
  const [ingredientsAr, setIngredientsAr] = useState("");
  const [ingredientsEn, setIngredientsEn] = useState("");

  const [proPrice, setPrice] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [proNameEn, setProNameEn] = useState<string>("");
  const [proNameAr, setProNameAr] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subBrandCategory, setSubBrandCategory] = useState<number>();

  const [brand, setBrand] = useState<string>("");

  const [prodDescripAr, setProdDescripAr] = useState("");
  const [prodDescripEn, setProdDescripEn] = useState("");
  const [fitSizeEn, setFitSizeEn] = useState("");
  const [fitSizeAr, setFitSizeAr] = useState("");

  const [activeTab, setActiveTab] = useState("productInfo");

  //CATEGORIES
  const { vendorCategories } = useVendorCategories();

  const clothesCategory = vendorCategories.find((i) => i.name === "Cosmetics");
  const clothesCategoryChields = clothesCategory?.childs;
  const brandCategories = clothesCategory?.brands.map((b) => ({
    id: b.id,
    categories: b.categories,
  }));

  useEffect(() => {
    if (brandCategories) {
      const selectedItem = brandCategories?.find((b) => b.id === Number(brand));
      if (selectedItem) {
        setSelectedBrand(selectedItem);
      }
    }
  }, [brand]);

  // ERRORS STATES
  const [, setThumbnailImgError] = useState(false);
  const [, setProductFilesError] = useState(false);
  const [isSetSubmitButton, setSubmitButton] = useState(false);


const navigate = useNavigate();

  // SUBMIT FUNCTION
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // FIELDS ERRORS

    const formData = new FormData();

    formData.append("model_id", modalId);
    // PRODUCT TYPE
    formData.append("product_type", "cosmetics");
    formData.append("product_sub_type", "cosmetics");

    // THUMBNAIL
    if (thumbnailImg) {
      formData.append("thumbnail", thumbnailImg);
    } else {
      setThumbnailImgError(true);
    }
    // PRODUCTS IMAGES
    if (productFiles) {
      productFiles.map((img, idx) => {
        formData.append(`images[${idx}]`, img);
      });
    } else {
      setProductFilesError(true);
    }

    // NAMES IN ENGLISH & ARABIC
    formData.append("name_en", proNameEn);
    formData.append("name_ar", proNameAr);

    // SUB CATEGORY & BRAND
    formData.append("brand_id", brand);
    formData.append("categories[0][id]", category);
    if (subBrandCategory) {
      formData.append("categories[1][id]", subBrandCategory?.toString());
    }

    if (bagObject.sku || bagObject.quantity) {
      formData.append(`variants[0][sku]`, bagObject.sku);
      formData.append(`variants[0][size_id]`, "1");
      formData.append(`variants[0][stock]`, bagObject.quantity);
    }

    // TEXT EDITOR
    formData.append(`desc_en`, prodDescripEn);
    formData.append(`desc_ar`, prodDescripAr);
    formData.append(`about_product_desc_en`, fitSizeEn);
    formData.append(`about_product_desc_ar`, fitSizeAr);
    formData.append(`ingredients_desc_ar`, ingredientsAr);
    formData.append(`ingredients_desc_en`, ingredientsEn);

    // PRICE
    formData.append(`price`, proPrice.toString());
    formData.append(`discount`, percentage.toString());
    formData.append(`_method`, 'PUT');

    try {
      setSubmitButton(true);
      await apiClient.post(`/products/${targetProduct?.id}`, formData);

      toast.success("The product has been created successfully.", {
        autoClose: 500, // Duration in milliseconds (2 seconds)
        onClose: () => navigate("/products"),
      });

      setSubmitButton(false);

      setProductImages([]);
      setProductFiles([]);

      setThumbnailImg(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (filesInputRef.current) {
        filesInputRef.current.value = "";
      }

      setProNameAr("");
      setProNameEn("");
      setCategory("");
      setBrand("");
      setSubBrandCategory(0);
      setPrice(0);
      setPercentage(0);

      if (localStorage.getItem("prodDescripEn")) {
        localStorage.removeItem("prodDescripEn");
      }
      if (localStorage.getItem("prodDescripAr")) {
        localStorage.removeItem("prodDescripAr");
      }
      if (localStorage.getItem("fitSizeAr")) {
        localStorage.removeItem("fitSizeAr");
      }
      if (localStorage.getItem("fitSizeEn")) {
        localStorage.removeItem("fitSizeEn");
      }
      if (localStorage.getItem("ingredientsAr")) {
        localStorage.removeItem("ingredientsAr");
      }
      if (localStorage.getItem("ingredientsEn")) {
        localStorage.removeItem("ingredientsEn");
      }

    } catch (error: any) {
      setSubmitButton(false);
      toast.error(error.response.data.data.error);
      console.log("=>",error.response.data.data.error);
    }
  };

  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const [thumbnailImg, setThumbnailImg] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setThumbnailImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const removeFile = (image: ProductImage) => {
    setProductImages((prevImages) => prevImages.filter((img) => img !== image));
    setProductFiles((prev) => prev.filter((file) => file !== image.file));

    if (filesInputRef.current) {
      filesInputRef.current.value = ""; // Reset the file input
    }
  };

  // THUMBNAIL IMAGE
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailImg(e.target.files[0]);
    }
  };
  // PRODUCT IMAGES
  const handleProductImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setProductFiles((prev) => [...prev, ...files]);
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setProductImages((prevImages) => [...prevImages, ...newImages]);
      // Clear the input value to allow re-adding the same image
      if (filesInputRef.current) {
        filesInputRef.current.value = "";
      }
    }
  };

  const handleNamesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.currentTarget.value.replace(/\s+/g, ""); // Remove all spaces
    setValue(value); // Update the input value
    if (!value.trim()) {
      setError("Please fill out this field!");
    } else {
      setError("");
    }
  };
  // CHANGE SUB_CLOTHS STATE

  const [bagObject, setBagObject] = useState({ sku: "", quantity: "" });

  useEffect(() => {
    if (bagObject.sku !== "") {
      localStorage.setItem("bagFormFields", JSON.stringify(bagObject));
    }
  }, [bagObject]);

  const [modalId, setModalId] = useState("");

  const [proNameArError, setProNameArError] = useState("");
  const [proNameEnError, setProNameEnError] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };

  const [targetProduct, setTargetProduct] = useState<Product>({} as Product);
  // const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    apiClient
      .get<{ data: Product }>(`products/${id}`)
      .then((res) => {
        setTargetProduct(res.data.data);
        console.log(res.data.data);
      })
      .catch((err: any) => console.log(err.message));
  }, []);

  useEffect(() => {
    setModalId(targetProduct?.model_id?.toString());
    setProNameEn(targetProduct?.name_en);
    setProNameAr(targetProduct?.name_ar);
    setBrand(targetProduct?.brand?.id?.toString());


    if (targetProduct.categories) {
      setCategory(targetProduct?.categories[0]?.id?.toString());
      setSubBrandCategory(targetProduct?.categories[1]?.id);
    }


    setPrice(targetProduct?.price);
    setPercentage(targetProduct?.discount);
    if (targetProduct?.variants) {
      const { sku, stock } = targetProduct?.variants[0];
      setBagObject({ sku, quantity: stock?.toString() });
    }
  }, [targetProduct]);



  const [, setPreviousThumbnail] = useState("");
  const [, setPreviousImage] = useState("");

  const removePreviousFile = (imageId: string) => {
    try {
      apiClient
        .delete(`thumbnail/${imageId}`)
        .then(() => setPreviousImage(""))
        .catch((err) => console.log(err));
    } catch (error) {}
  };

  const handleRemovePreviousImage = () => {
    try {
      apiClient
        .delete("thumbnail/id")
        .then(() => setPreviousThumbnail(""))
        .catch((err) => console.log(err));
    } catch (error) {}
  };

  return (
    <form
      onSubmit={onSubmit}
      className="container mx-auto px-8 shadow-2xl rounded-xl p-10"
    >
      <ToastContainer />

      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setActiveTab("productInfo")}
          className={`btn btn-outline text-xl ${
            activeTab === "productInfo" ? "text-[#577656]" : "text-[#1B1B1B80]"
          }`}
        >
          {activeTab === "descriptionPrice" || activeTab === "arPreview" ? (
            <FaCheckCircle className="text-[#577656]" />
          ) : (
            <span className="rounded-full w-4 h-4 bg-[#577656]"></span>
          )}{" "}
          Product Information
        </button>

        <IoIosArrowForward className="mx-3" />
        <button
          type="button"
          onClick={() => setActiveTab("descriptionPrice")}
          className={`btn btn-outline text-xl ${
            activeTab === "descriptionPrice"
              ? "text-[#577656]"
              : "text-[#1B1B1B80]"
          }`}
        >
          {activeTab === "arPreview" ? (
            <FaCheckCircle className="text-[#577656]" />
          ) : (
            <span
              className={`rounded-full w-4 h-4 bg-[#1B1B1B80]  ${
                activeTab === "arPreview" ? "bg-[#577656]" : ""
              } `}
            ></span>
          )}
          Description & Price
        </button>
        <IoIosArrowForward className="mx-3" />
        <button
          type="button"
          onClick={() => setActiveTab("arPreview")}
          className={`btn btn-outline text-xl`}
        >
          <span
            className={`rounded-full w-4 h-4 bg-[#1B1B1B80] ${
              activeTab === "arPreview" ? "bg-[#577656]" : ""
            }`}
          ></span>
          AR Preview
        </button>
      </div>

      {activeTab === "productInfo" && (
        <div className="flex flex-col mt-8">
          <div>
            <h1 className="text-2xl font-bold mb-8">
              {targetProduct.thumbnail
                ? "Previous Thumbnail Image"
                : "Thumbnail Image"}
            </h1>
            {targetProduct.thumbnail && (
              <>
                <div className="relative w-[200px]">
                  <img
                    src={targetProduct?.thumbnail}
                    alt="Thumbnail Preview"
                    className="object-cover h-[100%] w-[100%]"
                  />
                  <button
                    type="button"
                    className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                    onClick={handleRemovePreviousImage}
                  >
                    <MdDelete className="text-5xl text-white" />
                  </button>
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 items-center  w-fit p-4 my-6">
              {thumbnailImg && (
                <div className="relative w-[200px]">
                  <img
                    src={URL.createObjectURL(thumbnailImg)}
                    alt="Thumbnail Preview"
                    className="object-cover h-[100%] w-[100%]"
                  />
                  <button
                    type="button"
                    className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                    onClick={handleRemoveImage}
                  >
                    <MdDelete className="text-5xl text-white" />
                  </button>
                </div>
              )}
              <div className=" ">
                {!targetProduct.thumbnail && (
                  <>
                    <div className="relative ">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        hidden
                        id="thumbnail"
                        ref={fileInputRef}
                      />
                      {!thumbnailImg && (
                        <label
                          className="relative cursor-pointer flex flex-col gap-2 border-4 border-dashed border-[#BFBFBF] w-[160px] h-40 items-center justify-center"
                          htmlFor="thumbnail"
                        >
                          <CameraIcon
                            width={100}
                            className="absolute top-5 left-10"
                          />
                        </label>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* handle images */}
          <div>
            {targetProduct?.images?.length > 0 && (
              <>
                <h1 className="text-2xl font-bold mt-8">Previous Images</h1>
                <div className="flex gap-4 flex-wrap items-center">
                  {targetProduct &&
                    targetProduct?.images?.map((item, index) => (
                      <div key={index} className="relative">
                        <img
                          src={item.image}
                          alt={`Product Preview ${index}`}
                          className="max-w-xs max-h-40"
                        />
                        <button
                          type="button"
                          className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                          onClick={() => removePreviousFile(item.id.toString())}
                        >
                          <MdDelete className="text-5xl text-white" />
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
            <h1 className="text-2xl font-bold mt-8">Images</h1>
            <div className="flex border w-fit my-6 p-4">
              <div className="flex gap-4 flex-wrap items-center">
                {productImages &&
                  productImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Product Preview ${index}`}
                        className="max-w-xs max-h-40"
                      />
                      <button
                        type="button"
                        className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                        onClick={() => removeFile(image)}
                      >
                        <MdDelete className="text-5xl text-white" />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="relative">
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImagesChange}
                  hidden
                  ref={filesInputRef}
                />
                <label
                  className="relative cursor-pointer flex flex-wrap gap-8 border-4 border-dashed border-[#BFBFBF] items-center justify-center"
                  htmlFor="images"
                >
                  <CameraIcon width={100} className="ml-8 mr-4 my-8" />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-2xl font-bold">General Information</h1>
            <div className="flex items-center gap-52 mt-10">
              <label className="text-xl font-bold">Model ID</label>
              <input
                name="modalId"
                value={modalId}
                onChange={(e) => setModalId(e.currentTarget.value)}
                className="input input-bordered"
                min={0}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex gap-40 items-center mt-10">
              <p className="text-xl font-semibold">Product Name</p>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (English)</label>
                <input
                  id="proNameEn"
                  type="text"
                  value={proNameEn}
                  className="input input-bordered"
                  onChange={(e) =>
                    handleNamesChange(e, setProNameEn, setProNameEnError)
                  }
                />
                {proNameEnError && (
                  <p className="text-xl underline text-red-600">
                    {proNameEnError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (Arabic)</label>
                <input
                  value={proNameAr}
                  id="proNameAr"
                  className="input input-bordered"
                  onChange={(e) =>
                    handleNamesChange(e, setProNameAr, setProNameArError)
                  }
                />
                {proNameArError && (
                  <p className="text-xl underline text-red-600">
                    {proNameArError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-20 items-center">
              <h1 className="text-xl font-bold mt-8">Sub Category & Brand</h1>
              <div className="flex items-center gap-10 justify-center mt-10">
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Select App sub categories</label>
                  <select
                    id="category"
                    value={category}
                    className="select select-bordered w-full grow"
                    onChange={(e) => {
                      setCategory(e.currentTarget.value);
                    }}
                  >
                    <option value="" disabled selected>
                      Select App Sub Category
                    </option>
                    {clothesCategoryChields?.map((i, idx) => (
                      <option key={idx} value={`${i.id}`}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Brand</label>
                  <select
                    // {...register("brand")}
                    value={brand}
                    id="brand"
                    className="select select-bordered w-full  grow"
                    onChange={(e) => setBrand(e.currentTarget.value)}
                  >
                    <option value="" disabled selected>
                      Select Brand
                    </option>
                    {clothesCategory?.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Select Brand sub categories</label>
                  <select
                    id="subBrandCategory"
                    value={subBrandCategory}
                    onChange={(e) =>
                      setSubBrandCategory(Number(e.currentTarget.value))
                    }
                    className="select select-bordered w-full grow"
                  >
                    <option value="" disabled selected>
                      Select Brand Sub Category
                    </option>
                    {selectedBrand.categories?.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-32 mt-10">
              <div>
                <h1 className="text-xl font-semibold">Size</h1>
                <p className="text-[#47546780]">Pick available sizes</p>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <label className="text-xl">SKU</label>
                <input
                  name="sku"
                  value={bagObject.sku}
                  className="input input-bordered"
                  onChange={(e) => {
                    setBagObject({
                      ...bagObject,
                      sku: e.currentTarget.value,
                    });
                  }}
                  min={0}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div>
                <h1>Size</h1>
                <input
                  type="text"
                  value="Standard Size"
                  className="input input-bordered mt-2"
                />
              </div>
              <div>
                <h1>Quantity</h1>
                <input
                  value={bagObject.quantity}
                  type="text"
                  className="input input-bordered mt-2"
                  onChange={(e) => {
                    setBagObject({
                      ...bagObject,
                      quantity: e.currentTarget.value,
                    });
                  }}
                  min={0}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => setActiveTab("descriptionPrice")}
                className="btn mt-10 px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === "descriptionPrice" && (
        <div className="flex flex-col mt-8">
          {/* Product Information tab content */}
          <div>
            <h1 className="text-xl font-bold">Description</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1 className="mb-2">Description (Arabic)</h1>
                <TextEditor
                  localKey={"prodDescripAr"}
                  onHtmlContent={(htmlContent: string) =>
                    setProdDescripAr(htmlContent)
                  }
                  prodDesc={targetProduct?.desc_ar}
                />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Description (English)</h1>
                <TextEditor
                  localKey={"prodDescripEn"}
                  onHtmlContent={(htmlContent: string) =>
                    setProdDescripEn(htmlContent)
                  }
                  prodDesc={targetProduct?.desc_en}
                />
              </div>
            </div>
            <h1 className="text-xl font-bold mt-6">ingredients & Details</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1 className="mb-2">ingredients & Details (Arabic)</h1>
                <TextEditor
                  localKey={"ingredientsAr"}
                  onHtmlContent={(htmlContent: string) =>
                    setIngredientsAr(htmlContent)
                  }
                  prodDesc={targetProduct?.ingredients_desc_en}

                />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">ingredients & Details (English)</h1>
                <TextEditor
                  localKey={"ingredientsEn"}
                  onHtmlContent={(htmlContent: string) =>
                    setIngredientsEn(htmlContent)
                  }
                  prodDesc={targetProduct?.ingredients_desc_en}
                />
              </div>
            </div>
            <h1 className="text-xl font-bold mt-6">About the product</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1 className="mb-2">About the product (Arabic)</h1>
                <TextEditor
                  localKey={"fitSizeAr"}
                  onHtmlContent={(htmlContent: string) =>
                    setFitSizeAr(htmlContent)
                  }
                  prodDesc={targetProduct?.about_product_desc_ar}

                />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">About the product (English)</h1>
                <TextEditor
                  localKey={"fitSizeEn"}
                  onHtmlContent={(htmlContent: string) => {
                    setFitSizeEn(htmlContent);
                  }}
                  prodDesc={targetProduct?.about_product_desc_ar}
                />
              </div>
            </div>
            <div className="mt-10">
              <h1 className="text-xl">Price</h1>
              <div className="mt-5 flex flex-col gap-4 max-w-72">
                <label>Price</label>
                <input
                  value={proPrice}
                  onChange={(e) => setPrice(Number(e.currentTarget.value))}
                  className="input input-bordered"
                />
              </div>
              <div className="flex gap-40 items-center  mt-10">
                <div className=" flex flex-col gap-2 ">
                  <label>Sale percentage</label>
                  <input
                    value={percentage}
                    onChange={(e) =>
                      setPercentage(Number(e.currentTarget.value))
                    }
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Your content here */}
          <div className="flex items-center gap-5 justify-end">
            <button
              type="button"
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20   text-xl hover:bg-[#87ae85] mr-32"
            >
              <FaDraft2Digital /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === "arPreview" && (
        <div className="flex flex-col justify-center mt-8">
          <div className="flex justify-between items-start mt-8">
            <div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider">
                  Product Name
                </h1>
                <div className="mt-2 flex  gap-10">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Product Name (Arabic)
                    </h1>
                    <div className="border p-5 rounded-lg">{proNameAr}</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Product Name (English)
                    </h1>
                    <div className="border p-5 rounded-lg">{proNameEn}</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-2xl font-bold tracking-wider">
                  Sub Category & Brand
                </h1>
                <div className="mt-2 flex flex-wrap gap-10 max-w-3xl">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      App sub categories
                    </h1>
                    <div className="border p-5 rounded-lg min-w-64">
                      {category}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Brand
                    </h1>
                    <div className="border p-5 rounded-lg min-w-64">
                      {brand}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Brand sub categories
                    </h1>
                    <div className="border p-5 rounded-lg min-w-64">
                      {subBrandCategory}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-2xl font-bold tracking-wider">
                  Description
                </h1>
                <div className="mt-2 flex flex-wrap gap-10 ">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Description (Arabic)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("prodDescripAr")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Description (English)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("prodDescripEn")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-2xl font-bold tracking-wider">
                  ingredients & Details
                </h1>
                <div className="mt-2 flex flex-wrap gap-10 ">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      ingredients & Details (Arabic)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("ingredientsAr")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      ingredients & Details (English)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("ingredientsAr")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-2xl font-bold tracking-wider">
                  Fit & Size
                </h1>
                <div className="mt-2 flex flex-wrap gap-10 ">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Fit & Size (Arabic)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("fitSizeAr")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Fit & Size (English)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {localStorage.getItem("fitSizeEn")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-2xl flex flex-col gap-4 ">
              <div className="border p-4 rounded-xl">
                {thumbnailImg && (
                  <div className="min-w-[400px] border rounded-xl">
                    <img
                      src={URL.createObjectURL(thumbnailImg)}
                      className="w-[100%] object-cover"
                    />
                  </div>
                )}
                <div className="flex max-w-2xl mt-16 max-h-64 ">
                  <div className="carousel w-full">
                    {productImages &&
                      productImages.map((image, idx) => (
                        <div
                          key={idx}
                          id={`slide${idx + 1}`}
                          className="carousel-item relative w-full rounded-xl"
                        >
                          <img
                            src={image.preview}
                            className="w-full object-cover rounded-xl"
                          />
                          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a
                              href={`#slide${
                                idx === 0 ? productImages.length : idx
                              }`}
                              className="btn btn-circle"
                            >
                              ❮
                            </a>
                            <a
                              href={`#slide${
                                idx === productImages.length - 1 ? 1 : idx + 2
                              }`}
                              className="btn btn-circle"
                            >
                              ❯
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-8 min-w-[300px]">
                  <h1 className="text-2xl font-bold tracking-wider">
                    {" "}
                    Pricing
                  </h1>
                  <div className="mt-2 flex flex-col flex-wrap gap-10 ">
                    <div className="flex flex-col gap-3">
                      <h1 className="text-lg font-semibold tracking-wider">
                        Price
                      </h1>
                      <div className="border p-5 rounded-lg min-w-36">
                        {proPrice}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h1 className="text-lg font-semibold tracking-wider">
                        Sale Percentage
                      </h1>
                      <div className="border p-5 rounded-lg min-w-36">
                        {percentage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-end items-center">
            <button
              type="button"
              className="btn  self-end px-20 bg-[#BED3C4] mr-8 text-white text-xl "
            >
              <MdDrafts /> Save Draft
            </button>
            <button
              type="submit"
              className="btn  self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
            >
              {isSetSubmitButton ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default NewCosmeticsEdit;
