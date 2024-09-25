import React, { useEffect, useState } from "react";
import useVendorCategories from "../../hooks/useVendorCategories";

const DynamicForm = ({ onSelectedCategories, initailCategories = [] }) => {
  const { vendorCategories } = useVendorCategories();
  const [fields, setFields] = useState([{ category: "", id: "" }]);

  useEffect(() => {
    if (initailCategories && initailCategories?.length > 1) {
      setFields(initailCategories.map((c) => ({ category: c.name, id: c.id })));
    }
  }, [initailCategories]);

  // Function to handle the change in select inputs
  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    values[index].id = vendorCategories.find((item) =>
      item.name.includes(event.target.value)
    ).id;
    setFields(values);
    onSelectedCategories(values);
  };

  // Function to add new fields when a category input loses focus (onBlur event)
  const handleBlur = (index, event) => {
    if (event.target.name === "category" && event.target.value) {
      const values = [...fields];
      if (index === fields.length - 1) {
        setFields([...fields, { category: "", id: "" }]);
      }
    }
  };

  // Function to get available categories for the dropdown
  const getAvailableCategories = (index) => {
    const selectedCategories = fields
      .slice(0, index)
      .map((field) => field.category);
    return vendorCategories.filter(
      (category) => !selectedCategories.includes(category.name)
    );
  };

  return (
    <div className="w-[100%]">
      {fields.map((field, index) => (
        <div key={index} className="">
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              value={field.category}
              onChange={(event) => handleChange(index, event)}
              onBlur={(event) => handleBlur(index, event)}
              className="select select-bordered w-[100%] "
            >
              <option value="" disabled>
                Select a category
              </option>
              {getAvailableCategories(index).map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
