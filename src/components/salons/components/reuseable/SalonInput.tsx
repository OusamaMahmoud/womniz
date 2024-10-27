interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // Label for the input field
  name: string; // Name attribute for the input field, used for form handling
}

const SalonInput: React.FC<InputProps> = ({ label, name, ...props }) => {
  return (
    <div className="form-control w-full max-w-xs mb-4">
      <label htmlFor={name} className="label font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input input-bordered w-full"
        {...props}
      />
    </div>
  );
};

export default SalonInput;
