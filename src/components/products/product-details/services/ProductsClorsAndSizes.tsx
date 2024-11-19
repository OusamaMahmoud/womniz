import { ChangeEvent, useEffect, useState } from "react";
import { Color, ProductDetailsHeading } from "../ProductDetailsUI";
import apiClient from "../../../../services/api-client";
import DeletedModel from "../../../models/DeletedModel";
import { showToast } from "../../../reuse-components/ShowToast";

interface ColorAndSize {
  sku: string;
  price: number;
  discount: number;
  stock: number;
}
const ProductColorsAndSizes = ({
  colors,
  handleAddSizesBtn,
}: {
  colors: Color[];
  handleAddSizesBtn: () => void;
}) => {
  const [colorIdx, setColorIdx] = useState<number>(0);
  const [sizeId, setSizeId] = useState("");
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [colorAndSizeObj, setColorAndSizeObj] = useState<ColorAndSize>(
    {} as ColorAndSize
  );

  const handleToggleModal = (KEY: "OPEN" | "CLOSE") => {
    const modal = document.getElementById(
      "color&sizeModal"
    ) as HTMLDialogElement;
    if (modal) {
      KEY === "OPEN" ? modal.showModal() : modal.close();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setColorAndSizeObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateColorAndSizeForm = (): boolean => {
    const { sku, price, discount, stock } = colorAndSizeObj;

    // Validation checks
    if (!sku || sku.trim() === "") {
      alert("SKU is required.");
      return false;
    }
    if (!price || isNaN(price) || price <= 0) {
      alert("Price must be a valid number greater than 0.");
      return false;
    }
    if (discount === undefined || isNaN(discount) || discount < 0) {
      alert("Discount must be a valid number and cannot be negative.");
      return false;
    }
    if (!stock || isNaN(stock) || stock <= 0) {
      alert("Stock must be a valid number greater than 0.");
      return false;
    }

    // If all checks pass
    return true;
  };

  const handleEditColorObject = async () => {
    const formData = new FormData();

    if (!validateColorAndSizeForm) return;

    formData.append("stock", colorAndSizeObj?.stock?.toString());
    formData.append("price", colorAndSizeObj?.price?.toString());
    formData.append("discount", colorAndSizeObj?.discount?.toString());
    formData.append("sku", colorAndSizeObj?.sku);
    formData.append("_method", "PUT");

    try {
      setIsEditingLoading(true);
      const res = await apiClient.post(
        `product-variant-skus/${sizeId}`,
        formData
      );
      console.log(res);
      setIsEditingLoading(false);
      handleToggleModal("CLOSE");
      showToast("This Size has been edited Successfully.", "success");
    } catch (error) {
      console.log(error);
      setIsEditingLoading(false);
      showToast("Something went wrong!.", "error");
    }
  };

  const handleToggleDeleteModal = (KEY: "OPEN" | "CLOSE") => {
    const modal = document.getElementById(
      "deleteSizeModal"
    ) as HTMLDialogElement;
    if (modal) {
      KEY === "OPEN" ? modal.showModal() : modal.close();
    }
  };

  const handleDeleteBtn = async () => {
    try {
      setIsDeletingLoading(true);
      const res = await apiClient.post(`product-variant-skus/${sizeId}`, {
        _method: "DELETE",
      });
      console.log(res);
      setIsDeletingLoading(false);
      handleToggleDeleteModal("CLOSE");
      showToast("This Size is Deleted Successfully.", "success");
    } catch (error) {
      console.log(error);
      setIsDeletingLoading(false);
      showToast("Something went wrong!", "error");
    }
  };

  useEffect(() => {
    const targetSize = colors[colorIdx]?.sizes?.find(
      (size) => size.sku_id == sizeId
    );
    if (targetSize) {
      setColorAndSizeObj({
        sku: targetSize?.sku,
        discount: +targetSize?.discount,
        price: +targetSize?.price,
        stock: +targetSize?.quantity,
      });
    }
  }, [sizeId, colorIdx]);

  return (
    <div className="border w-full mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden">
      {/* Modal */}
      <dialog id="color&sizeModal" className="modal ">
        <div className="modal-box">
          <h1 className="text-lg font-bold mb-4 flex justify-between items-center">
            <span>Edit</span>
            {isEditingLoading && (
              <div className="loading loading-spinner"></div>
            )}
          </h1>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label-text block mb-2">SKU</label>
              <input
                name="sku"
                value={colorAndSizeObj.sku || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter SKU"
              />
            </div>
            <div>
              <label className="label-text block mb-2">Price</label>
              <input
                name="price"
                type="number"
                value={colorAndSizeObj.price || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter Price"
              />
            </div>
            <div>
              <label className="label-text block mb-2">Discount</label>
              <input
                name="discount"
                type="number"
                value={colorAndSizeObj.discount || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter Discount"
              />
            </div>
            <div>
              <label className="label-text block mb-2">Stock</label>
              <input
                name="stock"
                type="number"
                value={colorAndSizeObj.stock || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter Discount"
              />
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn bg-[#577656] px-16 text-white"
              onClick={handleEditColorObject}
            >
              Save
            </button>
            <button className="btn" onClick={() => handleToggleModal("CLOSE")}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="deleteSizeModal" className="modal">
        <DeletedModel
          handleDeleteBtn={handleDeleteBtn}
          handleCancelBtn={() => handleToggleDeleteModal("CLOSE")}
          isLoading={isDeletingLoading}
        />
      </dialog>

      {/* Heading */}
      <ProductDetailsHeading
        actionKey="Add"
        label="Colors & Sizes"
        handleEditBtn={handleAddSizesBtn}
      />

      {/* Colors */}
      <div className="flex flex-col gap-4 my-4 px-4">
        <div className="flex gap-2 items-center">
          {colors?.map((color, colorIndex) => (
            <div
              key={color.color}
              onClick={() => setColorIdx(colorIndex)}
              style={{ backgroundColor: color.color }}
              className={`cursor-pointer w-8 h-8 rounded-full border-2 ${
                colorIdx === colorIndex ? "border-blue-500" : "border-black"
              }`}
            ></div>
          ))}
        </div>

        {/* Sizes Table */}
        <table className="table mt-4 mb-2">
          <thead>
            <tr>
              <th>SKU_id</th>
              <th>SKU</th>
              <th>Size</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Sale</th>
              <th>Price After Sale</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors[colorIdx]?.sizes?.map((size) => (
              <tr key={size?.sku_id}>
                <td>{size?.sku_id}</td>
                <td>{size?.sku}</td>
                <td>{size?.size}</td>
                <td>{size?.quantity}</td>
                <td>{size?.price}</td>
                <td>{size?.discount}</td>
                <td>{size?.price_after_sale}</td>
                <td className="flex gap-3 items-center">
                  <img
                    src="/assets/products/edit-icon.png"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => {
                      setSizeId(size.sku_id);
                      handleToggleModal("OPEN");
                    }}
                  />
                  <img
                    src="/assets/products/delete-category.png"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => {
                      setSizeId(size.sku_id);
                      handleToggleDeleteModal("OPEN");
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductColorsAndSizes;
