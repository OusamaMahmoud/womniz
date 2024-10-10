import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  Controller,
  UseFormSetValue,
} from "react-hook-form";
import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import useMainCategories from "../../../../hooks/useMainCategories";
import { useEffect, useState } from "react";
import {
  BrandOfMainCategory,
  ChiledCategory,
  SubBrand,
} from "../../../../services/category-service";
import Select, { MultiValue, SingleValue } from "react-select";

export interface ProductOptionType {
  value: number;
  label: string;
}

const AddProductCategories = ({
  control,
  errors,
  register,
  setValue,
}: {
  control: Control<NewProductFormData>;
  errors: FieldErrors<NewProductFormData>;
  register: UseFormRegister<NewProductFormData>;
  setValue: UseFormSetValue<NewProductFormData>;
}) => {
  const [selectedMainCategoryID, setSelectedMainCategoryID] =
    useState<ProductOptionType>({} as ProductOptionType);

  const [chieldsOfMainCategory, setChieldsOfMainCategory] = useState<
    ChiledCategory[]
  >([]);
  const [brandsOfMainCategory, setBrandsOfMainCategory] =
    useState<BrandOfMainCategory[]>();
  const [selectedBrandOfMainCategory, setSelectedBrandOfMainCategory] =
    useState<number>();

  const [chieldsOfMainCategoriesIDs, setChieldsOfMainCategoriesIDs] = useState<
    number[]
  >([]);
  const [subBrandsIDs, setSubBrandsIDs] = useState<number[]>([]);

  const { categories } = useMainCategories();

  const mainCategoryOptions: ProductOptionType[] = categories.map((item) => ({
    value: item.id, // unique value for the option
    label: item.name, // label displayed in the select
  }));

  const handleSelectMainCategory = (
    selectedOption: SingleValue<ProductOptionType>,
    idx: number
  ) => {
    if (selectedOption) {
      setSelectedMainCategoryID(selectedOption);
      setValue(`categories.${idx}.brand`, { label: "", value: 0 }); // Clear brand when main category changes
      setValue(`categories.${idx}.subCategories`, []); // Clear sub-categories when main category changes
      setValue(`categories.${idx}.subBrands`, []); // Clear sub-brands when main category changes
      setBrandsOfMainCategory([]); // Reset brands of main category
      setSubBrands([]); // Reset sub-brands
    }
  };

  useEffect(() => {
    const mainCategory = categories.find(
      (mainCategory) => mainCategory?.id === selectedMainCategoryID?.value
    );

    if (mainCategory && mainCategory?.childs) {
      setChieldsOfMainCategory(mainCategory.childs);
    }
    if (mainCategory && mainCategory?.brands) {
      setBrandsOfMainCategory(mainCategory.brands);
    }
  }, [selectedMainCategoryID]);

  const chieldsOfMainCategoryOptions: ProductOptionType[] =
    chieldsOfMainCategory.map((item) => ({
      value: item.id, // unique value for the option
      label: item.name, // label displayed in the select
    }));

  let brandsOfMainCategoryOptions: ProductOptionType[] = [];
  if (brandsOfMainCategory && brandsOfMainCategory?.length > 0) {
    brandsOfMainCategoryOptions = brandsOfMainCategory?.map((item) => ({
      label: item.name_en,
      value: Number(item.id),
    }));
  }

  const [subBrands, setSubBrands] = useState<SubBrand[]>([]);

  useEffect(() => {
    if (selectedBrandOfMainCategory) {
      const subBrandsCalc = brandsOfMainCategory?.find(
        (br) => br.id == selectedBrandOfMainCategory.toString()
      )?.categories;

      if (subBrandsCalc) {
        setSubBrands(subBrandsCalc);
      }
    }
  }, [selectedBrandOfMainCategory]);

  const subBrandsOptions: ProductOptionType[] = subBrands?.map((item) => ({
    label: item.name,
    value: Number(item.id),
  }));

  const handleSelectChieldsOfMainCategory = (
    selectedOptions: MultiValue<ProductOptionType>
  ) => {
    const ChieldsIDs = selectedOptions.map((item) => {
      return item.value;
    });
    setChieldsOfMainCategoriesIDs(ChieldsIDs);
  };

  const handleSelectBrandOfMainCategory = (
    selectedOption: SingleValue<ProductOptionType>,
    idx: number
  ) => {
    setSelectedBrandOfMainCategory(selectedOption?.value);
    setValue(`categories.${idx}.subBrands`, []); // Clear sub-brands when brand changes
  };

  const handleSelectSubBrand = (
    selectedOptions: MultiValue<ProductOptionType>
  ) => {
    const SubBrandsIDs = selectedOptions.map((item) => {
      return item.value;
    });
    if (SubBrandsIDs) {
      setSubBrandsIDs(SubBrandsIDs);
    }
  };

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
              brand: {} as ProductOptionType,
              subBrands: [] as ProductOptionType[],
              subCategories: [] as ProductOptionType[],
            })
          }
        >
          Add Product Categories <PlusCircleIcon />
        </button>
      </label>
      {fields.map((f, idx) => (
        <div key={f.id} className="flex items-center flex-wrap gap-4 mt-4">
          <div className="my-4">
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
          <div className="my-4">
            <Controller
              name={`categories.${idx}.subCategories`}
              control={control}
              render={({ field }) => (
                <Select
                  isDisabled={!selectedMainCategoryID.value}
                  {...field}
                  isMulti
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
          <div className="my-4">
            <Controller
              name={`categories.${idx}.brand`}
              control={control}
              render={({ field }) => (
                <Select
                  isDisabled={!selectedMainCategoryID.value}
                  {...field}
                  options={brandsOfMainCategoryOptions}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption); // Pass selected option to RHF
                    handleSelectBrandOfMainCategory(selectedOption, idx); // Call your custom handler
                  }}
                  isClearable
                  placeholder="Select a Brand..."
                />
              )}
            />
            {errors?.categories?.[idx]?.brand && (
              <p className="text-red-500">
                {errors?.categories?.[idx]?.brand?.message}
              </p>
            )}
          </div>
          <div className="my-4">
            <Controller
              name={`categories.${idx}.subBrands`}
              control={control}
              render={({ field }) => (
                <Select
                  isDisabled={!selectedBrandOfMainCategory}
                  {...field}
                  isMulti
                  isClearable
                  placeholder="Select a Sub Brand..."
                  options={subBrandsOptions}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions); // Pass selected option to RHF
                    handleSelectSubBrand(selectedOptions); // Call your custom handler
                  }}
                />
              )}
            />
            {errors?.categories?.[idx]?.subBrands && (
              <p className="text-red-500">
                {errors?.categories?.[idx]?.subBrands?.message}
              </p>
            )}
          </div>
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
