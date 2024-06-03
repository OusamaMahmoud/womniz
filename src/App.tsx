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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts/admins" element={<Admins />} />
        <Route path="accounts/admins/:id" element={<AdminProfile />} />
        <Route path="accounts/customers" element={<Customers />} />
        <Route path="accounts/customers/:id" element={<CustomerProfile />} />
        <Route path="products/clothes" element={<Clothes />} />
        <Route path="products/clothes/new-product" element={<NewClothesProduct />} />
        <Route
          path="see-all-customers-orders/:id"
          element={<CustomerOrders />}
        />
        <Route path="accounts/vendors" element={<Vendors />} />
        <Route path="accounts/vendors/:id" element={<VendorProfile />} />

        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
