import { useFieldArray, useForm } from "react-hook-form";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "../../../../services/api-client";
import { useLoading } from "../../../../contexts/LoadingContext";
import { showToast } from "../../../reuse-components/ShowToast";
import { useNavigate } from "react-router-dom";

const variantSchema = z.object({
  variants: z.union([
    z.array(
      z.object({
        size_id: z.string().min(1, "Size must be at least 3 characters."),
        color_id: z.string().min(1, "Color must be at least 3 characters."),
        sku: z.string().min(1, "SKU must be at least 1 characters"),
        stock: z.number({ invalid_type_error: "Stock must be a number" }),
        price: z.number({ invalid_type_error: "Price must be a number" }),
        discount: z.number({ invalid_type_error: "Discount must be a number" }),
      })
    ),
    z.null(),
  ]),
});

type variantSchemaFormValues = z.infer<typeof variantSchema>;

const AddProductVariant = ({
  productId,
  productKey,
}: {
  productId: string;
  productKey: string;
}) => {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      variants: [
        { size_id: "", color_id: "", sku: "", stock: 0, price: 0, discount: 0 },
      ],
    },
  });

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });
  const { setLoading } = useLoading();

  const navigate = useNavigate();

  const onSubmit = async (data: variantSchemaFormValues) => {
    const variantsFormData = new FormData();

    if (data.variants && data.variants.length > 0) {
      data?.variants.map((variant, idx) => {
        variantsFormData.append(
          `skus[${idx}][size]`,
          variant?.size_id?.toString()
        );

        variantsFormData.append(
          `skus[${idx}][color]`,
          variant?.color_id?.toString()
        );

        variantsFormData.append(
          `skus[${idx}][stock]`,
          variant?.stock?.toString()
        );
        variantsFormData.append(`skus[${idx}][sku]`, variant?.sku);
        variantsFormData.append(
          `skus[${idx}][price]`,
          variant?.price?.toString()
        );
        variantsFormData.append(
          `skus[${idx}][discount]`,
          variant?.discount?.toString()
        );
      });
      if (productId) variantsFormData.append("product_id", productId);
    }

    try {
      setLoading(true);
      const res = await apiClient.post(
        "/product-variant-skus",
        variantsFormData
      );
      console.log(res);
      setLoading(false);
      showToast("The Product Variants has been successfully added.", "success");
      if (productKey === "edit") {
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      }
    } catch (error: any) {
      console.log("variant", error);
      setLoading(false);
      showToast(error.response.data.data.error, "error");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start mt-8 "
    >
      <label className="flex justify-between items-center text-xl font-medium">
        <div
          onClick={() =>
            appendVariant({
              color_id: "",
              discount: 0,
              price: 0,
              size_id: "",
              sku: "",
              stock: 0,
            })
          }
          className="btn btn-outline hover:bg-green-900"
        >
          Add Variants <PlusCircleIcon />
        </div>
      </label>
      {variants.map((f, idx) => (
        <>
          <div key={f.color_id} className="flex gap-4 items-center flex-wrap">
            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Size</label>
              <input
                className={`input input-bordered ${
                  errors.variants?.[idx]?.size_id && "border-red-500"
                }`}
                {...register(`variants.${idx}.size_id` as const)}
              />

              {errors.variants?.[idx]?.size_id && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.size_id?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Color</label>
              <input
                className={`input input-bordered ${
                  errors.variants?.[idx]?.color_id && "border-red-500"
                }`}
                {...register(`variants.${idx}.color_id` as const)}
              />
              {errors.variants?.[idx]?.color_id && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.color_id?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Sku</label>
              <input
                type="text"
                {...register(`variants.${idx}.sku` as const)}
                className={`input input-bordered ${
                  errors.variants?.[idx]?.sku && "border-red-500"
                }`}
              />
              {errors.variants?.[idx]?.sku && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.sku?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Price</label>
              <input
                type="number"
                {...register(`variants.${idx}.price` as const, {
                  valueAsNumber: true,
                })}
                className={`input input-bordered ${
                  errors.variants?.[idx]?.price && "border-red-500"
                }`}
              />
              {errors.variants?.[idx]?.price && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.price?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Discount</label>
              <input
                type="number"
                {...register(`variants.${idx}.discount` as const, {
                  valueAsNumber: true,
                })}
                className={`input input-bordered ${
                  errors.variants?.[idx]?.discount && "border-red-500"
                }`}
              />
              {errors.variants?.[idx]?.discount && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.discount?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Stock</label>
              <input
                type="number"
                {...register(`variants.${idx}.stock` as const, {
                  valueAsNumber: true,
                })}
                className={`input input-bordered ${
                  errors.variants?.[idx]?.stock && "border-red-500"
                }`}
              />
              {errors.variants?.[idx]?.stock && (
                <p className="text-red-500">
                  {errors.variants?.[idx]?.stock?.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center  gap-4  mt-10 ">
              <MinusCircleIcon
                onClick={() => removeVariant(idx)}
                className="cursor-pointer hover:bg-red-300 rounded-full duration-200 "
                size={28}
              />
            </div>
          </div>
          <p className="divider divider-vertical"></p>
        </>
      ))}
      <button className="btn bg-womnizColor text-lg text-white px-20 py-2 mt-8">
        Submit
      </button>
    </form>
  );
};

export default AddProductVariant;
