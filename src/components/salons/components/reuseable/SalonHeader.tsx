interface HeaderProps {
  title: string; // Main title text
  subtitle?: string; // Optional subtitle text
  children?: React.ReactNode; // Additional elements like icons or buttons
}

const SalonHeader: React.FC<HeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex justify-between items-center p-4  text-black rounded-lg shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-200">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">{children}</div>
    </div>
  );
};

export default SalonHeader;
