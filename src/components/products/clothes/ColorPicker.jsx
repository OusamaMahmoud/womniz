import React, { useState } from "react";
import { ChromePicker } from "react-color";

const ColorPicker = ({ onChange }) => {
  const [color, setColor] = useState("#fff"); // Default color

  const handleChangeComplete = (color) => {
    setColor(color.hex);
    onChange(color.hex); // Notify parent component of color change
  };

  return (
    <div>
      <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
    </div>
  );
};

export default ColorPicker;
