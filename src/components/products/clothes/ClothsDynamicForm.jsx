import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ClothsDynamicForm = ({ onSelectedSizes }) => {
  const [fields, setFields] = useState([{ size: "", quantity: "" }]);

  // Function to handle the change in input fields
  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
    onSelectedSizes(values);
  };

  // Function to add new fields when a quantity input loses focus (onBlur event)
  const handleBlur = (index, event) => {
    if (event.target.name === "quantity" && event.target.value) {
      const values = [...fields];
      if (index === fields.length - 1) {
        setFields([...fields, { size: "", quantity: "" }]);
      }
    }
  };

  // Function to handle removing a field
  const handleRemove = (index) => {
    if (index > 0) {  // Ensure the first form cannot be deleted
      const values = [...fields];
      values.splice(index, 1);
      setFields(values);
      onSelectedSizes(values);
    }
  };

  return (
    <div className="w-[100%]">
      {fields.map((field, index) => (
        <div key={index} className="flex justify-between items-center gap-4 xl:max-w-[800px]">
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Size</span>
            </label>
            <input
              name="size"
              value={field.size}
              onChange={(event) => handleChange(index, event)}
              className="input input-bordered w-[100%]"
            />
          </div>

          <div className="flex-1">
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              name="quantity"
              type="number"
              value={field.quantity}
              onChange={(event) => handleChange(index, event)}
              onBlur={(event) => handleBlur(index, event)}
              className="input input-bordered w-[100%]"
            />
          </div>

          {index > 0 && (
            <button
              onClick={() => handleRemove(index)}
              className="btn btn-error btn-sm"
            >
              <AiOutlineClose />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClothsDynamicForm;
