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
import ProductBasicInformation from "./services/ProductBasicInformation";

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
export interface Product {
  id: string;
  thumbnail: string;
  model_id: string;
  price: string;
  price_after_sale: string;
  discount: string;
  images: ProductImage[];
  name_en: string;
  name_ar: string;
  colors: Color[];
  specifications: Specification[];
  desc_en: string;
  desc_ar: string;
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
          {product && <ProductBasicInformation product={product} />}

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
            images={product.images}
            thumbnail={product.thumbnail}
            productId={productId}
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
        {actionKey && <Edit3Icon className="" width={20} />}
        <span className="font-medium text-sm link">{actionKey}</span>
      </div>
    </div>
  );
};
