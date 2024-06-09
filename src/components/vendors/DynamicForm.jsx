import React, { useState } from "react";

const DynamicForm = () => {
  // State to manage categories and commissions
  const [fields, setFields] = useState([{ category: "", commission: "" }]);

  // Function to handle the change in inputs
  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
  };

  // Function to add new fields when a category input loses focus (onBlur event)
  const handleBlur = (index, event) => {
    if (event.target.name === "category" && event.target.value) {
      const values = [...fields];
      if (index === fields.length - 1) {
        setFields([...fields, { category: "", commission: "" }]);
      }
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {fields.map((field, index) => (
        <div key={index} className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={field.category}
              onChange={(event) => handleChange(index, event)}
              onBlur={(event) => handleBlur(index, event)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Commission
            </label>
            <input
              type="text"
              name="commission"
              value={field.commission}
              onChange={(event) => handleChange(index, event)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
