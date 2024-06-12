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
import NewClothesProduct from "./components/products/clothes/NewClothesProduct";
import ScratchCoupon from "./components/games/ScratchCoupon";
import SpinTheWheel from "./components/games/SpinTheWheel";
import Roles from "./components/roles-and-permtions/Roles";
import VendorBrand from "./components/vendors/VendorBrand";
import AllVendorBrandsProducts from "./components/vendors/AllVendorBrandsProducts";
import BrandProfile from "./components/vendors/BrandProfile";
import FinancialReport from "./components/vendors/FinancialReport";
import RequiredAuth from "./components/RequiredAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route
          element={
            <RequiredAuth
              allowedRoles={[
                "role-list",
                "role-create",
                "role-edit",
                "role-show",
                "role-delete",
              ]}
            />
          }
        >
          <Route path="roles-permissions" element={<Roles />} />
        </Route>
        
        <Route path="games/scratch" element={<ScratchCoupon />} />
        <Route path="games/spin" element={<SpinTheWheel />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts/admins" element={<Admins />} />
        <Route path="accounts/admins/:id" element={<AdminProfile />} />
        <Route path="accounts/customers" element={<Customers />} />
        <Route path="accounts/customers/:id" element={<CustomerProfile />} />
        <Route path="products/clothes" element={<Clothes />} />
        <Route
          path="products/clothes/new-product"
          element={<NewClothesProduct />}
        />
        <Route
          path="see-all-customers-orders/:id"
          element={<CustomerOrders />}
        />
        <Route path="accounts/vendors" element={<Vendors />} />
        <Route path="accounts/vendors/:id" element={<VendorProfile />} />
        <Route path="accounts/vendors/brands" element={<VendorBrand />} />
        <Route
          path="AllVendorBrandsProducts"
          element={<AllVendorBrandsProducts />}
        />
        <Route
          path="AllVendorBrandsProducts/brandProfile"
          element={<BrandProfile />}
        />
        <Route path="financial-reports" element={<FinancialReport />} />
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
