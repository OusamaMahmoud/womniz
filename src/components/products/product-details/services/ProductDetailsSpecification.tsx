import { Specification, ProductDetailsHeading } from "../ProductDetailsUI";

const ProductDetailsSpecification = ({
  specifications,
  handleEditBtn,
}: {
  specifications: Specification[];
  handleEditBtn: () => void;
}) => {
  return (
    <div className="border w-full xl:max-w-5xl mt-6 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Specification"
        handleEditBtn={handleEditBtn}
      />
      <div className="flex flex-col gap-4 my-4 px-4 ">
        {specifications.map((specific) => (
          <div
            key={specific.id}
            className="flex flex-col md:flex-row gap-4 md:items-center "
          >
            <p className="font-bold text-gray-400 max-w-80 self-start md:self-auto">
              {specific.name}:
            </p>
            <p>{specific.value}</p>
            <p className="divider divider-vertical"></p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductDetailsSpecification;
