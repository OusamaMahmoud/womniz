interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // Label for the input field
  maxWidth?: string; // Name attribute for the input field, used for form handling
  type: string; // Name attribute for the input field, used for form handling
  icon: React.ReactNode;
}

const SalonInput: React.FC<InputProps> = ({
  label,
  type,
  icon,
  maxWidth,
  ...props
}) => {
  return (
    <div className={`form-control w-full lg:${maxWidth} mb-4`}>
      <label className="label font-semibold text-gray-700">{label}</label>
      <div className="flex gap-2 items-center input input-bordered">
        {icon}
        <input type={type} className="w-full" {...props} />
      </div>
    </div>
  );
};

export default SalonInput;
