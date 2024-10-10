import React from "react";
import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

const AddProductSpecification = ({
  control,
  errors,
  register,
}: {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  register: UseFormRegister<NewProductFormData>;
}) => {
  const {
    fields: specifications,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className="flex flex-col items-start mt-8">
      <label className="flex justify-between items-center text-xl font-medium">
        <div
          onClick={() =>
            appendSpecification({
              name_ar: "",
              name_en: "",
              value_ar: "",
              value_en: "",
            })
          }
          className="btn btn-outline hover:bg-green-900"
        >
          Add Specification <PlusCircleIcon />
        </div>
      </label>
      {specifications.map((f, idx) => (
        <>
          <section
            key={f.id}
            className="flex gap-4 justify-center items-center flex-wrap"
          >
            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Name (English)</label>
              <input
                type="text"
                {...register(`specifications.${idx}.name_en` as const)}
                className={`input input-bordered ${
                  errors.specifications?.[idx]?.name_en && "border-red-500"
                }`}
              />
              {errors.specifications?.[idx]?.name_en && (
                <p className="text-red-500">
                  {errors.specifications?.[idx]?.name_en?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Name (Arabic)</label>
              <input
                type="text"
                {...register(`specifications.${idx}.name_ar` as const)}
                className={`input input-bordered ${
                  errors.specifications?.[idx]?.name_ar && "border-red-500"
                }`}
              />
              {errors.specifications?.[idx]?.name_ar && (
                <p className="text-red-500">
                  {errors.specifications?.[idx]?.name_ar?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Value (English)</label>
              <input
                type="text"
                {...register(`specifications.${idx}.value_en` as const)}
                className={`input input-bordered ${
                  errors.specifications?.[idx]?.value_en && "border-red-500"
                }`}
              />
              {errors.specifications?.[idx]?.value_en && (
                <p className="text-red-500">
                  {errors.specifications?.[idx]?.value_en?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-start mt-4">
              <label>Name (Arabic)</label>
              <input
                type="text"
                {...register(`specifications.${idx}.value_ar` as const)}
                className={`input input-bordered ${
                  errors.specifications?.[idx]?.value_ar && "border-red-500"
                }`}
              />
              {errors.specifications?.[idx]?.value_ar && (
                <p className="text-red-500">
                  {errors.specifications?.[idx]?.value_ar?.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center   mt-10 ">
              <MinusCircleIcon
                onClick={() => removeSpecification(idx)}
                className="cursor-pointer hover:bg-red-300 rounded-full duration-200 "
                size={28}
              />
            </div>
          </section>
          <p className="divider divider-vertical"></p>
        </>
      ))}
    </div>
  );
};

export default AddProductSpecification;
