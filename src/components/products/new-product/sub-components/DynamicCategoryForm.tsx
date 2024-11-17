import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { MdDone, MdDoneAll, MdDoneOutline } from "react-icons/md";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { showToast } from "../../../reuse-components/ShowToast";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";

type Category = {
  id: number;
  nameEn: string;
  isLastLevel: boolean;
};

type FormValues = {
  categories: { id: number | null }[];
};

const CategoryForm = ({
  index,
  removeForm,
  onLastIdChange,
}: {
  index: number;
  removeForm: (index: number) => void;
  onLastIdChange: (index: number, lastId: number | null) => void;
}) => {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      categories: [{ id: null }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<{
    [key: number]: Category[];
  }>({});

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await apiClient.get("/categories/main");
        setMainCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const categories = watch("categories");
  const { setLoading } = useLoading();
  const handleCategoryChange = async (categoryId: number, index: number) => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`categories/sub/${categoryId}`);
      const children = response.data.data;

      setSubCategories((prev) => ({ ...prev, [categoryId]: children }));

      if (children.length > 0) {
        append({ id: null });
      }
      setLoading(false);
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ID ${categoryId}:`,
        error
      );
      setLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const lastSelectedId = data.categories.reduce<number | null>(
      (acc, curr) => {
        return curr.id ?? acc;
      },
      null
    );

    onLastIdChange(index, lastSelectedId);

    // reset({
    //   categories: [{ id: null }],
    // });
    // setSubCategories({});
    showToast(
      "Product has been successfully added to this category .",
      "success"
    );
  };

  return (
    <form className="p-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, idx) => (
        <div key={field.id} className="flex flex-col space-y-2 ">
          <label className="font-medium">
            {idx === 0 ? "Main Category" : `Subcategory`}
          </label>
          <div className="flex gap-2 items-center">
            <Controller
              control={control}
              name={`categories.${idx}.id` as const}
              render={({ field: { onChange, value } }) => (
                <select
                  className="select select-bordered grow"
                  value={value ?? ""}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    onChange(selectedId);
                    handleCategoryChange(selectedId, idx);
                  }}
                >
                  <option value="">Select category</option>
                  {(idx === 0
                    ? mainCategories
                    : subCategories[categories[idx - 1]?.id ?? 0] || []
                  ).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameEn}
                    </option>
                  ))}
                </select>
              )}
            />
            {idx > 0 && (
              <button
                onClick={() => remove(idx)}
                className="mx-2 cursor-pointer"
              >
                <img
                  src="assets/products/close-circle.svg"
                  alt="close-circle"
                />
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center gap-5 ">
        <button
          type="button"
          onClick={() => removeForm(index)}
          className="p-2  flex gap-2 items-center rounded-xl px-[51px] text-[12px] py-[16px] shadow-md"
        >
          Delete
        </button>
        <button
          type="submit"
          data-tip="You should save this form data first."
          className=" tooltip tooltip-top flex gap-2 items-center bg-[#B6C9B5] rounded-xl px-[51px] text-[12px] py-[16px] shadow-md"
        >
          Save
        </button>
      </div>
    </form>
  );
};

const DynamicCategoryForm = () => {
  const [formCount, setFormCount] = useState(1);
  const [lastSelectedIds, setLastSelectedIds] = useState<Array<number | null>>(
    Array(formCount).fill(null)
  );
  const { state } = useLocation();

  useEffect(() => {
    if (state || state?.productId) setProductId(state?.productId);
  }, [state]);

  const addForm = () => {
    setFormCount((prev) => prev + 1);
    setLastSelectedIds((prev) => [...prev, null]);
  };

  const removeForm = (index: number) => {
    setFormCount((prev) => prev - 1);
    setLastSelectedIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLastIdChange = (formIndex: number, lastId: number | null) => {
    setLastSelectedIds((prev) => {
      const updatedIds = [...prev];
      updatedIds[formIndex] = lastId;
      return updatedIds;
    });
  };
  const [isSaveCategoriesBtnLoading, setIsSaveCategoriesBtnLoading] =
    useState(false);
  const [productId, setProductId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("lastIDs", lastSelectedIds);
  }, [lastSelectedIds]);
  const isArrayNull = (arr: any) =>
    Array.isArray(arr) && arr.length === 1 && arr[0] === null;
  const handleAllFormsSubmit = () => {
    // Send the collected lastSelectedIds to the API
    if (isArrayNull(lastSelectedIds)) {
      showToast("Please Submit Each Form Firstly!", "error");
      return;
    }

    const formData = new FormData();
    if (lastSelectedIds && lastSelectedIds.length > 0) {
      lastSelectedIds.forEach((lastId, idx) => {
        if (lastId !== null) {
          formData.append(`categories[${idx}]`, lastId.toString());
        }
      });
    }

    setIsSaveCategoriesBtnLoading(true);
    apiClient
      .post(`product-categories/update/${productId}`, formData)
      .then((response) => {
        setIsSaveCategoriesBtnLoading(false);
        showToast(
          "The Product has been successfully added to These Categories.",
          "success",
          { delay: 3000, navigateTo: "/add-specification-variants" },
          navigate
        );
      })
      .catch((error) => {
        showToast("This Category is not last child!", "error");
      });
  };

  return (
    <div className=" ml-10">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>
      {[...Array(formCount)].map((_, index) => (
        <div className="border p-4 rounded-lg flex flex-col gap-3 mt-6 max-w-xl">
          <CategoryForm
            key={index}
            index={index}
            removeForm={removeForm}
            onLastIdChange={handleLastIdChange}
          />
        </div>
      ))}
      <div className="flex  items-center mt-4">
        <button
          type="button"
          onClick={addForm}
          className="py-2 px-8  bg-[#B6C9B5]  rounded-md mt-4 mb-8 flex gap-2 items-center"
        >
          <img src="/assets/products/plus.png" alt="plus-Icon" /> Add Product
          Categories
        </button>
      </div>
      <div className="flex justify-center items-center w-full">
        <button
          type="button"
          onClick={handleAllFormsSubmit}
          data-tip="attach product categories"
          className="py-3  tooltip tooltip-top px-14  bg-womnizColor text-white rounded-md mt-10"
        >
          Save and Go Next
        </button>
      </div>
    </div>
  );
};

export default DynamicCategoryForm;
