import React, { useEffect, useState } from "react";
import { BiArrowToBottom } from "react-icons/bi";
import { MdCancel, MdDelete } from "react-icons/md";
import { FaCheckCircle, FaDraft2Digital } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import useSizes from "../../../hooks/useSizes";
import ClothsDynamicForm from "./ClothsDynamicForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ShoesDynamicForm from "./ShoesDynamicForm";
import { CameraIcon } from "@heroicons/react/24/solid";
import Todo from "../../text-editor/NotePicker";
import useCategories from "../../../hooks/useCategories";
import useVendorCategories from "../../../hooks/useVendorCategories";
import { Brand } from "../../../services/vendor-category-sevice";

const schema = z.object({
  nameEn: z.string(),
  nameAr: z.string(),

  appSubCategory: z.string().min(1),
  brand: z.string().min(1),
  brandSubCategory: z.string().min(1),

  proBagSKU: z.string(),
  proBagQuantity: z.string(),

  salePercent: z.string(),
  price: z.string(),
});

type FormData = z.infer<typeof schema>;
interface Image {
  preview: string;
  name: string;
}
const NewClothes = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [thumbnailImg, setThumbnailImg] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<Image[] | null>();
  const [productFiles, setProductFiles] = useState<File[]>();
  const [selectedBrand, setSelectedBrand] = useState<Partial<Brand>>(
    {} as Brand
  );

  const [proPrice, setPrice] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [proNameEn, setProNameEn] = useState<string>("");
  const [proNameAr, setProNameAr] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const [clothesSizes, setClothesSizes] = useState<
    {
      size: string;
      quantity: string;
      sku: string;
    }[]
  >([]);

  const [shoesSizes, setShoesSizes] = useState<
    {
      size: string;
      quantity: string;
      sku: string;
    }[]
  >([]);

  const [prodDescripAr, setProdDescripAr] = useState("");
  const [prodDescripEn, setProdDescripEn] = useState("");
  const [fitSizeEn, setFitSizeEn] = useState("");
  const [fitSizeAr, setFitSizeAr] = useState("");

  const [proBagSkuValue, setProBagSkuValue] = useState("");
  const [proBagQuantityValue, setProBagQuantityValue] = useState("");

  const { sizes } = useSizes();
  const [shoes, setShoes] = useState(false);

  const [activeTab, setActiveTab] = useState("productInfo");
  const [subClothes, setSubClothes] = useState("cloths");

  //CATEGORIES
  const { vendorCategories } = useVendorCategories();

  const childs = vendorCategories.map((i) => ({ childs: i.childs, id: i.id }));
  const clothesCategory = vendorCategories.find((i) => i.name === "Clothes");
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
  const [thumbnailImgError, setThumbnailImgError] = useState(false);
  const [productFilesError, setProductFilesError] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);

    const formData = new FormData();
    // PRODUCT TYPE
    formData.append("product_type", "clothes");
    formData.append("product_sub_type", subClothes);

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
    formData.append("name_en", data.nameEn);
    formData.append("name_ar", data.nameAr);

    // SUB CATEGORY & BRAND
    formData.append("brand_id", data.brand);
    formData.append("categories[0][id]", data.appSubCategory);
    formData.append("categories[1][id]", data.brandSubCategory);

    // CLOTHES SIZE
    if (clothesSizes) {
      clothesSizes.map((obj, idx) => {
        formData.append(`variants[${idx}][sku]`, obj.sku);
        formData.append(`variants[${idx}][size_id]`, obj.size);
        formData.append(`variants[${idx}][stock]`, obj.quantity);
      });
    }
    // CLOTHES SIZE
    if (shoesSizes) {
      shoesSizes.map((obj, idx) => {
        formData.append(`variants[${idx}][sku]`, obj.sku);
        formData.append(`variants[${idx}][size_id]`, obj.size);
        formData.append(`variants[${idx}][stock]`, obj.quantity);
      });
    }
    // CLOTHES SIZE
    if (data.proBagSKU || data.proBagQuantity) {
      formData.append(`variants[0][sku]`, data.proBagSKU);
      formData.append(`variants[0][stock]`, data.proBagQuantity);
    }

    // TEXT EDITOR
    formData.append(`desc_en`, prodDescripEn);
    formData.append(`desc_ar`, prodDescripAr);
    formData.append(`fit_size_desc_en`, fitSizeEn);
    formData.append(`fit_size_desc_ar`, fitSizeAr);

    // PRICE
    formData.append(`price`, proPrice.toString());
    formData.append(`discount`, percentage.toString());
  };

  const removeFile = (image: Image) => {
    setProductImages((prev) =>
      prev?.filter((item) => item.name !== image.name)
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailImg(e.target.files[0]);
    }
  };

  const handleProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setProductFiles(Array.from(e.target.files));
      const filesArray = Array.from(e.target.files).map((file) => ({
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setProductImages([...filesArray]);
    }
  };

  // CHANGE SUB_CLOTHS STATE

  const [bagObject, setBagObject] = useState({ sku: "", quantity: "" });

  useEffect(() => {
    if (bagObject.sku !== "") {
      localStorage.setItem("bagFormFields", JSON.stringify(bagObject));
    }
  }, [bagObject]);

  //PAST
  const [pastSubClothes, setPastSubClothes] = useState("");

  //NEXT
  const [nextSubCloths, setNextSubCloths] = useState("");

  useEffect(() => {
    if (localStorage.getItem("bagFormFields")) {
      setPastSubClothes("bags");
    } else if (localStorage.getItem("shoesFormFields")) {
      setPastSubClothes("shoes");
    } else {
      setPastSubClothes("cloths");
    }
  }, [subClothes]);


  useEffect(() => {
    setThumbnailImg(null)
    setProductImages(null)
    setProNameAr("");
    setProNameEn("");
    setCategory('')
    setBrand('')
  }, [subClothes]);
  const ignoreChanges = () => {
    setSubClothes(nextSubCloths);
    if (nextSubCloths === "cloths") {
      localStorage.removeItem("shoesFormFields");
      setBagObject({ sku: "", quantity: "" });
      localStorage.removeItem("bagFormFields");
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } else if (nextSubCloths === "shoes") {
      localStorage.removeItem("formFields");
      setBagObject({ sku: "", quantity: "" });
      localStorage.removeItem("bagFormFields");
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } else {
      localStorage.removeItem("formFields");
      localStorage.removeItem("shoesFormFields");
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto px-8 shadow-2xl rounded-xl p-10"
    >
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <p className="py-4 text-lg">All changes will be lost</p>
          <button
            onClick={ignoreChanges}
            className="p-4 bg-red-500 rounded-md text-white font-bold text-xl"
          >
            ok , I'm Sure!
          </button>
          <div className="modal-action">
            <button
              onClick={() => {
                setSubClothes(pastSubClothes);
                const modal = document.getElementById(
                  "my_modal_3"
                ) as HTMLDialogElement;
                if (modal) {
                  modal.close();
                }
              }}
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
        <button className="btn btn-outline">
          <MdCancel /> Cancel
        </button>
      </div>
      <div className="flex items-center">
        <select
          value={subClothes}
          onChange={(e) => {
            const modal = document.getElementById(
              "my_modal_3"
            ) as HTMLDialogElement;
            if (modal) {
              modal.showModal();
            }
            setNextSubCloths(e.currentTarget.value);
          }}
          className={`select select-bordered text-xl text-[#577656] mr-10`}
        >
          <option value={"cloths"}>
            Cloths <BiArrowToBottom />
          </option>
          <option value={"shoes"}>Shoes</option>
          <option value={"bags"}>Bags</option>
        </select>

        <button
          onClick={() => setActiveTab("productInfo")}
          className={`btn btn-outline text-xl ${
            activeTab === "productInfo" ? "text-[#577656]" : "text-[#1B1B1B80]"
          }`}
        >
          {activeTab === "productInfo" ? (
            <FaCheckCircle className="text-[#577656]" />
          ) : (
            <span className="rounded-full w-4 h-4 bg-[#577656]"></span>
          )}{" "}
          Product Information
        </button>

        <IoIosArrowForward className="mx-3" />
        {subClothes === "cloths" && clothesSizes && (
          <button
            disabled={
              !thumbnailImg ||
              !productFiles ||
              !proNameAr ||
              !proNameEn ||
              !category ||
              !brand ||
              !clothesSizes[0]?.sku ||
              !clothesSizes[0]?.quantity ||
              !clothesSizes[0]?.size
            }
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl ${
              activeTab === "descriptionPrice"
                ? "text-[#577656]"
                : "text-[#1B1B1B80]"
            }`}
          >
            <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span>{" "}
            Description & Price
          </button>
        )}
        {subClothes === "shoes" && (
          <button
            disabled={
              !thumbnailImg ||
              !productFiles ||
              !proNameAr ||
              !proNameEn ||
              !category ||
              !brand ||
              !shoesSizes[0]?.sku ||
              !shoesSizes[0]?.size ||
              !shoesSizes[0]?.quantity
            }
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl ${
              activeTab === "descriptionPrice"
                ? "text-[#577656]"
                : "text-[#1B1B1B80]"
            }`}
          >
            <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span>{" "}
            Description & Price
          </button>
        )}

        {subClothes === "bags" && (
          <button
            disabled={
              !thumbnailImg ||
              !productFiles ||
              !proNameAr ||
              !proNameEn ||
              !category ||
              !brand ||
              !bagObject.sku ||
              !bagObject.quantity
            }
            onClick={() => setActiveTab("descriptionPrice")}
            className={`btn btn-outline text-xl ${
              activeTab === "descriptionPrice"
                ? "text-[#577656]"
                : "text-[#1B1B1B80]"
            }`}
          >
            <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span>{" "}
            Description & Price
          </button>
        )}

        <IoIosArrowForward className="mx-3" />

        <button
          onClick={() => setActiveTab("arPreview")}
          className={`btn btn-outline text-xl ${
            activeTab === "arPreview" ? "text-[#577656]" : "text-[#1B1B1B80]"
          }`}
        >
          <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span> AR
          Preview
        </button>
      </div>

      {activeTab === "productInfo" && (
        <div className="flex flex-col mt-8">
          <div>
            <h1 className="text-2xl font-bold mb-8">Thumbnail Image</h1>
            <div className="relative my-6 border w-fit py-4 px-9">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                hidden
                id="thumbnail"
              />
              <label
                className=" relative cursor-pointer flex flex-col  gap-2 border-4 border-dashed border-[#BFBFBF]   w-[160px] h-40 items-center justify-center "
                htmlFor="thumbnail"
              >
                {!thumbnailImg && (
                  <CameraIcon width={100} className="absolute top-5 left-10" />
                )}
                {thumbnailImg && (
                  <img
                    src={URL.createObjectURL(thumbnailImg)}
                    alt="Thumbnail Preview"
                    className="object-cover h-[100%] w-[100%]"
                  />
                )}
              </label>
            </div>
          </div>
          {/* handle images */}
          <div>
            <h1 className="text-2xl font-bold mt-8">Images</h1>
            <div className="relative my-6 border w-fit py-4 px-9">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImagesChange}
                hidden
              />
              <label
                className="relative cursor-pointer flex flex-wrap gap-8 border-4 border-dashed border-[#BFBFBF]   items-center justify-center "
                htmlFor="images"
              >
                {productImages &&
                  productImages.map((image, index) => (
                    <div className="relative">
                      <img
                        key={index}
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
                <CameraIcon width={100} className="ml-8 mr-4 my-8" />
              </label>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-2xl font-bold">General Information</h1>

            <div className="flex gap-40 items-center mt-10">
              <p className="text-xl font-semibold">Product Name</p>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (English)</label>
                <input
                  {...register("nameEn")}
                  value={proNameEn}
                  className="input input-bordered"
                  onChange={(e) => setProNameEn(e.currentTarget.value)}
                />
                {errors.nameEn && (
                  <p className="text-xl underline text-red-600">
                    {errors.nameEn.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (Arabic)</label>
                <input
                  {...register("nameAr")}
                  value={proNameAr}
                  className="input input-bordered"
                  onChange={(e) => setProNameAr(e.currentTarget.value)}
                />
                {errors.nameAr && (
                  <p className="text-xl underline text-red-600">
                    {errors.nameAr.message}
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
                    {...register("appSubCategory")}
                    value={category}
                    className="select select-bordered w-full grow"
                    onChange={(e) => setCategory(e.currentTarget.value)}
                  >
                    <option value="" disabled selected>
                      Select App Sub Category
                    </option>
                    {childs.map((i, idx) => (
                      <option value={`${i.childs[idx].id}`}>
                        {i.childs[idx].name}
                      </option>
                    ))}
                  </select>
                  {errors.appSubCategory && (
                    <p className="text-red-600">
                      {errors.appSubCategory.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Brand</label>
                  <select
                    {...register("brand")}
                    value={brand}
                    className="select select-bordered w-full  grow"
                    onChange={(e) => setBrand(e.currentTarget.value)}
                  >
                    <option value="" disabled selected>
                      Select Brand
                    </option>
                    {clothesCategory?.brands.map((b) => (
                      <option value={b.id}>{b.name_en}</option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="text-red-600">{errors.brand.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xl">Select Brand sub categories</label>
                  <select
                    {...register("brandSubCategory")}
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.currentTarget.value)}
                    className="select select-bordered w-full grow"
                    disabled={brand ? false : true}
                  >
                    <option value="" disabled selected>
                      Select Brand Sub Category
                    </option>
                    {selectedBrand.categories?.map((i) => (
                      <option>{i.name}</option>
                    ))}
                  </select>
                  {errors.brandSubCategory && (
                    <p className="text-red-600">
                      {errors.brandSubCategory.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {subClothes === "shoes" ? (
              <>
                <div className="flex gap-40 mt-10">
                  <div>
                    <div>
                      <h1 className="text-xl font-semibold">Size</h1>
                      <p className="text-[#47546780]">Pick available sizes</p>
                    </div>
                  </div>
                  <div>
                    <ShoesDynamicForm
                      onSelectedSizes={(selectedSizes: any) =>
                        setShoesSizes(selectedSizes)
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={
                      !thumbnailImg ||
                      !productFiles ||
                      !proNameAr ||
                      !proNameEn ||
                      !category ||
                      !brand ||
                      !shoesSizes[0]?.sku ||
                      !shoesSizes[0]?.size ||
                      !shoesSizes[0]?.quantity
                    }
                    onClick={() => setActiveTab("descriptionPrice")}
                    className="btn mt-10 px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : subClothes === "cloths" ? (
              <>
                <div className="flex gap-40 items-center mt-10">
                  <div className="flex gap-40 mt-10">
                    <div>
                      <div>
                        <h1 className="text-xl font-semibold">Size</h1>
                        <p className="text-[#47546780]">Pick available sizes</p>
                      </div>
                    </div>
                    <div>
                      <ClothsDynamicForm
                        onSelectedSizes={(selectedSizes: any) =>
                          setClothesSizes(selectedSizes)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={
                      !thumbnailImg ||
                      !productFiles ||
                      !proNameAr ||
                      !proNameEn ||
                      !category ||
                      !brand ||
                      !clothesSizes[0]?.sku ||
                      !clothesSizes[0]?.quantity ||
                      !clothesSizes[0]?.size
                    }
                    onClick={() => setActiveTab("descriptionPrice")}
                    className="btn mt-10 px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : subClothes === "bags" ? (
              <>
                <div className="flex items-center gap-32 mt-10">
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <label className="text-xl">SKU</label>
                    <input
                      {...register("proBagSKU")}
                      name="sku"
                      value={bagObject.sku}
                      className="input input-bordered"
                      onChange={(e) => {
                        setBagObject({
                          ...bagObject,
                          sku: e.currentTarget.value,
                        });
                      }}
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
                      {...register("proBagQuantity")}
                      value={bagObject.quantity}
                      type="text"
                      className="input input-bordered mt-2"
                      onChange={(e) => {
                        setBagObject({
                          ...bagObject,
                          quantity: e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    disabled={
                      !thumbnailImg ||
                      !productFiles ||
                      !proNameAr ||
                      !proNameEn ||
                      !category ||
                      !brand ||
                      !bagObject.sku ||
                      !bagObject.quantity
                    }
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
                <Todo onEditorContent={(data) => setProdDescripAr(data)} />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Description (English)</h1>
                <Todo onEditorContent={(data) => setProdDescripEn(data)} />
              </div>
            </div>
            <h1 className="text-xl font-bold mt-6">Fit & Size</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1 className="mb-2">Fit & Size (Arabic)</h1>
                <Todo onEditorContent={(data) => setFitSizeAr(data)} />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Fit & Size (English)</h1>
                <Todo onEditorContent={(data) => setFitSizeEn(data)} />
              </div>
            </div>
            <div className="mt-10">
              <h1 className="text-xl">Price</h1>
              <div className="mt-5 flex flex-col gap-4 max-w-72">
                <label>Price</label>
                <input
                  {...register("price")}
                  onChange={(e) => setPrice(Number(e.currentTarget.value))}
                  className="input input-bordered"
                />
              </div>
              <div className="flex gap-40 items-center  mt-10">
                <div className=" flex flex-col gap-2 ">
                  <label>Sale percentage</label>
                  <input
                    {...register("salePercent")}
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
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20   text-xl hover:bg-[#87ae85] mr-32"
            >
              <FaDraft2Digital /> Save Draft
            </button>
            <button
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === "arPreview" && (
        <div className="flex flex-col mt-8">
          <div className="flex justify-between items-center">
            {/* {right part} */}
            <div>
              <div className="max-w-[600px] shadow-xl p-6 rounded-md">
                <div className="flex justify-between items-center mb-4 ">
                  <h1 className="text-2xl font-bold mb-4">
                    Product Information
                  </h1>
                  <p
                    onClick={() => setActiveTab("productInfo")}
                    className="border p-2 rounded-md cursor-pointer"
                  >
                    Edit
                  </p>
                </div>

                <div className="xl:min-w-[500px]">
                  <div className="flex justify-between items-center mb-2">
                    <span className=" text-xl text-[#00000066]">
                      Product Name
                    </span>
                    <span className="capitalize font-bold text-lg">
                      {proNameEn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Category</span>
                    <span className="capitalize font-bold text-lg">
                      {category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Sub Category
                    </span>
                    <span className="capitalize font-bold text-lg">
                      {subCategory}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Brand</span>
                    <span className="capitalize font-bold text-lg">
                      {brand}
                    </span>
                  </div>
                </div>
              </div>
              <div className="max-w-[600px]  mt-8 shadow-xl p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold ">Product Description</h1>
                  <p
                    onClick={() => setActiveTab("descriptionPrice")}
                    className="border p-2 rounded-md cursor-pointer"
                  >
                    Edit
                  </p>
                </div>
                <p className="text-xl text-[#00000066] capitalize font-bold">
                  {prodDescripEn ||
                    " White shirt with sleeves with unique design for sleeves which make your look very awesome"}
                </p>
              </div>
              <div className="max-w-[600px] mt-8 shadow-xl p-6 rounded-md">
                <div className="flex justify-between items-center  mb-4 ">
                  <h1 className="text-2xl font-bold ">Pricing Details</h1>
                  <p
                    onClick={() => setActiveTab("descriptionPrice")}
                    className="border p-2 rounded-md cursor-pointer"
                  >
                    Edit
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Price</span>
                  <span className="capitalize font-bold text-lg">
                    {proPrice}$
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Womniz Sale</span>
                  <span className="capitalize font-bold text-lg">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* {left part} */}
            <div className=" p-4 bg-white shadow-md rounded-lg w-[650px] h-[1050px]">
              <h1 className="text-2xl font-bold my-2">Card preview</h1>
              <div className="relative flex justify-center items-center h-[950px] w-full">
                <div className="absolute h-full w-full rounded-lg">
                  {thumbnailImg && (
                    <img
                      src={URL.createObjectURL(thumbnailImg)}
                      alt="Thumbnail Preview"
                      className="object-cover h-full rounded-md"
                    />
                  )}
                </div>
                <div className="bg-[#F6EFE9] relative top-[100px] my-10 max-w-[600px] rounded-md">
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-10 ">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-bold flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        White sleeve top
                      </span>
                      <span className="text-2xl font-bold">
                        {proPrice - proPrice * (1 / percentage)} Usd
                      </span>
                    </div>
                    <div className="collapse-content flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[#BFBFBF] max-w-80">
                          White shirt with sleeves with unique design for
                          sleeves which make your look very awesome
                        </p>
                        <p className="text-[#BFBFBF] flex flex-col gap-2 items-center">
                          <span className="line-through">{proPrice} Usd</span>
                          <span className="border p-1 rounded-md">
                            Save {percentage}%
                          </span>
                        </p>
                      </div>
                      <div className="flex  justify-between items-center my-4">
                        <p className="font-extrabold text-2xl">Size</p>
                        <p className="font-extrabold text-2xl flex flex-col gap-2 items-center">
                          Quantity
                        </p>
                      </div>
                      <div className="flex  justify-between items-center mb-2">
                        <p className=" flex gap-4">
                          <span className="w-fit border p-2">XS</span>
                          <span className="w-fit border p-2">S</span>
                          <span className="w-fit border p-2">M</span>
                          <span className="w-fit border p-2">L</span>
                          <span className="w-fit border p-2">XL</span>
                          <span className="w-fit border p-2">XXL</span>
                        </p>
                        <p className="text-[#BFBFBF] flex  gap-2 items-center">
                          <span className="border rounded-lg px-4 py-1 text-xl text-white bg-[#577656]">
                            +
                          </span>
                          <span className="font-extrabold border mx-2">0</span>

                          <span className="border rounded-lg px-4 py-1 text-xl ">
                            -
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-6 ">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Fit & Size
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        We operate traceability programs to ensure compliance
                        with our social, environmental, safety and health
                        standards. To ensure compliance, we have developed an
                        audit program and plans for continuous improvement.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10  border mb-6 ">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Return Order
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        30 days starting from buying date
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-6 ">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Shipping information
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        We operate traceability programs to ensure compliance
                        with our social, environmental, safety and health
                        standards. To ensure compliance, we have developed an
                        audit program and plans for continuous improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Your content here */}
          <button
            onClick={() => setActiveTab("productInfo")}
            className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
          >
            Finish
          </button>
        </div>
      )}
    </form>
  );
};

export default NewClothes;
