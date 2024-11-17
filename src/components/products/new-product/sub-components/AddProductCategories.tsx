import {
  Control,
  FieldErrors,
  useFieldArray,
  Controller,
  UseFormSetValue,
} from "react-hook-form";
import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Category,
  ChiledCategory,
} from "../../../../services/category-service";
import Select, { MultiValue, SingleValue } from "react-select";
import apiClient, { CanceledError } from "../../../../services/api-client";

export interface ProductOptionType {
  value: number;
  label: string;
}
interface SubCategory {
  id: number;
  nameEn: string;
  isLastLevel: boolean;
}



const AddProductCategories = ({
  control,
  errors,
  setValue,
}: {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  setValue: UseFormSetValue<NewProductFormData>;
}) => {
  const [selectedMainCategoryID, setSelectedMainCategoryID] =
    useState<ProductOptionType>({} as ProductOptionType);

  const [chieldsOfMainCategory, setChieldsOfMainCategory] = useState<
    ChiledCategory[]
  >([]);

  // test
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [, setError] = useState("");
  const [, setIsMainCategoriesLoading] = useState(false);

  useEffect(() => {
    setIsMainCategoriesLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/categories", {
        signal: controller.signal,
      })
      .then((res) => {
        setMainCategories(res.data.data);
        setIsMainCategoriesLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsMainCategoriesLoading(false);
      });
    return () => controller.abort();
  }, []);

  const mainCategoryOptions: ProductOptionType[] = mainCategories.map(
    (item) => ({
      value: item.id, // unique value for the option
      label: item.name, // label displayed in the select
    })
  );

  const handleSelectMainCategory = (
    selectedOption: SingleValue<ProductOptionType>,
    idx: number
  ) => {
    if (selectedOption) {
      setSelectedMainCategoryID(selectedOption);
      setValue(`categories.${idx}.subCategories`, []); // Clear sub-categories when main category changes
    }
  };

  useEffect(() => {
    const mainCategory = mainCategories.find(
      (mainCategory) => mainCategory?.id === selectedMainCategoryID?.value
    );

    if (mainCategory && mainCategory?.childs) {
      setChieldsOfMainCategory(mainCategory.childs);
    }
  }, [selectedMainCategoryID]);

  const chieldsOfMainCategoryOptions: ProductOptionType[] =
    chieldsOfMainCategory.map((item) => ({
      value: item.id, // unique value for the option
      label: item.name, // label displayed in the select
    }));

  // --------------------------------------------- //

  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

  const getSUbCategoriesById = async (subCategoryId: number) => {
    try {
      const res = await apiClient.get(`categories/sub/${subCategoryId}`);
      console.log(res.data.data);
      setSubCategories(res.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (subCategoryId) getSUbCategoriesById(subCategoryId);
  }, [subCategoryId]);

  const handleSelectChieldsOfMainCategory = (
    selectedOptions: SingleValue<ProductOptionType>
  ) => {
    if (selectedOptions) setSubCategoryId(selectedOptions?.value);
  };

  // --------------------------------------------- //

  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control,
    rules: { required: "At least one category is required" },
  });

  return (
    <div className="flex flex-col items-start mt-8">
      <label className="flex justify-between items-center text-xl font-medium">
        <button
          type="button"
          className="btn btn-outline hover:bg-green-900"
          onClick={() =>
            append({
              mainCategory: {} as ProductOptionType,
              subCategories: [] as ProductOptionType[],
            })
          }
        >
          Add Product Categories <PlusCircleIcon />
        </button>
      </label>
      {fields.map((f, idx) => (
        <div
          key={f.id}
          className="flex flex-col items-center flex-wrap gap-2 mt-4"
        >
          <div className="my-2">
            <Controller
              name={`categories.${idx}.mainCategory`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={mainCategoryOptions}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Pass selected option to RHF
                    handleSelectMainCategory(selectedOption, idx); // Call your custom handler
                  }}
                  isClearable
                  placeholder="Select a Main Category..."
                />
              )}
            />
            {errors?.categories?.[idx]?.mainCategory && (
              <p className="text-red-500">
                {errors?.categories?.[idx]?.mainCategory?.message}
              </p>
            )}
          </div>
          <div className="my-2">
            <Controller
              name={`categories.${idx}.subCategories`}
              control={control}
              render={({ field }) => (
                <Select
                  isDisabled={!selectedMainCategoryID.value}
                  {...field}
                  options={chieldsOfMainCategoryOptions}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Pass selected option to RHF
                    handleSelectChieldsOfMainCategory(selectedOption); // Call your custom handler
                  }}
                  isClearable
                  placeholder="Select a Sub Category..."
                />
              )}
            />
            {errors?.categories?.[idx]?.subCategories && (
              <p className="text-red-500">
                {errors?.categories?.[idx]?.subCategories?.message}
              </p>
            )}
          </div>
          {subCategories?.length > 0 && (
            <div className="my-2">
              <Controller
                name={`categories.${idx}.subCategories`}
                control={control}
                render={({ field }) => (
                  <Select
                    isDisabled={!selectedMainCategoryID.value}
                    {...field}
                    options={subCategories.map((sub) => ({
                      label: sub.nameEn,
                      value: sub.id,
                    }))}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption); // Pass selected option to RHF
                      handleSelectChieldsOfMainCategory(selectedOption); // Call your custom handler
                    }}
                    isClearable
                    placeholder="Select a Sub Category..."
                  />
                )}
              />
              {errors?.categories?.[idx]?.subCategories && (
                <p className="text-red-500">
                  {errors?.categories?.[idx]?.subCategories?.message}
                </p>
              )}
            </div>
          )}
          {idx >= 1 && (
            <button
              type="button"
              className="btn btn-outline hover:bg-red-700"
              onClick={() => remove(idx)}
            >
              Remove <Trash2Icon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddProductCategories;
