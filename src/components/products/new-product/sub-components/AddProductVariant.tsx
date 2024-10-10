import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
const AddProductVariant = ({
  control,
  errors,
  register,
}: {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  register: UseFormRegister<NewProductFormData>;
}) => {
  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="flex flex-col items-start mt-8 ">
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
    </div>
  );
};

export default AddProductVariant;
