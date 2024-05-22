import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Admins,
  Customers,
  Dashboard,
  Footer,
  Navbar,
  Sidebar,
  Vendors,
} from "./components";
import { useStateContext } from "./contexts/ContextProvider";
import AdminProfile from "./components/AdminProfile";
import Test from "./components/Test";
import Login from "./components/Login";
function App() {
const {activeMenu} =useStateContext();
  return (
    <div>
      <BrowserRouter>
        <div className="flex relative">
          {activeMenu ? (
            <div className="w-72 fixed  bg-white ">
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
            <div className="m-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts/Admins" element={<Admins />} />
                <Route path="/accounts/Admins/:id" element={<AdminProfile />} />
                <Route path="/accounts/Customers" element={<Customers />} />
                <Route path="/accounts/Vendors" element={<Vendors />} />
              </Routes>
            </div>
            <div>
             {/* <Test /> */}
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
