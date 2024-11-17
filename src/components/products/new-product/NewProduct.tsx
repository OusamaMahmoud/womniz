import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NewProductFormSchema, {
  NewProductFormData,
} from "../../validation-schems/products/new-product-schema";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import Container from "../../reuse-components/Container";
import { RiErrorWarningLine } from "react-icons/ri";
import AddProductThumbnailImage from "./sub-components/AddProductThumbnailImage";
import ProductMultipleImages from "./sub-components/ProductMultipleImages";
import { ImageDownIcon } from "lucide-react";
import { useState } from "react";
import apiClient from "../../../services/api-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useBrands from "../../../hooks/useBrands";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../reuse-components/ShowToast";

const NewProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormData>({
    resolver: zodResolver(NewProductFormSchema),
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [productImages, setProductImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const onSubmit = async (data: NewProductFormData) => {
    const formData = new FormData();

    formData.append("name_en", data.name_en); // 1
    formData.append("name_ar", data.name_ar); // 2
    formData.append("desc_en", data.desc_en); // 3
    formData.append("desc_ar", data.desc_ar); // 4
    formData.append("price", data?.price?.toString()); // 5
    formData.append("discount", data?.discount?.toString()); // 6
    formData.append("model_id", data.model); // 7
    formData.append("brand_id", data.brand); // 7
    formData.append("seller_sku", data.sellerSKU); // 8
    formData.append("stock", data.stock?.toString()); // 8

    // -----------------------------

    if (data?.thumbnail !== null && data?.thumbnail?.length > 0) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    // -----------------------------

    if (productImages && productImages.length > 0) {
      productImages.map((productIMG, idx) => {
        formData.append(`images[${idx}]`, productIMG);
      });
    }

    try {
      await apiClient.post("/products", formData);
      setThumbnailPreview(null);
      setImages([]);
      setPreviews([]);
      reset();
      showToast(
        "WOo! Your Product has been Created Successfully.",
        "success",
        {
          delay: 1500,
          navigateTo: "/add-product-categories",
        },
        navigate
      );
    } catch (error: any) {
      console.log("it =>", error);
      if (error?.response?.status == 422) {
        toast.error(error?.response?.data?.data?.error, {
          position: "top-center",
          style: { width: "400px", height: "100px", fontSize: "18px" },
        });
      } else {
        toast.error(
          "Oops Sorry Something went Wrong ,Please Check your Network connection.",
          {
            position: "top-center",
            style: { width: "400px", height: "100px", fontSize: "18px" },
          }
        );
      }
    }
  };

  const formInputs = [
    {
      label: "Product Name (English)",
      inputName: "name_en" as const,
      type: "text",
      num: false,
      error: errors.name_en,
      errorMsg: errors.name_en?.message,
      class: `input input-bordered grow ${errors.name_en && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Product Name (Arabic)",
      inputName: "name_ar" as const,
      type: "text",
      num: false,
      error: errors.name_ar,
      errorMsg: errors.name_ar?.message,
      class: `input input-bordered grow ${errors.name_ar && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Product Description (English)",
      inputName: "desc_en" as const,
      type: "text",
      num: false,
      error: errors.desc_en,
      errorMsg: errors.desc_en?.message,
      class: `input input-bordered grow ${errors.desc_en && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Product Description (Arabic)",
      inputName: "desc_ar" as const,
      type: "text",
      num: false,
      error: errors.desc_ar,
      errorMsg: errors.desc_ar?.message,
      class: `input input-bordered grow ${errors.desc_ar && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Price",
      inputName: "price" as const,
      type: "number",
      num: true,
      error: errors.price,
      errorMsg: errors.price?.message,
      class: `input input-bordered grow ${errors.price && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Discount",
      inputName: "discount" as const,
      type: "number",
      num: true,
      error: errors.discount,
      errorMsg: errors.discount?.message,
      class: `input input-bordered grow ${errors.discount && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Model ID",
      inputName: "model" as const,
      type: "text",
      num: false,
      error: errors.model,
      errorMsg: errors.model?.message,
      class: `input input-bordered grow ${errors.model && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Seller Sku",
      inputName: "sellerSKU" as const,
      type: "text",
      num: false,
      error: errors.sellerSKU,
      errorMsg: errors.sellerSKU?.message,
      class: `input input-bordered grow ${errors.sellerSKU && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Stock",
      inputName: "stock" as const,
      type: "number",
      num: true,
      error: errors.stock,
      errorMsg: errors.stock?.message,
      class: `input input-bordered grow ${errors.stock && "border-[red]"}`,
      selectInput: false,
    },
    {
      label: "Brand",
      inputName: "brand" as const,
      type: "text",
      num: false,
      error: errors.brand,
      errorMsg: errors.brand?.message,
      class: `input input-bordered grow ${errors.brand && "border-[red]"}`,
      selectInput: true,
    },
  ];

  const { brands } = useBrands(false);

  return (
    <Container horizontalPadding={"10"} verticalMargin={"10"}>
      <ToastContainer />
      <HeadingOne label="Create New Product" marginBottom="2" />

      <p className="divider divider-vertical "></p>

      <AddProductThumbnailImage
        control={control}
        errors={errors}
        register={register}
        onThumbnailPreview={(preview) => setThumbnailPreview(preview)}
        thumbnailPreview={thumbnailPreview}
      />

      <div className="max-w-xl mt-8 ">
        <p className="flex font-medium gap-2 p-3  bg-slate-50 rounded-md">
          Add Product Images <ImageDownIcon />
        </p>
        <ProductMultipleImages
          onProductImages={(images) => setProductImages(images)}
          images={images}
          setImages={setImages}
          previews={previews}
          setPreviews={setPreviews}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* FormInputs */}
        <div
          className="flex flex-col items-center  lg:gap-x-8 
            sm:flex-row sm:flex-wrap sm:gap-4 "
        >
          {formInputs.map((input) => (
            <div key={input.inputName} className="form-control lg:w-1/3">
              <label className="label">
                <span className="label-text">{input.label}</span>
              </label>
              <div className="flex items-center gap-2  ">
                {input.selectInput ? (
                  <select
                    {...register("brand")}
                    className="select select-bordered grow"
                  >
                    <option value={""}>Select A Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name_en}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    placeholder={`${input.label}...`}
                    type={input.type}
                    className={`${input.class} placeholder:text-sm `}
                    {...register(
                      input.inputName,
                      input.num ? { valueAsNumber: true } : {}
                    )}
                  />
                )}
                {input.error && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {input.error && (
                <p className="text-[red] text-xs mt-3 ">{input.errorMsg}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-8  ">
          <button type="submit" className="btn btn-outline px-20 text-lg">
            {isSubmitting ? "Submitting..." : " Save and Go Next"}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default NewProduct;
