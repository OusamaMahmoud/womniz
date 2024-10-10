import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import CustomerProfile from "./components/customers/CustomerProfile";
import CustomerOrders from "./components/customers/CustomerOrders";
import { Admins, Dashboard } from "./components";
import Customers from "./components/customers/Customers";
import Vendors from "./components/vendors/Vendors";
import VendorProfile from "./components/vendors/VendorProfile";
import Layout from "./components/Layout";
import UnauthorizedPage from "./components/UnauthorizedPage";
import MissingPage from "./components/MissingPage";
import Clothes from "./components/products/clothes/Clothes";
import ScratchCoupon from "./components/games/ScratchCoupon";
import SpinTheWheel from "./components/games/SpinTheWheel";
import Roles from "./components/roles-and-permtions/Roles";
import VendorBrand from "./components/vendors/VendorBrand";
import AllVendorBrandsProducts from "./components/vendors/AllVendorBrandsProducts";
import BrandProfile from "./components/vendors/BrandProfile";
import FinancialReport from "./components/vendors/FinancialReport";
import RequiredAuth from "./components/RequiredAuth";
import usePermissions from "./hooks/usePremissions";
import ClothsSubCategory from "./components/products/clothes/ClothsSubCategory";
import ProductDetails from "./components/products/clothes/ProductDetails";
import Requests from "./components/Requests";
import Salons from "./components/salons/Salons";
import SalonProfile from "./components/salons/SalonProfile";
import ProductDescription from "./components/products/clothes/ProductDescription";
import AllProducts from "./components/products/all/AllProducts";
import Jewellery from "./components/products/jewellery/Jewellery";
import NewJewellery from "./components/products/jewellery/NewJewellery";
import JewellerySubCategory from "./components/products/jewellery/JewllerySubCategory";
import OrdersDetails from "./components/orders/OrderDetails";
import SpecificStatusOrder from "./components/orders/SpecificStatusOrder";
import OrdersComponent from "./components/orders/OrdersComponent";
import Cosmetics from "./components/products/cosmetics/Cosmetics";
import NewCosmetics from "./components/products/cosmetics/NewCosmetics";
import CosmeticsSubCategory from "./components/products/cosmetics/CosmeticsSubCategory";
import Celebrities from "./components/products/celebrities/Celebrities";
import NewCelebrities from "./components/products/celebrities/NewCelebrities";
import CelebritiesSubCategory from "./components/products/celebrities/CelebritiesSubCategory";
import ProductDetailsEditing from "./components/products/clothes/ProductDetailsEditing";
import NewClothes from "./components/products/clothes/NewClothes";
import NewClothesEdit from "./components/products/clothes/NewClothesEdit";
import NewJewelleryEdit from "./components/products/jewellery/NewJewelleryEdit";
import NewCosmeticsEdit from "./components/products/cosmetics/NewCosmeticsEdit";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import NewCelebritiesEdit from "./components/products/celebrities/NewCelebritiesEdit";
import AdminProfile from "./components/admins/AdminProfile";
import MainCategories from "./components/products/mainCategories/MainCategories";
import MainBrands from "./components/products/mainBrands/MainBrands";
import NewProduct from "./components/products/new-product/NewProduct";




function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  const { permissions } = usePermissions();

  const ADMINS_PERMISSIONS = permissions[0]?.permissions.map((_) => _.name);
  const ROLES_PERMISSIONS = permissions[1]?.permissions.map((_) => _.name);
  const SCRATCH_PERMISSIONS = permissions[2]?.permissions.map((_) => _.name);
  const SPIN_PERMISSIONS = permissions[3]?.permissions.map((_) => _.name);
  const USERS_PERMISSIONS = permissions[4]?.permissions.map((_) => _.name);
  const VENDORS_PERMISSIONS = permissions[5]?.permissions.map((_) => _.name);

  useEffect(() => {
    console.log(ROLES_PERMISSIONS);
  }, [permissions]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        <Route element={<RequiredAuth allowedRoles={ROLES_PERMISSIONS} />}>
          <Route path="roles-permissions" element={<Roles />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={ADMINS_PERMISSIONS} />}>
          <Route path="accounts/admins" element={<Admins />} />
          <Route path="accounts/admins/:id" element={<AdminProfile />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={USERS_PERMISSIONS} />}>
          <Route path="accounts/customers" element={<Customers />} />
          <Route path="accounts/customers/:id" element={<CustomerProfile />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={VENDORS_PERMISSIONS} />}>
          <Route path="accounts/vendors" element={<Vendors />} />
          <Route path="accounts/vendors/:id" element={<VendorProfile />} />
          <Route path="accounts/vendors/brands" element={<VendorBrand />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Games */}
        <Route element={<RequiredAuth allowedRoles={SCRATCH_PERMISSIONS} />}>
          <Route path="games/scratch" element={<ScratchCoupon />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={SPIN_PERMISSIONS} />}>
          <Route path="games/spin" element={<SpinTheWheel />} />
        </Route>
        {/* Games */}

        {/* all products */}
        <Route path="products" element={<AllProducts />} />
        {/* categories */}
        <Route path="products/categories" element={<MainCategories />} />
        {/* brands */}
        <Route path="products/brands" element={<MainBrands />} />

        <Route
          path="see-all-customers-orders/:id"
          element={<CustomerOrders />}
        />

        {/* Clothes */}
        <Route path="products/clothes" element={<Clothes />} />
        <Route path="products/clothes/new-clothes" element={<NewClothes />} />
        <Route path="products/clothes/edit/:id" element={<NewClothesEdit />} />

        <Route
          path="products/clothes/cloths-sub-category"
          element={<ClothsSubCategory />}
        />
        <Route
          path="products/clothes/product-description"
          element={<ProductDescription />}
        />

        {/* Clothes */}

        {/* Brands */}
        <Route
          path="AllVendorBrandsProducts"
          element={<AllVendorBrandsProducts />}
        />
        <Route
          path="AllVendorBrandsProducts/brandProfile"
          element={<BrandProfile />}
        />
        <Route path="financial-reports" element={<FinancialReport />} />
        <Route path="accounts/requests" element={<Requests />} />
        {/* Brands */}

        {/* Product details */}
        <Route
          path="products/product-details/:id"
          element={<ProductDetails />}
        />
        <Route
          path="products/product-details/:id/edit"
          element={<ProductDetailsEditing />}
        />
        {/* Product details */}
        <Route path="products/new-product" element={<NewProduct />} />
        {/* Salons */}
        <Route path="salons/salons-profiles" element={<Salons />} />
        <Route path="salons/salons-profiles/:id" element={<SalonProfile />} />
        {/* Salons */}

        {/* Jewelry */}
        <Route path="products/jewellery" element={<Jewellery />} />
        <Route
          path="products/jewellery/new-jewellery"
          element={<NewJewellery />}
        />
        <Route
          path="products/jewellery/jewellery-sub-category"
          element={<JewellerySubCategory />}
        />
        <Route
          path="products/jewellery/edit/:id"
          element={<NewJewelleryEdit />}
        />
        {/* Jewelry */}

        {/* celebrities */}
        <Route path="products/celebrities" element={<Celebrities />} />
        <Route
          path="products/celebrities/new-celebrity"
          element={<NewCelebrities />}
        />
        <Route
          path="products/celebrities/celebrities-sub-category"
          element={<CelebritiesSubCategory />}
        />

        <Route
          path="products/celebrities/new-product"
          element={<NewCelebrities />}
        />
        <Route
          path="/products/celebrities/edit/:id"
          element={<NewCelebritiesEdit />}
        />
        {/* celebrities */}

        {/* Orders */}
        <Route path="orders" element={<OrdersComponent />} />
        <Route path="orders/orders-details/:id" element={<OrdersDetails />} />
        <Route path="orders/:slug" element={<SpecificStatusOrder />} />
        {/* Orders */}

        {/*cosmetics  */}
        <Route path="products/cosmetics" element={<Cosmetics />} />
        <Route
          path="products/cosmetics/new-cosmetics"
          element={<NewCosmetics />}
        />
        <Route
          path="products/cosmetics/edit/:id"
          element={<NewCosmeticsEdit />}
        />
        <Route
          path="products/cosmetics/cosmetics-sub-category"
          element={<CosmeticsSubCategory />}
        />
        <Route
          path="products/cosmetics/cosmetics-sub-category"
          element={<CosmeticsSubCategory />}
        />
        {/*cosmetics  */}

        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
