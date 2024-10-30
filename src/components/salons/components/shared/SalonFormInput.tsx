import React from "react";
import { useFormContext, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: Path<T>;
  maxWidth?: string;
  type: string;
  icon?: React.ReactNode;
}

const SalonFormInput = <T extends FieldValues>({
  label,
  type,
  icon,
  register,
  maxWidth,
  ...props
}: InputProps<T>) => {
  const {
    register: formRegister,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div className={`form-control w-full lg:${maxWidth} mb-4`}>
      <label className="label font-semibold text-gray-700 capitalize">{label}</label>
      <div className="flex gap-2 items-center input input-bordered">
        {icon}
        <input
          type={type}
          className="w-full"
          {...formRegister(register)} // Register correctly using formRegister
          {...props}
        />
      </div>
      {errors[register] && (
        <p className="text-red-600 text-sm mt-1">
          {errors[register]?.message as string}
        </p>
      )}
    </div>
  );
};

export default SalonFormInput;
