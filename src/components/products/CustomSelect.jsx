import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomSelect = ({ colors, selectedColor, handleColorsChange }) => {
  const [listOpen, setListOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
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
                className="animate-pulse px-2 py-[2px] flex items-center justify-center hover:bg-gray-200 rounded-md"
                onClick={() => setListOpen(!listOpen)}
              >
                <ArrowDown width={15}/>
              </button>
            </div>
          </div>
        </div>
        {listOpen && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto z-10">
            <div
              className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleColorsChange("")}
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
                onClick={() => handleColorsChange(color.hexa, color.id)}
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color.hexa }}
                />
                <span>{color.color}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
