import { useState } from "react";
import { Product, ProductDetailsHeading } from "../ProductDetailsUI";
import apiClient from "../../../../services/api-client";
import { showToast } from "../../../reuse-components/ShowToast";
import useBrands from "../../../../hooks/useBrands";

const ProductBasicInformation = ({ product }: { product: Product }) => {
  // Local state for the form data
  const [formData, setFormData] = useState({
    name_en: product.name_en,
    name_ar: product.name_ar,
    brand_id: product.brand.id,
    model_id: product.model_id,
    seller_sku: product.seller_sku,
    stock: product.stock,
    price: product.price,
    discount: product.discount,
    desc_en: product.desc_en,
    desc_ar: product.desc_ar,
  });
  const { brands } = useBrands(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleEditModel = (key: "OPEN" | "CLOSE") => {
    const modal = document.getElementById(
      "productBasicInformationModal"
    ) as HTMLDialogElement;
    if (modal) {
      key === "OPEN" ? modal.showModal() : modal.close();
    }
  };

  const handleSave = async () => {
    const apiData = new FormData();

    apiData.append("name_en", formData.name_en);
    apiData.append("name_ar", formData.name_ar);
    apiData.append("desc_en", formData.desc_en);
    apiData.append("desc_ar", formData.desc_ar);
    apiData.append("price", formData.price);
    apiData.append("discount", formData.discount);
    apiData.append("model_id", formData.model_id);
    apiData.append("seller_sku", formData.seller_sku);
    apiData.append("stock", formData.stock);
    apiData.append("brand_id", formData.brand_id);
    apiData.append("_method", "PUT");

    try {
      const res = await apiClient.post(`/products/${product.id}`, apiData);
      console.log(res);
      showToast(
        "You has been Updating Product Information Successfully.",
        "success"
      );
      setFormData((prev) => ({
        ...prev,
        desc_ar: formData.desc_ar,
        desc_en: formData.desc_en,
        brand_id: formData.brand_id,
        stock: formData.stock,
        discount: formData.discount,
        model_id: formData.model_id,
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        price: formData.price,
        seller_sku: formData.seller_sku,
      }));
      handleToggleEditModel("CLOSE");
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!.", "error");
    }
  };

  return (
    <>
      <div className="border w-full mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden">
        {/* Modal */}
        <dialog id="productBasicInformationModal" className="modal">
          <div className="modal-box w-[1000px]">
            <h1 className="text-lg font-bold mb-4">Edit Product Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div>
                <label className="label-text block mb-2">
                  Product Name (English){" "}
                </label>
                <input
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="label-text block mb-2">
                  Product Name (Arabic)
                </label>
                <input
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Brand</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text block mb-2">Model ID</label>
                <input
                  name="model_id"
                  value={formData.model_id}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter model ID"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Seller SKU</label>
                <input
                  name="seller_sku"
                  value={formData.seller_sku}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter seller SKU"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Stock</label>
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Price</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="label-text block mb-2">Discount</label>
                <input
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter discount"
                />
              </div>

              <div>
                <label className="label-text block mb-2">
                  Description (English)
                </label>
                <textarea
                  name="desc_en"
                  value={formData.desc_en}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter description"
                ></textarea>
              </div>
              <div>
                <label className="label-text block mb-2">
                  Description (Arabic)
                </label>
                <textarea
                  name="desc_ar"
                  value={formData.desc_en}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-[#577656] px-12 text-white"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn"
                onClick={() => handleToggleEditModel("CLOSE")}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>

        {/* Product Information */}
        <ProductDetailsHeading
          actionKey="Edit"
          label="Details"
          handleEditBtn={() => handleToggleEditModel("OPEN")}
        />

        <div className="flex flex-col gap-4 my-4 px-4">
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Product Name:
            </span>
            <span>{formData.name_en}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Brand:
            </span>
            <span>
              {formData.brand_id &&
                brands.find((item) => item.id == formData.brand_id)?.name_en}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Model ID:
            </span>
            <span>{formData.model_id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Seller SKU:
            </span>
            <span>{formData.seller_sku}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Stock:
            </span>
            <span>{formData.stock} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Price:
            </span>
            <span>${formData.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Discount:
            </span>
            <span>{formData.discount}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold opacity-45 min-w-36 text-lg">
              Price After Sale:
            </span>
            <span>${product.price_after_sale}</span>
          </div>
        </div>
        {/* Product Information */}
      </div>
      <div className="border w-full mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden">
        <ProductDetailsHeading
          actionKey=""
          label="Description"
          handleEditBtn={() => handleToggleEditModel("OPEN")}
        />
        <div className="flex items-center justify-between p-3">
          <span>{formData.desc_en}</span>
        </div>
      </div>
    </>
  );
};

export default ProductBasicInformation;
