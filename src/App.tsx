import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import ScratchCoupon from "./components/games/ScratchCoupon";
import SpinTheWheel from "./components/games/SpinTheWheel";
import Roles from "./components/roles-and-permtions/Roles";
import VendorBrand from "./components/vendors/VendorBrand";
import AllVendorBrandsProducts from "./components/vendors/AllVendorBrandsProducts";
import BrandProfile from "./components/vendors/BrandProfile";
import FinancialReport from "./components/vendors/FinancialReport";
import RequiredAuth from "./components/RequiredAuth";
import usePermissions from "./hooks/usePremissions";
import Requests from "./components/Requests";
import AllProducts from "./components/products/all/AllProducts";
import OrdersDetails from "./components/orders/OrderDetails";
import SpecificStatusOrder from "./components/orders/SpecificStatusOrder";
import OrdersComponent from "./components/orders/OrdersComponent";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import AdminProfile from "./components/admins/AdminProfile";
import MainBrands from "./components/products/mainBrands/MainBrands";
import NewProduct from "./components/products/new-product/NewProduct";
import i18n from "../src/i18n/i18n";
import { useStateContext } from "./contexts/ContextProvider";
import Salons from "./components/salons/pages/Salons";
import AddNewSalonForm from "./components/salons/pages/AddNewSalonForm";
import SalonDetails from "./components/salons/pages/SalonDetails";
import ServicesTables from "./components/salons/components/one-time/salonDetailsComponents/features/tables/ServicesTables";
import BranchesTables from "./components/salons/components/one-time/salonDetailsComponents/features/tables/BranchesTables";
import ProfessionalsTables from "./components/salons/components/one-time/salonDetailsComponents/features/tables/ProfessionalsTables";
import ProductDetailsUI from "./components/products/product-details/ProductDetailsUI";
import ProductCategoriesUI from "./components/products/product-categories/ProductCategoriesUI";
import SubCategory from "./components/products/product-categories/sub-categories/SubCategory";
import SpecificationsAndVariants from "./components/products/new-product/sub-components/SpecificationsAndVariants";
import DynamicCategoryForm from "./components/products/new-product/sub-components/DynamicCategoryForm";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);
  const { permissions ,isLoading } = usePermissions();

  const ADMINS_PERMISSIONS = permissions[0]?.permissions?.map((_) => _.name);
  const ROLES_PERMISSIONS = permissions[1]?.permissions?.map((_) => _.name);
  const SCRATCH_PERMISSIONS = permissions[2]?.permissions?.map((_) => _.name);
  const SPIN_PERMISSIONS = permissions[3]?.permissions?.map((_) => _.name);
  const USERS_PERMISSIONS = permissions[4]?.permissions?.map((_) => _.name);
  const VENDORS_PERMISSIONS = permissions[5]?.permissions?.map((_) => _.name);
  const { lang } = useStateContext();

  const { pathname } = useLocation();
  // useEffect(() => {
  //   if (pathname === "/login") {
  //     permissions.splice(0, permissions.length, {} as any);
  //   }
  // }, [pathname, permissions]);

  if (isLoading && permissions && permissions?.length < 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="loader-animation">
          <img
            src="/assets/logo.svg"
            alt="Loading..."
            className="h-64 w-64 animate-zoom"
          />
        </div>
      </div>
    );
  }
  
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
        <Route path="/" element={<Dashboard />} />
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
        <Route path="/main-categories" element={<ProductCategoriesUI />} />
        <Route path="/main-brands" element={<MainBrands />} />
        <Route
          path="/add-specification-variants"
          element={<SpecificationsAndVariants />}
        />
        <Route
          path="/add-product-categories"
          element={<DynamicCategoryForm />}
        />

        {/* categories */}

        <Route
          path="main-categories/:id/sub-categories"
          element={<SubCategory />}
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
        {/* Brands */}

        {/* Product details */}
        <Route path="products/new-product" element={<NewProduct />} />
        <Route path="/product-details/:id" element={<ProductDetailsUI />} />

        {/* Orders */}
        <Route path="orders" element={<OrdersComponent />} />
        <Route path="orders/orders-details/:id" element={<OrdersDetails />} />
        <Route path="orders/:slug" element={<SpecificStatusOrder />} />

        {/*cosmetics  */}

        {/* Salons */}
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/add-new-salon" element={<AddNewSalonForm />} />
        <Route path="/salon-details" element={<SalonDetails />} />

        <Route
          path="/services-table"
          element={<ServicesTables id="headerExist" />}
        />
        <Route path="/branches-table" element={<BranchesTables />} />
        <Route path="/professionals-table" element={<ProfessionalsTables />} />

        {/* Salons */}

        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
