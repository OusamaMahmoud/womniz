import { Edit3Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../services/api-client";
import { TableSkeleton } from "../../reuse-components/TableSkeleton";
import ProductDetailsThumbnail, {
  ProductImage,
} from "./services/ProductDetailsThumbnail";
import ProductColorsAndSizes from "./services/ProductsClorsAndSizes";
import ProductDetailsCategories from "./services/ProductDetailsCategories";
import ProductDetailsSpecification from "./services/ProductDetailsSpecification";
import { ToastContainer } from "react-toastify";

export interface Size {
  discount: string;
  price: string;
  price_after_sale: string;
  quantity: string;
  size: string;
  sku: string;
  sku_id: string;
}
export interface Color {
  has_quantity: boolean;
  quantities: string;
  color: string;
  sizes: Size[];
}
export interface Specification {
  id: string;
  name: string;
  value: string;
}
export interface Brand {
  id: string;
  name_en: string;
  name_ar: string;
  icon: string;
}
interface Product {
  id: string;
  thumbnail: string;
  model_id: string;
  price: string;
  price_after_sale: string;
  discount: string;
  images: ProductImage[];
  name_en: string;
  colors: Color[];
  specifications: Specification[];
  desc_en: string;
  stock: string;
  seller_sku: string;
  brand: Brand;
  categories: { id: string; name: string }[];
}
const ProductDetailsUI = () => {
  const { state: productId } = useLocation();
  const [product, setProduct] = useState<Product>();
  const [isFetchProductLoading, setIsFetchProductLoading] = useState(false);

  const navigate = useNavigate();

  const handleGetTargetProduct = async () => {
    try {
      setIsFetchProductLoading(true);
      const res = await apiClient.get(`/products/${productId}`);
      setProduct(res.data.data);
      console.log(res.data.data);
      setIsFetchProductLoading(false);
    } catch (error) {
      console.log(error);
      setIsFetchProductLoading(false);
    }
  };

  useEffect(() => {
    handleGetTargetProduct();
  }, [productId]);

  if (isFetchProductLoading)
    return (
      <TableSkeleton noOfElements={6} rectangleWithContent={"RECTANGLE"} />
    );

  return (
    <div className="p-4 2xl:max-w-[1800px] flex flex-col mx-auto">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row justify-between lg:gap-10 items-center lg:items-start">
        <div className="w-full xl:min-w-[600px] order-2 lg:order-none ">
          <div className="border w-full  mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
            <ProductDetailsHeading
              actionKey="Edit"
              label="Details"
              handleEditBtn={() => console.log("Edit")}
            />
            <div className="flex flex-col gap-4 my-4 px-4 ">
              <div className="flex items-center justify-between   ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Product Name:
                </span>
                <span>{product?.name_en}</span>
              </div>

              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.brand.name_en}
                </div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Model_id:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.model_id}
                </div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Seller_sku:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.seller_sku}
                </div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Stock:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.stock} items
                </div>
              </div>
              <p className="divider divider-vertical my-1"></p>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Price:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  ${product?.price}
                </div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sale:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.discount}%
                </div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  price_after_sale:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  ${product?.price_after_sale}
                </div>
              </div>

              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Description:
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  {product?.desc_en}
                </div>
              </div>
            </div>
          </div>

          {product?.colors && (
            <ProductColorsAndSizes
              colors={product?.colors}
              handleAddSizesBtn={() =>
                navigate("/add-specification-variants", {
                  state: { productId: productId, key: "edit" },
                })
              }
            />
          )}
        </div>

        {product && (
          <ProductDetailsThumbnail
            handleEditBtn={() => console.log("thumbnail")}
            images={product.images}
            thumbnail={product.thumbnail}
          />
        )}
      </div>

      {product?.categories && (
        <ProductDetailsCategories
          categories={product.categories}
          handleEditBtn={() =>
            navigate("/add-product-categories", {
              state: { productId: productId, key: "edit" },
            })
          }
          productId={product?.id}
        />
      )}
      {product?.specifications && (
        <ProductDetailsSpecification
          handleEditBtn={() =>
            navigate("/add-specification-variants", {
              state: { productId: productId, key: "edit" },
            })
          }
          productId={productId}
          specifications={product?.specifications}
        />
      )}
    </div>
  );
};

export default ProductDetailsUI;

export const ProductDetailsHeading = ({
  label,
  handleEditBtn,
  actionKey,
}: {
  label: string;
  actionKey: string;
  handleEditBtn: () => void;
}) => {
  return (
    <div className="flex justify-between  items-center bg-[#B6C9B599] p-4 ">
      <h1 className="text-xl font-semibold">{label}</h1>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleEditBtn}
      >
        <Edit3Icon className="" width={20} />
        <span className="font-medium text-sm link">{actionKey}</span>
      </div>
    </div>
  );
};
