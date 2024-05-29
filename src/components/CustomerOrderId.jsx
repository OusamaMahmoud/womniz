import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import car from "/src/assets/customer/car.svg";
import { BiMinus, BiPlus } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";

const CustomerOrderId = () => {
  const initialOrderDetails = [
    { id: 1, name: "Hoddie", productIcon: car, price: 100, counter: 1 },
    { id: 2, name: "Red Bag", productIcon: car, price: 100, counter: 1 },
  ];

  const [orderDetails, setOrderDetails] = useState(initialOrderDetails);

  const handleAddCounter = (id) => {
    setOrderDetails((prevDetails) =>
      prevDetails.map((order) =>
        order.id === id ? { ...order, counter: order.counter + 1 } : order
      )
    );
  };

  const handleSubtractCounter = (id) => {
    setOrderDetails((prevDetails) =>
      prevDetails.map((order) =>
        order.id === id && order.counter > 1
          ? { ...order, counter: order.counter - 1 }
          : order
      )
    );
  };

  const handleDelete = (id) => {
    setOrderDetails((prevDetails) =>
      prevDetails.filter((order) => order.id !== id)
    );
  };

  return (
    <div className="flex flex-col ">
      <div className="self-center w-[800px]">
        <table className="table ">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((order) => (
              <tr key={order.id}>
                <td className="flex gap-3 text-lg items-center">
                  <img src={order.productIcon} alt={order.name} /> {order.name}
                </td>
                <td className="">
                  <button
                    disabled={order.counter === 1}
                    onClick={() => handleSubtractCounter(order.id)}
                    className="btn btn-outline"
                  >
                    <BiMinus />
                  </button>
                  <span className="mx-4 text-lg font-extrabold">
                    {order.counter}
                  </span>
                  <button
                    onClick={() => handleAddCounter(order.id)}
                    className="btn btn-outline"
                  >
                    <BiPlus />
                  </button>
                </td>
                <td>${order.price * order.counter}</td>
                <td>
                  <button onClick={() => handleDelete(order.id)}>
                    <MdDelete className="text-red-500 text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-20  border p-5 rounded-lg shadow-md mt-8">
        <div className="flex flex-col gap-4">
          <span className="text-xl text-[#47546780]">Order Id</span>
          <span>120</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xl text-[#47546780]">Product SKU</span>
          <div className="flex gap-2">
            <span className="bg-[#E0DDDD] p-1 rounded-md">#1234</span>
            <span className="bg-[#E0DDDD] p-1 rounded-md">#1234</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xl text-[#47546780]">Customer name</span>
          <span>Sara Yasser</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xl text-[#47546780]">Order Date</span>
          <span>31/10/2023</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-20  border p-5 rounded-lg shadow-md mt-8">
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
          <h1 className="font-bold text-lg mb-2">Discount</h1>
          <select className="select select-bordered w-80">
            <option>5$</option>
          </select>
        </div>
        <div>
          <h1 className="font-bold text-lg mb-2">Sub total Price</h1>
          <span>100$</span>
        </div>
        <div>
          <h1 className="font-bold text-lg mb-2">Address</h1>
          <select className="select select-bordered w-80">
            <option>Omer Al Mokhtar St</option>
          </select>
        </div>
        <div>
          <h1 className="font-bold text-lg mb-2">Total Price</h1>
          <span>100$</span>
        </div>
      </div>
      <button className="btn bg-[#577656] self-center px-20 mt-10 text-white">Save</button>
    </div>
  );
};

export default CustomerOrderId;
