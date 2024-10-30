import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string; // Label for the select field
  name: string; // Name attribute for the select field
  options: SelectOption[]; // Array of options for the select field
}

const SalonInputSelect: React.FC<SelectProps> = ({ label, name, options, ...props }) => {
  return (
    <div className="form-control w-full max-w-xs mb-4">
      <label htmlFor={name} className="label font-semibold text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="select select-bordered w-full"
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SalonInputSelect;
