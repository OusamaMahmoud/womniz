import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ClothsDynamicForm = ({ onSelectedSizes, sizes }) => {
  const [fields, setFields] = useState([{ size: "", quantity: "", sku: "" }]);

  useEffect(() => {
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) {
      setFields(JSON.parse(savedFields));
      console.log("in");
    } else {
      console.log("out");
    }
  }, []);

  // Function to handle the change in input fields
  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
    onSelectedSizes(values);
    localStorage.setItem("formFields", JSON.stringify(values));
  };

  // Function to add new fields when "Add" button is clicked
  const addField = () => {
    const newFields = [...fields, { size: "", quantity: "", sku: "" }];
    setFields(newFields);
    localStorage.setItem("formFields", JSON.stringify(newFields));
  };

  // Function to handle removing a field
  const handleRemove = (index) => {
    if (index > 0) {
      // Ensure the first form cannot be deleted
      const values = [...fields];
      values.splice(index, 1);
      setFields(values);
      onSelectedSizes(values);
      localStorage.setItem("formFields", JSON.stringify(values));
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };
  return (
    <div className="w-[100%]">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 xl:max-w-[800px] mb-4 border-b pb-4"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <label className="text-xl">SKU</label>
              <input
                name="sku"
                value={field.sku}
                onChange={(event) => handleChange(index, event)}
                className="input input-bordered"
                min={0}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Size</span>
              </label>
              <select
                name="size"
                value={field.size}
                onChange={(event) => handleChange(index, event)}
                className="select select-bordered"
              >
                <option value="" disabled selected>
                  Select Size
                </option>
                {sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
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
                className="input input-bordered w-[100%]"
                min={0}
                onKeyDown={handleKeyDown}
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="btn btn-error btn-sm"
              >
                <AiOutlineClose />
              </button>
            )}
          </div>
        </div>
      ))}
      <button type="button" onClick={addField} className="btn ">
        Add
      </button>
    </div>
  );
};

export default ClothsDynamicForm;
