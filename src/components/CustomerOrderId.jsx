import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import car from "/src/assets/customer/car.svg";
import { BiMinus, BiPlus } from "react-icons/bi";

const CustomerOrderId = () => {
  const initialOrderDetails = [
    { id: 1, name: "Hoddie", productIcon: car, price: 100, counter: 1 },
    { id: 2, name: "Red Bag", productIcon: car, price: 100, counter: 1 },
  ];

  const [orderDetails, setOrderDetails] = useState(initialOrderDetails);

  const handleAddCounter = (id) => {
    setOrderDetails((prevDetails) =>
      prevDetails.map((order) =>
        order.id === id
          ? { ...order, counter: order.counter + 1 }
          : order
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
    <div>
      <div>
        <table className="table">
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
                  <button onClick={() => handleDelete(order.id)} >
                    <MdDelete className="text-red-500 text-xl"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CustomerOrderId;
