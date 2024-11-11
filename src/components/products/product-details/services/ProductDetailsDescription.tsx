import { ProductDetailsHeading } from "../ProductDetailsUI";

const ProductDetailsDescription = ({
  handleEditBtn,
  description,
}: {
  handleEditBtn: () => void;
  description: string;
}) => {
  return (
    <div className="border w-full xl:max-w-7xl mt-6 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Description"
        handleEditBtn={handleEditBtn}
      />
      <div className="p-4">{description}</div>
    </div>
  );
};
export default ProductDetailsDescription;
