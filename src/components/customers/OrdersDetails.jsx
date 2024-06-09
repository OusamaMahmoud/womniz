import React from "react";
import { RxCross1 } from "react-icons/rx";

const OrdersDetails = () => {
  return (
    <div>
      <div className="my-10">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <div className="flex justify-around">
          <div className="shadow-xl mt-7 p-5 rounded-xl min-w-[600px]">
            <h2 className="text-xl font-bold mb-6">Order Info:</h2>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Order ID:</span>
              <span>#1234</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Order Date:</span>
              <span>20/8/2023</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Delivery Date:</span>
              <span>20/8/2023</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Status</span>
              <span className="badge bg-[#F0CC4E29] text-[#F0CC4E] p-4">
                Confirmed
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Payment Status:</span>
              <span className="badge bg-[#32936F29] text-[#32936F] p-4">
                Paid
              </span>
            </div>
          </div>
          <div className="shadow-xl mt-7 p-5 rounded-xl min-w-[600px]">
            <h2 className="text-xl font-bold mb-6">Customer Info::</h2>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Name</span>
              <span>Ahmed Sayed</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Email:</span>
              <span>AhmedSayed@Gmail.com</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Phone Num:</span>
              <span>123456789</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Address</span>
              <span className=""> Omer Al Mokhtar St</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-2">
              <span className="text-lg font-bold">Payment Method:</span>
              <span className="">
                <img src="//assets/customer/visa.svg" className="mr-2" />
                **** **** **** 1234
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Vendor</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Womniz %</th>
              <th>Vat</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123456789111</td>
              <td className="flex gap-2 items-center">
                <img src="//assets/customer/car.svg" /> Hoodie
              </td>
              <td>Pranjalpets</td>
              <td>2</td>
              <td>2</td>
              <td>$100</td>
              <td>5%</td>
              <td>3$</td>
              <td>45$</td>
              <td>45$</td>
            </tr>
            <tr>
              <td>123456789111</td>
              <td className="flex gap-2 items-center">
                <img src="//assets/customer/car.svg" /> Hoodie
              </td>
              <td>Pranjalpets</td>
              <td>2</td>
              <td>2</td>
              <td>$100</td>
              <td>5%</td>
              <td>3$</td>
              <td>45$</td>
              <td>45$</td>
            </tr>
          </tbody>
        </table>
        <div className="grid grid-cols-2 gap-20  border p-10 rounded-lg shadow-xl mt-8">
          <div className="flex justify-between">
            <div className="flex flex-col gap-4 ">
              <span>Shipping</span>
              <span>$15</span>
            </div>
            <div>
              <RxCross1 />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-4 ">
              <span>Vat</span>
              <span>$15</span>
            </div>
            <div>
              <RxCross1 />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg mb-2">Sub total Price</h1>
            <span>100$</span>
          </div>

          <div>
            <h1 className="font-bold text-lg mb-2">Total Price</h1>
            <span>100$</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetails;
