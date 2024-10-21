import { useEffect } from "react";
import { Category } from "../../../services/category-service";

export const SelectCategoryInput = ({
  categories,
  selectedCategory,
  onSelectCategory,
  placeholder,
}: {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  placeholder: string;
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
      <option value="">{placeholder}</option>
      {categories.map((cate) => (
        <option key={cate.id} value={cate.name}>
          {cate.name}
        </option>
      ))}
    </select>
  );
};
