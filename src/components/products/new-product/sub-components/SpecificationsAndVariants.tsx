import { useEffect, useState } from "react";
import AddProductSpecification from "./AddProductSpecification";
import AddProductVariant from "./AddProductVariant";
import { useLocation } from "react-router-dom";



const SpecificationsAndVariants = () => {
  const [productId, setProductId] = useState("");

  const { state } = useLocation();

  useEffect(() => {
    if (state || state?.productId) setProductId(state?.productId);
  }, [state]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="my-4 text-xl font-semibold">Add Product Specifications</h1>
        <AddProductSpecification productId={productId} />
        <p className="divider divider-vertical max-w-2xl my-10"></p>
        <h1 className="my-4 text-xl font-semibold ">Add Product Variants</h1>
        <AddProductVariant productId={productId} />
      </div>
    </div>
  );
};

export default SpecificationsAndVariants;
