import { useEffect } from "react";
import { TargetCategory } from "../../../hooks/useMainCategories";

export const SelectCategoryInput = ({
  categories,
  selectedCategory,
  onSelectCategory,
  placeHolder,
}: {
  categories: TargetCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  placeHolder: string;
}) => {
  useEffect(() => {
    onSelectCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <select
      className="select select-bordered"
      onChange={(e) => onSelectCategory(e.target.value)}
      value={selectedCategory}
    >
      <option value="">{placeHolder}</option>
      {categories.map((cate) => (
        <option key={cate.id} value={cate.nameEn}>
          {cate.nameEn}
        </option>
      ))}
    </select>
  );
};
