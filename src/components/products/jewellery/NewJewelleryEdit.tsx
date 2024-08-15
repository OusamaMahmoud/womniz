import React, { useEffect, useRef, useState } from "react";
import { BiArrowToBottom } from "react-icons/bi";
import { MdDelete, MdDrafts } from "react-icons/md";
import { FaCheckCircle, FaDraft2Digital } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import useSizes from "../../../hooks/useSizes";
import { CameraIcon } from "@heroicons/react/24/solid";
import useVendorCategories from "../../../hooks/useVendorCategories";
import { Brand } from "../../../services/vendor-category-sevice";
import apiClient from "../../../services/api-client";
import { toast, ToastContainer } from "react-toastify";
import TextEditor from "../../text-editor/simpleMDE/TextEditor";
import RingsDynamicForm from "./RingsDynamicForm";
import { Product } from "../../../services/clothes-service";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../CustomSelect";
import useColorPalette from "../../../hooks/useColorPalette";
import TextEditorForReturn from "../TextEditorForReturn";
import useVendors from "../../../hooks/useVendors";

interface ProductImage {
  file: File;
  preview: string;
}

const NewJewelleryEdit = () => {
  const [targetProduct, setTargetProduct] = useState<Product>({} as Product);
  // const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    apiClient
      .get<{ data: Product }>(`products/${id}`)
      .then((res) => {
        setTargetProduct(res.data.data);
      })
      .catch((err: any) => console.log(err.message));
  }, []);

  // Images States
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [thumbnailImg, setThumbnailImg] = useState<File | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<Partial<Brand>>(
    {} as Brand
  );
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
  const [modalId, setModalId] = useState("");
  const [materialEn, setMaterialEn] = useState("");
  const [materialAr, setMaterialAr] = useState("");

  // Rings Object
  const [ringSizes, setRingsSizes] = useState<
    {
      size: string;
      quantity: string;
      sku: string;
    }[]
  >([]);

  // Necklace Object
  const [necklaceObject, setNecklaceObject] = useState({
    sku: "",
    quantity: "",
    neckLength: "",
  });

  // Earing Object
  const [earingObject, setEaringObject] = useState({
    sku: "",
    quantity: "",
    earingLength: "",
  });

  // Bracelets Object
  const [braceletObject, setBraceletsObject] = useState({
    sku: "",
    quantity: "",
    braceletLength: "",
  });

  // FETCH Sizes of Rings.
  const { sizes } = useSizes({ productType: "ring" });

  // ERRORS STATES
  const [, setThumbnailImgError] = useState(false);
  const [, setProductFilesError] = useState(false);

  const [isSetSubmitButton, setSubmitButton] = useState(false);

  const [proNameArError, setProNameArError] = useState("");
  const [proNameEnError, setProNameEnError] = useState("");

  // TAPS And SUB_TAPS
  const [activeTab, setActiveTab] = useState("productInfo");
  const [subJewelry, setSubJewelry] = useState(targetProduct?.product_sub_type);

  const [clothesSizes] = useState<
    | {
        size: string;
        quantity: string;
        sku: string;
      }[]
  >([]);
  const [shoesSizes] = useState<
    {
      size: string;
      quantity: string;
      sku: string;
    }[]
  >([]);

  // FETCH CATEGORIES
  const { vendorCategories } = useVendorCategories();

  const jewelleryCategory = vendorCategories.find(
    (i) => i.name === "Jewellery"
  );
  const jewelleryCategoryChields = jewelleryCategory?.childs;

  const brandCategories = jewelleryCategory?.brands.map((b) => ({
    id: b.id,
    categories: b.categories,
  }));

  const navigate = useNavigate();
  useEffect(() => {
    if (brandCategories) {
      const selectedItem = brandCategories?.find((b) => b.id === Number(brand));
      if (selectedItem) {
        setSelectedBrand(selectedItem);
      }
    }
  }, [brand]);

  useEffect(() => {
    console.log(targetProduct);
  }, [targetProduct]);

  useEffect(() => {
    if (modalId !== null) {
      setModalId(targetProduct?.model_id?.toString());
    }
    setProNameEn(targetProduct?.name_en);
    setProNameAr(targetProduct?.name_ar);
    setSelectedColorHexa(targetProduct?.color?.hexa);
    setBrand(targetProduct?.brand?.id?.toString());
    setSelectedColorID(targetProduct?.color?.id);
    setSelectedColorHexa(targetProduct?.color?.hexa);
    setTargetThumbnailImage(targetProduct.thumbnail);
    setTargetImages(targetProduct?.images);
    setSelectedVendorId(targetProduct?.vendor?.id?.toString());

    if (targetProduct.categories) {
      setCategory(targetProduct?.categories[0]?.id?.toString());
      setSubBrandCategory(targetProduct?.categories[1]?.id);
    }
    setSubJewelry(targetProduct?.product_sub_type?.toLowerCase());
    console.log("sub",subJewelry)

    setMaterialAr(targetProduct.material_ar);
    setMaterialEn(targetProduct.material_en);

    setPrice(targetProduct?.price);
    setPercentage(targetProduct?.discount);

    if (subJewelry?.toLowerCase() === "ring") {
      if (targetProduct.variants) {
        setRingsSizes([
          ...targetProduct?.variants?.map((va) => ({
            sku: va?.sku?.toString(),
            quantity: va?.stock?.toString(),
            size: va?.size?.toString(),
          })),
        ]);
      }
    }

    if (subJewelry?.toLowerCase() === "necklace") {
      if (targetProduct?.variants) {
        const { sku, stock } = targetProduct?.variants[0];
        setNecklaceObject({
          neckLength: targetProduct.chain_length,
          quantity: stock.toString(),
          sku,
        });
      }
    }

    if (subJewelry?.toLowerCase() === "earing") {
      if (targetProduct?.variants) {
        const { sku, stock } = targetProduct?.variants[0];
        setEaringObject({
          earingLength: targetProduct.dimension,
          quantity: stock.toString(),
          sku,
        });
      }
    }

    if (subJewelry?.toLowerCase() === "bracelet") {
      console.log("bracelet");
      if (targetProduct?.variants) {
        const { sku, stock } = targetProduct?.variants[0];
        setBraceletsObject({
          braceletLength: targetProduct?.chain_length,
          quantity: stock?.toString(),
          sku,
        });
      }
    }
  }, [targetProduct]);

  const handleDeleteTargetImages = async (id: number) => {
    setTargetImages((prev) => [...prev.filter((item) => item.id !== id)]);

    try {
      await apiClient.delete(`/product-images/${id}`);
      toast.success("🎉 Previous Image is Deleted Successfully!");
    } catch (error: any) {
      setErrorRemovePreviousFile(error);
      setTargetImages(targetProduct?.images);
      toast.error("❌ Oops!, Something went wrong!");
    }
  };
  const [, setErrorRemovePreviousFile] = useState("");

  // SUBMIT FUNCTION

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    // PRODUCT TYPE
    formData.append("product_type", "jewellery");
    formData.append("product_sub_type", subJewelry);

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
    formData.append("model_id", modalId);
    formData.append("name_en", proNameEn);
    formData.append("name_ar", proNameAr);

    formData.append("material_en", materialEn);
    formData.append("material_ar", materialAr);

    // SUB CATEGORY & BRAND
    formData.append("brand_id", brand);
    formData.append("categories[0][id]", category);

    if (subBrandCategory) {
      formData.append("categories[1][id]", subBrandCategory?.toString());
    }

    // RINGS SIZE
    if (ringSizes.length > 0 && ringSizes[0].sku) {
      ringSizes.map((obj, idx) => {
        formData.append(`variants[${idx}][sku]`, obj.sku);
        formData.append(`variants[${idx}][size_id]`, obj.size);
        formData.append(`variants[${idx}][stock]`, obj.quantity);
      });
    }

    // NECKLACE SIZE
    if (necklaceObject.sku && necklaceObject.neckLength) {
      formData.append(`variants[0][sku]`, necklaceObject.sku);
      formData.append(`variants[0][size_id]`, "1");
      formData.append(`variants[0][stock]`, necklaceObject.quantity);
      formData.append(`chain_length`, necklaceObject.neckLength);
    }

    // EARINGS SIZE
    if (earingObject.earingLength && earingObject.sku) {
      formData.append(`variants[0][sku]`, earingObject.sku);
      formData.append(`variants[0][size_id]`, "1");
      formData.append(`variants[0][stock]`, earingObject.quantity);
      formData.append(`dimension`, earingObject.earingLength);
    }
    // BRACELETS SIZE
    if (braceletObject.braceletLength && braceletObject.sku) {
      formData.append(`variants[0][sku]`, braceletObject.sku);
      formData.append(`variants[0][size_id]`, "1");
      formData.append(`variants[0][stock]`, braceletObject.quantity);
      formData.append(`chain_length`, braceletObject.braceletLength);
    }

    // TEXT EDITOR
    formData.append(`desc_en`, prodDescripEn);
    formData.append(`desc_ar`, prodDescripAr);
    formData.append(`fit_size_desc_en`, fitSizeEn);
    formData.append(`fit_size_desc_ar`, fitSizeAr);
    formData.append(`return_order_desc_en`, returnEn);
    formData.append(`return_order_desc_ar`, returnAr);
    // PRICE
    formData.append(`price`, proPrice.toString());
    formData.append(`discount`, percentage.toString());
    formData.append(`color_id`, selectedColorID.toString());
    formData.append(`vendor_id`, selectedVendorId.toString());

    formData.append(`_method`, "PUT");

    try {
      setSubmitButton(true);
      await apiClient.post(`/products/${targetProduct?.id}`, formData);

      toast.success("The product has been created successfully.", {
        autoClose: 500, // Duration in milliseconds (2 seconds)
        onClose: () => navigate("/products"),
      });

      setSubmitButton(false);

      // Clear Fields...
      setProductImages([]);
      setProductFiles([]);

      setThumbnailImg(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (filesInputRef.current) {
        filesInputRef.current.value = "";
      }

      setModalId("");
      setProNameAr("");
      setProNameEn("");
      setCategory("");
      setBrand("");
      setSubBrandCategory(0);
      setPrice(0);
      setPercentage(0);
      setMaterialAr("");
      setMaterialEn("");
      setModalId("");
      setSelectedColorHexa("");

      if (localStorage.getItem("ring")) {
        localStorage.removeItem("ring");
        setRingsSizes([{ size: "", sku: "", quantity: "" }]);
      }
      if (localStorage.getItem("necklace")) {
        localStorage.removeItem("necklace");
        setNecklaceObject({ sku: "", neckLength: "", quantity: "" });
      }
      if (localStorage.getItem("earing")) {
        localStorage.removeItem("earing");
        setEaringObject({ sku: "", earingLength: "", quantity: "" });
      }
      if (localStorage.getItem("bracelet")) {
        localStorage.removeItem("bracelet");
        setBraceletsObject({ sku: "", braceletLength: "", quantity: "" });
      }

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

      setActiveTab("productInfo");
    } catch (error: any) {
      setSubmitButton(false);
      toast.error(error.response.data.data.error);
    }
  };
  const [returnableValue, setReturnableValue] = useState("yes");
  const [returnAr, setReturnAr] = useState("");
  const [returnEn, setReturnEn] = useState("");
  // Handle Product Images.

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setThumbnailImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };
  const handleRemoveThumbnailImage = async () => {
    setTargetThumbnailImage("");
  };
  const removeFile = (image: ProductImage) => {
    setProductImages((prevImages) => prevImages.filter((img) => img !== image));
    setProductFiles((prev) => prev.filter((file) => file !== image.file));

    if (filesInputRef.current) {
      filesInputRef.current.value = ""; // Reset the file input
    }
  };
  const [targetImages, setTargetImages] = useState(targetProduct?.images);

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

  const [bagObject] = useState({ sku: "", quantity: "" });

  // Set Necklace in local_storage
  useEffect(() => {
    if (necklaceObject.sku !== "") {
      localStorage.setItem("necklace", JSON.stringify(necklaceObject));
    }
  }, [necklaceObject]);

  // Set Earing in local_storage
  useEffect(() => {
    if (earingObject.sku !== "") {
      localStorage.setItem("earing", JSON.stringify(earingObject));
    }
  }, [earingObject]);

  // Set Bracelets in local_storage
  useEffect(() => {
    if (braceletObject.sku !== "") {
      localStorage.setItem("bracelet", JSON.stringify(braceletObject));
    }
  }, [braceletObject]);

  //PAST
  // const [pastSubClothes, setPastSubClothes] = useState("");

  //NEXT
  const [, setNextSubCloths] = useState("");

  // const cancelFunc = () => {
  //   const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
  //   if (modal) {
  //     modal.showModal();
  //   }
  // };
  const { vendors } = useVendors({});

  useEffect(() => {
    console.log("these are the vendors names => ", vendors);
  }, [vendors]);

  const [selectedVendorId, setSelectedVendorId] = useState(
    targetProduct?.vendor?.id?.toString()
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };

  const { colors } = useColorPalette();
  const [selectedColorHexa, setSelectedColorHexa] = useState("");
  const [selectedColorID, setSelectedColorID] = useState(0);

  const handleColorsChange = (colorHexa: string, colorId: number) => {
    setSelectedColorHexa(colorHexa);
    setSelectedColorID(colorId);
  };

  const [targetThumbnailImage, setTargetThumbnailImage] = useState(
    targetProduct.thumbnail
  );

  return (
    <form
      onSubmit={onSubmit}
      className="container mx-auto px-8 shadow-2xl rounded-xl p-10"
    >
      <ToastContainer />
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
      </div>

      {/* Select Jewelry Type */}
      <div className="flex items-center">
        <select
          value={subJewelry}
          onChange={(e) => {
            const modal = document.getElementById(
              "my_modal_3"
            ) as HTMLDialogElement;
            if (modal) {
              modal.showModal();
            }
            setNextSubCloths(e.currentTarget.value);
          }}
          disabled
          className={`select select-bordered text-xl text-[#577656] mr-10`}
        >
          <option value={"ring"}>
            Ring <BiArrowToBottom />
          </option>
          <option value={"necklace"}>Necklace</option>
          <option value={"earing"}>Earring</option>
          <option value={"bracelet"}>Bracelets</option>
        </select>

        {/* Product & Info Button */}
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

        {/* ICON */}
        <IoIosArrowForward className="mx-3" />

        {/* Description & Price Button */}
        {subJewelry === "ring" && ringSizes && (
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
        )}

        {subJewelry === "necklace" && necklaceObject && (
          <button
            type="button"
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl ${
              activeTab === "descriptionPrice"
                ? "text-[#577656]"
                : "text-[#1B1B1B80]"
            }`}
          >
            <span
              className={`rounded-full w-4 h-4 bg-[#1B1B1B80]  ${
                activeTab === "arPreview" ? "bg-[#577656]" : ""
              } `}
            ></span>{" "}
            Description & Price
          </button>
        )}

        {subJewelry === "earing" && earingObject && (
          <button
            type="button"
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl`}
          >
            <span
              className={`rounded-full w-4 h-4 bg-[#1B1B1B80]  ${
                activeTab === "arPreview" ? "bg-[#577656]" : ""
              } `}
            ></span>{" "}
            Description & Price
          </button>
        )}

        {subJewelry === "bracelet" && braceletObject && (
          <button
            type="button"
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl`}
          >
            <span
              className={`rounded-full w-4 h-4 bg-[#1B1B1B80]  ${
                activeTab === "arPreview" ? "bg-[#577656]" : ""
              } `}
            ></span>{" "}
            Description & Price
          </button>
        )}

        {/* ICON */}
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
            <div>
              <h1 className="text-2xl font-bold mb-8">
                {targetThumbnailImage
                  ? "Previous Thumbnail Image"
                  : "Thumbnail Image"}
              </h1>

              {targetThumbnailImage && (
                <>
                  <div className="relative w-[200px]" data-aos="fade-out">
                    <img
                      src={targetThumbnailImage}
                      alt="Thumbnail Preview"
                      className="object-cover h-[100%] w-[100%]"
                    />
                    <button
                      type="button"
                      className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                      onClick={handleRemoveThumbnailImage}
                    >
                      <MdDelete className="text-5xl text-white" />
                    </button>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-4 items-center  w-fit p-4 my-6">
                {thumbnailImg && (
                  <div className="relative w-[200px]" data-aos="fade-out">
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
                  {!targetThumbnailImage && (
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
              {targetImages?.length > 0 && (
                <>
                  <h1 className="text-2xl font-bold mt-8 mb-4">
                    Previous Images
                  </h1>
                  <div
                    className="flex gap-4 flex-wrap items-center"
                    data-aos="fade-out"
                  >
                    {targetProduct &&
                      targetImages?.map((item, index) => (
                        <div key={index} className="relative">
                          <img
                            src={item.image}
                            alt={`Product Preview ${index}`}
                            className="max-w-xs max-h-40"
                          />
                          <button
                            type="button"
                            className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%]"
                            onClick={() => handleDeleteTargetImages(item.id)}
                          >
                            <MdDelete className="text-5xl text-white" />
                          </button>
                        </div>
                      ))}
                  </div>
                </>
              )}
              <h1 className="text-2xl font-bold mt-8">Images</h1>
              <div className="flex border w-fit my-6 p-4" data-aos="fade-in">
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
          </div>
          <div className="mt-10">
            <h1 className="text-2xl font-bold">General Information</h1>
            <div className="flex  items-center" data-aos="fade-up">
              <h1 className="text-xl font-bold mt-8 w-64 mr-10 ">Returnable</h1>
              <div className="flex items-center gap-24 justify-center mt-10">
                <div className="flex gap-8">
                  <div className="flex flex-col justify-center items-center">
                    <label htmlFor="radio-yes">Yes</label>
                    <input
                      type="radio"
                      name="returnable"
                      id="radio-yes"
                      className="radio"
                      value="yes" // Value for Yes
                      defaultChecked
                      onClick={(e) => setReturnableValue(e.currentTarget.value)}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label htmlFor="radio-no">No</label>
                    <input
                      type="radio"
                      id="radio-no"
                      name="returnable"
                      className="radio"
                      value="no" // Value for No
                      onClick={(e) => setReturnableValue(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[220px] mt-10">
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
            <div className="flex items-center  mt-10" data-aos="fade-up">
              <label className="text-xl font-bold w-64 mr-10">
                Vendor Name
              </label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.currentTarget.value)}
                className="select select-bordered"
              >
                <option value={""}>Select Vendor Name</option>
                {vendors?.map((v) => (
                  <option value={v.id} defaultValue={selectedVendorId}>
                    {v.contactName}
                  </option>
                ))}
              </select>
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
            <div className="flex  items-center">
              <h1 className="text-xl font-bold mt-8 w-64 mr-10">
                Sub Category & Brand
              </h1>
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
                    {jewelleryCategoryChields?.map((i, idx) => (
                      <option key={idx} value={`${i.id}`}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Brand</label>
                  <select
                    value={brand}
                    id="brand"
                    className="select select-bordered w-full  grow"
                    onChange={(e) => setBrand(e.currentTarget.value)}
                  >
                    <option value="" disabled selected>
                      Select Brand
                    </option>
                    {jewelleryCategory?.brands?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-4 ">
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
                      <option
                        key={i.id}
                        value={i.id}
                        selected={subBrandCategory === i.id}
                      >
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex  items-center">
              <h1 className="text-xl font-bold mt-8 w-64 mr-10">Colors</h1>
              <div className="flex items-center gap-24 justify-center mt-10">
                <div className="flex flex-col gap-4">
                  <div>
                    <CustomSelect
                      colors={colors}
                      selectedColor={selectedColorHexa}
                      handleColorsChange={(a: string, b: number) =>
                        handleColorsChange(a, b)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex  items-center my-20">
              <h1 className="text-xl font-semibold w-64 mr-10">Material</h1>
              <div className="flex gap-24">
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Material (English)</label>
                  <input
                    id="materialEn"
                    type="text"
                    value={materialEn}
                    className="input input-bordered"
                    onChange={(e) => setMaterialEn(e.currentTarget.value)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Material (Arabic)</label>
                  <input
                    value={materialAr}
                    id="materialAr"
                    className="input input-bordered"
                    onChange={(e) => setMaterialAr(e.currentTarget.value)}
                  />
                </div>
              </div>
            </div>

            {subJewelry === "ring" ? (
              <>
                <div className="flex gap-40 mt-10">
                  <div>
                    <div>
                      <h1 className="text-xl font-semibold">Size</h1>
                      <p className="text-[#47546780]">Pick available sizes</p>
                    </div>
                  </div>
                  <div>
                    <RingsDynamicForm
                      sizes={sizes}
                      onSelectedSizes={(selectedSizes: any) =>
                        setRingsSizes(selectedSizes)
                      }
                      ringsSizes={ringSizes}
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
              </>
            ) : subJewelry === "necklace" ? (
              <>
                <div className="flex items-center gap-32 mt-10">
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <label className="text-xl">SKU</label>
                    <input
                      name="sku"
                      value={necklaceObject.sku}
                      className="input input-bordered"
                      onChange={(e) => {
                        setNecklaceObject({
                          ...necklaceObject,
                          sku: e.currentTarget.value,
                        });
                      }}
                      min={0}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div>
                    <h1>Length</h1>
                    <input
                      type="text"
                      value={necklaceObject.neckLength}
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setNecklaceObject({
                          ...necklaceObject,
                          neckLength: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <h1>Quantity</h1>
                    <input
                      value={necklaceObject.quantity}
                      type="text"
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setNecklaceObject({
                          ...necklaceObject,
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
              </>
            ) : subJewelry === "earing" ? (
              <>
                <div className="flex items-center gap-32 mt-10">
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <label className="text-xl">SKU</label>
                    <input
                      name="sku"
                      value={earingObject.sku}
                      className="input input-bordered"
                      onChange={(e) => {
                        setEaringObject({
                          ...earingObject,
                          sku: e.currentTarget.value,
                        });
                      }}
                      min={0}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div>
                    <h1>Dimension</h1>
                    <input
                      type="text"
                      value={earingObject.earingLength}
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setEaringObject({
                          ...earingObject,
                          earingLength: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <h1>Quantity</h1>
                    <input
                      value={earingObject.quantity}
                      type="text"
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setEaringObject({
                          ...earingObject,
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
              </>
            ) : subJewelry === "bracelet" ? (
              <>
                <div className="flex items-center gap-32 mt-10">
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <label className="text-xl">SKU</label>
                    <input
                      name="sku"
                      value={braceletObject.sku}
                      className="input input-bordered"
                      onChange={(e) => {
                        setBraceletsObject({
                          ...braceletObject,
                          sku: e.currentTarget.value,
                        });
                      }}
                      min={0}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div>
                    <h1>Length</h1>
                    <input
                      type="text"
                      value={braceletObject.braceletLength}
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setBraceletsObject({
                          ...braceletObject,
                          braceletLength: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <h1>Quantity</h1>
                    <input
                      value={braceletObject.quantity}
                      type="text"
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setBraceletsObject({
                          ...braceletObject,
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
              </>
            ) : (
              ""
            )}
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
                  prodDesc={targetProduct.desc_ar}
                />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Description (English)</h1>
                <TextEditor
                  localKey={"prodDescripEn"}
                  onHtmlContent={(htmlContent: string) =>
                    setProdDescripEn(htmlContent)
                  }
                  prodDesc={targetProduct.desc_en}
                />
              </div>
            </div>
            <h1 className="text-xl font-bold mt-6">Fit & Size</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1 className="mb-2">Fit & Size (Arabic)</h1>
                <TextEditor
                  localKey={"fitSizeAr"}
                  onHtmlContent={(htmlContent: string) =>
                    setFitSizeAr(htmlContent)
                  }
                  prodDesc={targetProduct.fit_size_desc_ar}
                />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Fit & Size (English)</h1>
                <TextEditor
                  localKey={"fitSizeEn"}
                  onHtmlContent={(htmlContent: string) =>
                    setFitSizeEn(htmlContent)
                  }
                  prodDesc={targetProduct.fit_size_desc_en}
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold mt-6">Return Order</h1>
              <div className="flex justify-around items-center gap-20 mt-4">
                <div className="grow flex flex-col xl:min-w-[680px]">
                  <h1 className="mb-2">Return Order (Arabic)</h1>
                  <TextEditorForReturn
                    localKey={"returnAr"}
                    onHtmlContent={(htmlContent: string) =>
                      setReturnAr(htmlContent)
                    }
                    returnPolicy={returnableValue}
                    lang="arabic"
                  />
                </div>
                <div className="grow flex flex-col">
                  <h1 className="mb-2">Return Order (English)</h1>
                  <TextEditorForReturn
                    localKey={"returnEn"}
                    onHtmlContent={(htmlContent: string) =>
                      setReturnEn(htmlContent)
                    }
                    returnPolicy={returnableValue}
                    lang="english"
                  />
                </div>
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
                <h1 className="text-2xl font-bold tracking-wider">Size</h1>
                {shoesSizes &&
                  shoesSizes.map((i, idx) => {
                    return (
                      <div key={idx} className="mt-4 flex flex-wrap gap-10 ">
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            SKU
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {i.sku}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            Size
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {i.size}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            Quantity
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {i.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {clothesSizes &&
                  clothesSizes.map((i, idx) => {
                    const target = sizes.find((si) => si.id === Number(i.size));
                    return (
                      <div key={idx} className="mt-4 flex flex-wrap gap-10 ">
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            SKU
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {i.sku}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            Size
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {target?.title}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h1 className="text-lg font-semibold tracking-wider">
                            Quantity
                          </h1>
                          <div className="border p-5 rounded-lg min-w-36">
                            {i.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {bagObject.sku && (
                  <div className="mt-2 flex flex-wrap gap-10 ">
                    <div className="flex flex-col gap-3">
                      <h1 className="text-lg font-semibold tracking-wider">
                        SKU
                      </h1>
                      <div className="border p-5 rounded-lg min-w-36">
                        {bagObject.sku}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h1 className="text-lg font-semibold tracking-wider">
                        Quantity
                      </h1>
                      <div className="border p-5 rounded-lg min-w-36">
                        {bagObject.quantity}
                      </div>
                    </div>
                  </div>
                )}
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
                      {targetProduct?.desc_ar}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Description (English)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {targetProduct?.desc_ar}
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
                      {targetProduct.fit_size_desc_ar}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h1 className="text-lg font-semibold tracking-wider">
                      Fit & Size (English)
                    </h1>
                    <div className="border p-5 rounded-lg min-w-36">
                      {targetProduct.fit_size_desc_en}
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

export default NewJewelleryEdit;
