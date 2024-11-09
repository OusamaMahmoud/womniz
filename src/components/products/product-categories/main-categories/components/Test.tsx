import React, { useState } from "react";

function ExampleComponent() {
  const [items, setItems] = useState([1, 2, 3, 4]);

  const removeLastItem = () => {
    console.log(items.pop());
    // setItems((prevItems) => prevItems.slice(0, -1));
    setItems([...items]);
  };

  return (
    <div>
      <h3>Items: {items.join(", ")}</h3>
      <button onClick={removeLastItem}>Remove Last Item</button>
    </div>
  );
}

export default ExampleComponent;
