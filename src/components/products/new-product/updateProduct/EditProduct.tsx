import Container from "../../../reuse-components/Container";
import { HeadingOne } from "../../../reuse-components/HeadingOne";
import useTargetProduct from "../../../../hooks/useTargetProduct";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NewProductFormSchema, {
  NewProductFormData,
} from "../../../validation-schems/products/new-product-schema";
import AddProductCategories, {
  ProductOptionType,
} from "../sub-components/AddProductCategories";
import ChangeProductThumbnailImage from "./sub/ChangeProductThumbnailImage";
import { ImageDownIcon } from "lucide-react";
import ProductMultipleImages from "../sub-components/ProductMultipleImages";
import { MdDeleteForever } from "react-icons/md";
import apiClient from "../../../../services/api-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiErrorWarningLine } from "react-icons/ri";
import AddProductVariant from "../sub-components/AddProductVariant";
import AddProductSpecification from "../sub-components/AddProductSpecification";
interface Image {
  id: number;
  image: string;
}

const EditProduct = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [olderImages, setOlderImages] = useState<Image[]>([]);

  const { id } = useParams();

  const { targetProduct } = useTargetProduct({ productID: id ?? "" });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

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
      variants: targetProduct?.colors?.flatMap((color) => {
        return color?.sizes?.map((size) => {
          return {
            price: size.price,
            discount: size.discount,
            stock: size.quantity,
            size_id: size.sku_id.toString(),
            color_id: color.color, // Assuming color_id can be stored as color name or any identifier
            sku: size.sku_id.toString(),
          };
        });
      }),
      specifications: targetProduct?.specifications?.map((specific) => {
        return { name_en: specific.name, value_en: specific.value };
      }),
      desc_ar: targetProduct.desc_ar,
      desc_en: targetProduct.desc_en,
      discount: targetProduct.discount,
      model: targetProduct.model_id,
      name_ar: targetProduct.name_ar,
      name_en: targetProduct.name_en,
      price: targetProduct.price,
    },
  });

  useEffect(() => {
    if (targetProduct) {
      // Reset the form with the fetched targetProduct data when available
      reset({
        variants: targetProduct?.colors?.flatMap((color) =>
          color.sizes.map((size) => ({
            price: size.price,
            discount: size.discount,
            stock: size.quantity,
            size_id: size.sku_id.toString(),
            color_id: color.color,
            sku: size.sku_id.toString(),
          }))
        ),
        specifications: targetProduct?.specifications?.map((spec) => ({
          name_en: spec.name,
          value_en: spec.value,
        })),
        desc_ar: targetProduct.desc_ar,
        desc_en: targetProduct.desc_en,
        discount: targetProduct.discount,
        model: targetProduct.model_id,
        name_ar: targetProduct.name_ar,
        name_en: targetProduct.name_en,
        price: targetProduct.price,
      });

      setOlderImages(targetProduct.images);
    }
  }, [targetProduct, reset]); // Reset form whenever targetProduct changes?

  useEffect(() => {
    setOlderImages(targetProduct?.images);
  }, [targetProduct]);

  const handleDeleteOlderImage = async (id: number) => {
    setOlderImages(olderImages.filter((item) => item.id !== id));
    const formData = new FormData();
    formData.append("_method", "delete");
    try {
      const res = await apiClient.post(`/product-images/${id}`, formData);
      toast.success("The selected image has been successfully deleted.");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Oops , Something went wrong!");
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
        formData.append(`variants[${idx}][size]`, variant?.size_id?.toString());

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
  return (
    <Container horizontalPadding={"10"} verticalMargin={"10"}>
      <ToastContainer />
      <HeadingOne label="Update Product" marginBottom="2" />
      <p className="divider divider-vertical "></p>

      <div className="mb-4">
        <ChangeProductThumbnailImage
          control={control}
          errors={errors}
          register={register}
          onThumbnailPreview={(preview) => setThumbnailPreview(preview)}
          thumbnailPreview={thumbnailPreview}
        />
        {!thumbnailPreview && (
          <div className="w-64">
            <img
              src={targetProduct?.thumbnail}
              className="w-full"
              alt="thumbnail"
            />
          </div>
        )}
      </div>
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
      {
        <div className="flex gap-4 items-center w-fit mt-3">
          {olderImages?.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.image} alt={img.image} className="max-w-52" />

              {/* Delete icon, initially hidden, will appear on hover */}
              <MdDeleteForever
                color="red"
                className="absolute cursor-pointer text-4xl top-1/2 right-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => handleDeleteOlderImage(img.id)}
              />
            </div>
          ))}
        </div>
      }
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
        <div>
          {}
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

export default EditProduct;
