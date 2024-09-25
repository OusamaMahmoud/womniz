import { RiErrorWarningLine } from "react-icons/ri";


interface FormInputProps {
    id: string;
    label: string;
    type: string;
    register: any;  // replace with the correct type from react-hook-form
    error: any;     // replace with the correct type from react-hook-form
  }
  
 export const FormInput: React.FC<FormInputProps> = ({ id, label, type, register, error }) => {
    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type={type}
            id={id}
            className={`input input-bordered grow ${error && "border-[red]"}`}
            {...register(id, type === "number" ? { valueAsNumber: true } : {})}
          />
          {error && (
            <RiErrorWarningLine
              color="red"
              className="w-6 h-6 ml-1"
            />
          )}
        </div>
        {error && (
          <p className="text-[red] text-xs mt-3">
            {error.message}
          </p>
        )}
      </div>
    );
  };
  