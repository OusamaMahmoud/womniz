import { Specification, ProductDetailsHeading } from "../ProductDetailsUI";

const ProductDetailsSpecification = ({
  specifications,
  handleEditBtn,
}: {
  specifications: Specification[];
  handleEditBtn: () => void;
}) => {
  return (
    <div className="border w-full xl:max-w-7xl mt-6 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Specification"
        handleEditBtn={handleEditBtn}
      />
      <div className="flex flex-col gap-4 my-4 px-4 ">
        {specifications.map((specific) => (
          <div
            key={specific.id}
            className="flex flex-col md:flex-row gap-2 items-center justify-between   "
          >
            <span className="font-bold opacity-45 min-w-36  text-lg self-start">
              {specific.name}:
            </span>
            <span className="text-left">{specific.value}</span>
            <p className="divider divider-vertical"></p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductDetailsSpecification;
