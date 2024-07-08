import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminProfile from "./components/AdminProfile";
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
import NewClothesProduct from "./components/products/clothes/NewClothes";
import ScratchCoupon from "./components/games/ScratchCoupon";
import SpinTheWheel from "./components/games/SpinTheWheel";
import Roles from "./components/roles-and-permtions/Roles";
import VendorBrand from "./components/vendors/VendorBrand";
import AllVendorBrandsProducts from "./components/vendors/AllVendorBrandsProducts";
import BrandProfile from "./components/vendors/BrandProfile";
import FinancialReport from "./components/vendors/FinancialReport";
import RequiredAuth from "./components/RequiredAuth";
import usePermissions from "./hooks/usePremissions";
import { useEffect } from "react";
import AllProducts from "./components/products/AllProducts";
import ClothsSubCategory from "./components/products/clothes/ClothsSubCategory";
import ProductDescription from "./components/products/ProductDescription";
import ProductDetails from "./components/products/ProductDetails";
import Requests from "./components/Requests";
import Salons from "./components/salons/Salons";
import SalonProfile from "./components/salons/SalonProfile";
import Jewelry from "./components/products/jewelry/Jewelry";
import NewJewelry from "./components/products/jewelry/NewJewelry";
import Celebrities from "./components/products/celebrities/Celebrities";
import NewCelebrity from "./components/products/celebrities/NewCelebrities";

function App() {
  const { permissions } = usePermissions();

  const ADMINS_PERMISSIONS = permissions[0]?.permissions.map((_) => _.name);
  const ROLES_PERMISSIONS = permissions[1]?.permissions.map((_) => _.name);
  const SCRATCH_PERMISSIONS = permissions[2]?.permissions.map((_) => _.name);
  const SPIN_PERMISSIONS = permissions[3]?.permissions.map((_) => _.name);
  const USERS_PERMISSIONS = permissions[4]?.permissions.map((_) => _.name);
  const VENDORS_PERMISSIONS = permissions[5]?.permissions.map((_) => _.name);

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
        <Route element={<RequiredAuth allowedRoles={SCRATCH_PERMISSIONS} />}>
          <Route path="games/scratch" element={<ScratchCoupon />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={SPIN_PERMISSIONS} />}>
          <Route path="games/spin" element={<SpinTheWheel />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products/all-products" element={<AllProducts />} />
        <Route path="products/clothes" element={<Clothes />} />
        <Route
          path="products/clothes/new-product"
          element={<NewClothesProduct />}
        />
        <Route
          path="see-all-customers-orders/:id"
          element={<CustomerOrders />}
        />

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
        <Route
          path="products/clothes/cloths-sub-category"
          element={<ClothsSubCategory />}
        />
        <Route
          path="products/clothes/product-description"
          element={<ProductDetails />}
        />
        <Route
          path="products/clothes/product-details"
          element={<ProductDetails />}
        />
        {/* Salons */}
        <Route path="salons/salons-profiles" element={<Salons />} />
        <Route path="salons/salons-profiles/:id" element={<SalonProfile />} />
{/* Jewelry */}
        <Route path="products/jewelry" element={<Jewelry />} />
        <Route path="products/jewelry/new-jewelry" element={<NewJewelry />} />
        
        <Route path="products/celebrities" element={<Celebrities />} />
        <Route path="products/celebrities/new-celebrity" element={<NewCelebrity />} />
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
