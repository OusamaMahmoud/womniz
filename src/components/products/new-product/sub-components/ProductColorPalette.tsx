import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useColorPalette from "../../../../hooks/useColorPalette";
import { NewProductFormData } from "../../../validation-schems/products/new-product-schema";
import { Control, Controller, UseFormRegister } from "react-hook-form";

interface CustomSelectProps {
  selectedColor: string | null;
  handleColorsChange: (color: string | null, id: number | null) => void;
  register: UseFormRegister<NewProductFormData>;
  index: number;
  control: Control<NewProductFormData>;
}

const ProductColorPalette: React.FC<CustomSelectProps> = ({
  selectedColor,
  handleColorsChange,
  register,
  index,
  control,
}) => {
  const { colors } = useColorPalette(); // Fetch colors from API
  const [listOpen, setListOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setListOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setListOpen(false);
  }, [selectedColor]);

  return (
    <div className="relative inline-block w-full" ref={ref}>
      <div className="w-full">
        <div className="bg-white border border-gray-300 rounded-sm shadow">
          <div className="p-2">
            <div className="flex justify-between items-center w-80">
              <div className="flex items-center space-x-2">
                {selectedColor ? (
                  <>
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span>{selectedColor}</span>
                  </>
                ) : (
                  <span>Select A Color</span>
                )}
              </div>
              <button
                type="button"
                className="px-2 py-[2px] flex items-center justify-center hover:bg-gray-200 rounded-md"
                onClick={() => setListOpen(!listOpen)}
              >
                <ArrowDown width={15} />
              </button>
            </div>
          </div>
        </div>
        {listOpen && (
          <Controller
            name={`variants.${index}.color_id`} // Update to use color_id
            control={control}
            render={({ field }) => (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto z-10">
                <div
                  className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    field.onChange(null); // Set color_id to null when "Select A Color" is chosen
                    handleColorsChange("", null);
                  }}
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: "#ffffff" }}
                  />
                  <span>Select A Color</span>
                </div>
                {colors?.map((color) => (
                  <div
                    key={color.id}
                    className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      field.onChange(color.id); // Update the selected color_id in the form
                      handleColorsChange(color.hexa, color.id); // Update selectedColor and color_id
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color.hexa }}
                    />
                    <span>{color.name}</span>
                  </div>
                ))}
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ProductColorPalette;
