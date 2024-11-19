import { useFieldArray, useForm } from "react-hook-form";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "../../../../services/api-client";
import { useLoading } from "../../../../contexts/LoadingContext";
import { showToast } from "../../../reuse-components/ShowToast";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const specificationSchema = z.object({
  specifications: z.union([
    z.array(
      z.object({
        name_en: z.string().min(3),
        name_ar: z.string().min(3),
        value_en: z.string().min(3),
        value_ar: z.string().min(3),
      })
    ),
    z.null(),
  ]),
});
type specificationSchemaFormValues = z.infer<typeof specificationSchema>;

const AddProductSpecification = ({
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
    resolver: zodResolver(specificationSchema),
    defaultValues: {
      specifications: [
        { name_en: "", name_ar: "", value_en: "", value_ar: "" },
      ],
    },
  });

  const {
    fields: specifications,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });
  const { setLoading } = useLoading();

  const navigate = useNavigate();

  const onSubmit = async (data: specificationSchemaFormValues) => {
    const specificationFormData = new FormData();

    if (data?.specifications && data?.specifications?.length > 0) {
      data?.specifications?.map((specific, idx) => {
        specificationFormData.append(
          `specifications[${idx}][name_en]`,
          specific?.name_en
        );
        specificationFormData.append(
          `specifications[${idx}][name_ar]`,
          specific?.name_ar
        );
        specificationFormData.append(
          `specifications[${idx}][value_en]`,
          specific?.value_en
        );
        specificationFormData.append(
          `specifications[${idx}][value_ar]`,
          specific?.value_ar
        );
      });
      if (productId) specificationFormData.append("product_id", productId);
    }

    try {
      setLoading(true);
      const res = await apiClient.post(
        "/product-specifications",
        specificationFormData
      );
      console.log(res);
      setLoading(false);
      showToast(
        "The Product Specifications has been successfully added.",
        "success"
      );
      if (productKey === "edit") {
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      }
    } catch (error: any) {
      console.log("specification", error);
      setLoading(false);
      showToast(error.response.data.data.error, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start mt-8"
    >
      <ToastContainer />
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
      <button className="btn bg-womnizColor text-lg text-white px-20 py-2 mt-8">
        Submit
      </button>
    </form>
  );
};

export default AddProductSpecification;
