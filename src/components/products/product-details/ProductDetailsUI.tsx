import { Edit3Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../../../services/api-client";
import { TableSkeleton } from "../../reuse-components/TableSkeleton";
import ProductDetailsThumbnail, {
  ProductImage,
} from "./services/ProductDetailsThumbnail";
import ProductColorsAndSizes from "./services/ProductsClorsAndSizes";
import ProductDetailsDescription from "./services/ProductDetailsDescription";
import ProductDetailsSpecification from "./services/ProductDetailsSpecification";

export interface Size {
  discount: string;
  price: string;
  price_after_sale: string;
  quantity: string;
  size: string;
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
}
const ProductDetailsUI = () => {
  const { state: productId } = useLocation();
  const [product, setProduct] = useState<Product>();
  const [isFetchProductLoading, setIsFetchProductLoading] = useState(false);
  const [colorIdx, setColorIdx] = useState<number>(0);

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
      <div className="p-4 shadow-md flex items-center flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Model ID:</span>
          <span>{product?.model_id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Price:</span>
          <span>${product?.price}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Sale:</span>
          <span>{product?.discount}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Price After Sale:</span>
          <span>${product?.price_after_sale}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:gap-10 items-center lg:items-start">
        <div className="w-full xl:min-w-[600px] order-2 lg:order-none ">
          <div className="border w-full  mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
            <ProductDetailsHeading
              label="Details"
              handleEditBtn={() => console.log("Edit")}
            />
            <div className="flex flex-col gap-4 my-4 px-4 ">
              <div className="flex items-center justify-between   ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Product Name:
                </span>
                <span>T-shirt</span>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Category:
                </span>
                <select className="select select-bordered">
                  <option value={1}>Clothes</option>
                  <option value={1}>Celebrates</option>
                  <option value={1}>jewelries</option>
                </select>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sub Category:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
            </div>
          </div>

          {product?.colors && (
            <ProductColorsAndSizes
              colorIdx={colorIdx}
              colors={product?.colors}
              onColorIdx={(idx) => setColorIdx(idx)}
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

      {product?.desc_en && (
        <ProductDetailsDescription
          description={product?.desc_en}
          handleEditBtn={() => console.log("desc")}
        />
      )}
      {product?.specifications && (
        <ProductDetailsSpecification
          handleEditBtn={() => console.log("specicf eddit")}
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
}: {
  label: string;
  handleEditBtn: () => void;
}) => {
  return (
    <div className="flex justify-between items-center bg-[#B6C9B599] p-4 ">
      <h1 className="text-xl font-semibold">{label}</h1>
      <span className="flex items-center gap-2 " onClick={handleEditBtn}>
        <Edit3Icon className="" width={20} />
        <span className="font-medium text-sm link">Edit</span>
      </span>
    </div>
  );
};
