import React, { ChangeEvent, ForwardedRef, ReactElement } from "react";

// Define the interface for props
interface FileInputProps {
  label: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  error?: boolean;
  labelClass: string;
  icon: ReactElement;
}

// Create the FileInput component with the defined props
const FileInput = React.forwardRef(
  (
    {
      labelClass,
      multiple = false,
      onChange,
      name,
      icon,
      error,
    }: FileInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <>
      <label className={`${labelClass}`}>
        <span className="text-2xl">{icon}</span>
        <input
          type="file"
          name={name}
          multiple={multiple}
          ref={ref}
          onChange={onChange}
          className="file-input file-input-bordered"
          hidden
        />
       {error && <p className="absolute text-red-700 text-lg top-20 -left-40 w-96">Your Profile Image is Required!!</p>}
      </label>
    </>
  )
);

export default FileInput;
