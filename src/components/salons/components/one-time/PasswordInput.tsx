import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FormValues } from "../../pages/AddNewSalonForm";

const PasswordInput: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  return (
    <div className="relative w-full">
      <label className="label font-semibold text-gray-700">Password</label>
      <input
        {...register("password")}
        type={isPasswordVisible ? "text" : "password"}
        placeholder="Enter your password"
        className="input input-bordered w-full pr-10" // Add padding-right to avoid text overlap with icon
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute top-[50%] right-3 flex items-center text-gray-600 focus:outline-none"
      >
        {isPasswordVisible ? (
          <AiFillEyeInvisible size={20} />
        ) : (
          <AiFillEye size={20} />
        )}
      </button>
      {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
    </div>
  );
};

export default PasswordInput;
