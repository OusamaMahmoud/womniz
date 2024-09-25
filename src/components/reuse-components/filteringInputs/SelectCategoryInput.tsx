import { useEffect } from "react";
import { Category } from "../../../services/category-service";

export const SelectCategoryInput = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
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
      <option value="">ALL</option>
      {categories.map((cate) => (
        <option key={cate.id} value={cate.title}>
          {cate.title}
        </option>
      ))}
    </select>
  );
};
