import { Color, ProductDetailsHeading } from "../ProductDetailsUI";

const ProductColorsAndSizes = ({
  colors,
  colorIdx,
  onColorIdx,
}: {
  colors: Color[];
  onColorIdx: (idx: number) => void;
  colorIdx: number;
}) => {
  return (
    <div className="border w-full  mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Colors & Sizes"
        handleEditBtn={() => console.log("Edit")}
      />
      <div className="flex flex-col gap-4 my-4 px-4 ">
        <div className="flex gap-2 items-center  ">
          {colors.map((color, colorIndex) => (
            <div
              onClick={() => onColorIdx(colorIndex)}
              key={color.color}
              className={`cursor-pointer w-8 h-8 bg-[${color.color}] rounded-full border-2 border-black `}
            ></div>
          ))}
        </div>
        <table className="table mt-4 mb-2 ">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Sale</th>
              <th>Price After Sale</th>
            </tr>
          </thead>
          <tbody>
            {colors[colorIdx].sizes.map((size) => (
              <tr key={size.sku_id} className="">
                <td>{size.sku_id}</td>
                <td>{size.size}</td>
                <td>{size.quantity}</td>
                <td>{size.price}</td>
                <td>{size.discount}</td>
                <td>{size.price_after_sale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductColorsAndSizes;
