import { useState } from "react";

const colorsBallet = [
  { name: 'Red', code: '#FF0000' },
  { name: 'Green', code: '#00FF00' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Purple', code: '#800080' },
  // Add more colors as needed
];

const ColorsComp = () => {

  const [selectedColor, setSelectedColor] = useState('');

  const handleChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <div>
      <label htmlFor="color-select">Select a color:</label>
      <select id="color-select" value={selectedColor} onChange={handleChange}>
        <option value="">Select a color</option>
        {colorsBallet.map((color) => (
          <option key={color.code} value={color.code}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  marginRight: '8px',
                }}
              ></span>
              {color.name}
            </div>
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorsComp
