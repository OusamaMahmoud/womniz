import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Admins,
  Customers,
  Dashboard,
  Navbar,
  Sidebar,
  Vendors,
} from "./components";
import { useStateContext } from "./contexts/ContextProvider";
import AdminProfile from "./components/AdminProfile";
import Login from "./components/Login";
import useAllAdmins from "./hooks/useAllAdmins";
import CustomerProfile from "./components/CustomerProfile";
import CustomerOrders from "./components/CustomerOrders";

function App() {
  const { activeMenu } = useStateContext();
  const {} = useAllAdmins();
  return (
    <div>
      <BrowserRouter>
        <div className="flex relative">
          {activeMenu ? (
            <div className="w-72 fixed  bg-white  ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? "   min-h-screen md:ml-72 w-full  "
                : " w-full min-h-screen flex-2 "
            }
          >
            <div className="static w-full mt-8">
              <Navbar />
            </div>
            <div className="mt-8"></div>
            <div className="m-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts/admins" element={<Admins />} />
                <Route path="/accounts/admins/:id" element={<AdminProfile />} />
                <Route path="/accounts/customers" element={<Customers />} />
                <Route path="/accounts/customers/:id" element={<CustomerProfile />} />
                <Route path="/see-all-customers-orders/:id" element={<CustomerOrders />} />
                <Route path="/accounts/vendors" element={<Vendors />} />
              </Routes>
            </div>
            <div>{/* <Test /> */}</div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
