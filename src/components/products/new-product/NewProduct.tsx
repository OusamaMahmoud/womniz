import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NewProductFormSchema, {
  NewProductFormData,
} from "../../validation-schems/products/new-product-schema";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import Container from "../../reuse-components/Container";
import { RiErrorWarningLine } from "react-icons/ri";
import AddProductSpecification from "./sub-components/AddProductSpecification";
import AddProductVariant from "./sub-components/AddProductVariant";
import AddProductThumbnailImage from "./sub-components/AddProductThumbnailImage";
import ProductMultipleImages from "./sub-components/ProductMultipleImages";
import { ImageDownIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import apiClient from "../../../services/api-client";
import AddProductCategories, {
  ProductOptionType,
} from "./sub-components/AddProductCategories";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormData>({
    resolver: zodResolver(NewProductFormSchema),
    defaultValues: {
      categories: [
        {
          mainCategory: {
            label: "Select a Main Category",
            value: 0,
          } as ProductOptionType,
          brand: {
            label: "Select a Main Brand",
            value: 0,
          } as ProductOptionType,
          subBrands: [] as ProductOptionType[],
          subCategories: [] as ProductOptionType[],
        },
      ],
      variants: [],
      specifications: [],
    },
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [productImagesError, setProductImagesError] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);

  const onSubmit = async (data: NewProductFormData) => {
    console.log("is It Repeat !!");
    console.log(data);
    const formData = new FormData();

    formData.append("name_en", data.name_en); // 1
    formData.append("name_ar", data.name_ar); // 2
    formData.append("desc_en", data.desc_en); // 3
    formData.append("desc_ar", data.desc_ar); // 4
    formData.append("price", data?.price?.toString()); // 5
    formData.append("discount", data?.discount?.toString()); // 6
    formData.append("model_id", data.model); // 7
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

    // // -------------------------------
    if (data.variants && data.variants.length > 0) {
      data?.variants.map((variant, idx) => {
        formData.append(
          `variants[${idx}][size]`,
          variant?.size_id?.toString()
        );

        formData.append(
          `variants[${idx}][color]`,
          variant?.color_id?.toString()
        );

        formData.append(`variants[${idx}][stock]`, variant?.stock?.toString());
        formData.append(`variants[${idx}][sku]`, variant?.sku);
        formData.append(`variants[${idx}][price]`, variant?.price?.toString());
        formData.append(
          `variants[${idx}][discount]`,
          variant?.discount?.toString()
        );
      });
    }

    // -------------------------------
    if (data?.specifications && data?.specifications?.length > 0) {
      data?.specifications?.map((specific, idx) => {
        formData.append(`specifications[${idx}][name_en]`, specific?.name_en);
        formData.append(`specifications[${idx}][name_ar]`, specific?.name_ar);
        formData.append(`specifications[${idx}][value_en]`, specific?.value_en);
        formData.append(`specifications[${idx}][value_ar]`, specific?.value_ar);
      });
    }

    // -------------------------------
    if (data?.categories && data?.categories?.length > 0) {
      let counter = 0;
      data?.categories?.map((category) => {
        category?.subCategories?.map((subCat) => {
          formData.append(
            `categories[${counter}][id]`,
            subCat?.value?.toString()
          );
          counter++;
        });
        category?.subBrands?.map((subBrand) => {
          formData.append(
            `categories[${counter}][id]`,
            subBrand?.value?.toString()
          );
          counter++;
        });
        formData.append(`brand_id`, category?.brand?.value.toString());
      });
    }

    try {
      await apiClient.post("/products", formData);
      toast.success("WOo! Your Product has been Created Successfully.", {
        position: "top-center",
        style: { width: "400px", height: "100px", fontSize: "18px" },
      });
      setThumbnailPreview(null);
      setImages([]);
      setPreviews([]);
      reset();
    } catch (error: any) {
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
    },
    {
      label: "Product Name (Arabic)",
      inputName: "name_ar" as const,
      type: "text",
      num: false,
      error: errors.name_ar,
      errorMsg: errors.name_ar?.message,
      class: `input input-bordered grow ${errors.name_ar && "border-[red]"}`,
    },
    {
      label: "Product Description (English)",
      inputName: "desc_en" as const,
      type: "text",
      num: false,
      error: errors.desc_en,
      errorMsg: errors.desc_en?.message,
      class: `input input-bordered grow ${errors.desc_en && "border-[red]"}`,
    },
    {
      label: "Product Description (Arabic)",
      inputName: "desc_ar" as const,
      type: "text",
      num: false,
      error: errors.desc_ar,
      errorMsg: errors.desc_ar?.message,
      class: `input input-bordered grow ${errors.desc_ar && "border-[red]"}`,
    },
    {
      label: "Price",
      inputName: "price" as const,
      type: "number",
      num: true,
      error: errors.price,
      errorMsg: errors.price?.message,
      class: `input input-bordered grow ${errors.price && "border-[red]"}`,
    },
    {
      label: "Discount",
      inputName: "discount" as const,
      type: "number",
      num: true,
      error: errors.discount,
      errorMsg: errors.discount?.message,
      class: `input input-bordered grow ${errors.discount && "border-[red]"}`,
    },
    {
      label: "Model ID",
      inputName: "model" as const,
      type: "text",
      num: false,
      error: errors.model,
      errorMsg: errors.model?.message,
      class: `input input-bordered grow ${errors.model && "border-[red]"}`,
    },
    {
      label: "Seller Sku",
      inputName: "sellerSKU" as const,
      type: "text",
      num: false,
      error: errors.sellerSKU,
      errorMsg: errors.sellerSKU?.message,
      class: `input input-bordered grow ${errors.sellerSKU && "border-[red]"}`,
    },
    {
      label: "Stock",
      inputName: "stock" as const,
      type: "number",
      num: true,
      error: errors.stock,
      errorMsg: errors.stock?.message,
      class: `input input-bordered grow ${errors.stock && "border-[red]"}`,
    },
  ];

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
          className="flex flex-col items-center lg:gap-x-8 
            sm:flex-row sm:flex-wrap sm:gap-4 "
        >
          {formInputs.map((input) => (
            <div key={input.inputName} className="form-control lg:w-1/3">
              <label className="label">
                <span className="label-text">{input.label}</span>
              </label>
              <div className="flex items-center gap-2  ">
                <input
                  placeholder={`${input.label}...`}
                  type={input.type}
                  className={`${input.class} placeholder:text-sm `}
                  {...register(
                    input.inputName,
                    input.num ? { valueAsNumber: true } : {}
                  )}
                />
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
        {/* Categories */}
        <AddProductCategories
          control={control}
          errors={errors}
          register={register}
          setValue={setValue}
        />
        {/* Variants */}
        <AddProductVariant
          control={control}
          errors={errors}
          register={register}
        />

        {/* Specifications */}
        <AddProductSpecification
          control={control}
          errors={errors}
          register={register}
        />

        <div className="flex justify-center items-center mt-8  ">
          <button type="submit" className="btn btn-outline px-20 text-lg">
            {isSubmitting ? "Submitting..." : " Submit"}
          </button>
        </div>
      </form>
    </Container>
  );
};

export default NewProduct;
