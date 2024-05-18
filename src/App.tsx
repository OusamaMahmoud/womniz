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
            <div className="fixed md:static w-full ">
              <Navbar />
            </div>
            <div className="m-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts/Admins" element={<Admins />} />
                <Route path="/accounts/Customers" element={<Customers />} />
                <Route path="/accounts/Vendors" element={<Vendors />} />
              </Routes>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
