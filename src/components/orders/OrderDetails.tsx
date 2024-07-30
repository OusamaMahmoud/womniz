import useTargetOrder from "../../hooks/useTargetOrder";
import { useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

const OrdersDetails = () => {
  const { id } = useParams();

  const { targetOrder, error, isLoading } = useTargetOrder({
    orderId: id || "",
  });

  const subtotal = targetOrder?.orderDetails?.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.price_after_sale;
    },
    0
  );

  return (
    <>
      {error.includes("404") ? (
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The page you requested couldn't be found. This might be because:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-10">
            <li>The URL was mistyped</li>
            <li>The page has moved or no longer exists</li>
            <li>You found a broken link</li>
          </ul>
        </div>
      ) : (
        <p className="my-4 text-lg text-red-500 tracking-wider">{error}</p>
      )}
      {!error && (
        <div className="container mx-auto px-10">
          {!isLoading ? (
            <div>
              <div className=" my-10">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <div className="flex justify-around">
                  <div className="shadow-xl mt-7 p-5 rounded-xl min-w-[600px]">
                    <h2 className="text-xl font-bold mb-6">Order Info:</h2>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Order ID:</span>
                      <span>{targetOrder?.id}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Order Date:</span>
                      <span>{targetOrder?.date}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Delivery Date:</span>
                      <span>{targetOrder?.date}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Status</span>
                      {targetOrder?.status === "pending" ? (
                        <p
                          className={`badge bg-[#ECFDF3] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#14BA6D]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : targetOrder?.status === "canceled" ? (
                        <p
                          className={`badge bg-[#E2000029] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#E2000099]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : targetOrder?.status === "delivery_failed" ? (
                        <p
                          className={`badge bg-[#E2000029] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#E2000099]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : targetOrder?.status === "returned" ? (
                        <p
                          className={`badge bg-[#ECFDF3] text-[#F0CC4E] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#F0CC4E99]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : targetOrder?.status === "delivered" ? (
                        <p
                          className={`badge bg-#ECFDF3] text-[#037847] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#14BA6D]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : targetOrder?.status === "ready_to_ship" ? (
                        <p
                          className={`badge bg-[#7F9B8D29] text-[#7F9B8D] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#7F9B8D]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      ) : (
                        <p
                          className={`badge bg-#ECFDF3] text-[#037847] my-3 py-3 px-3 text-left xl:text-lg `}
                        >
                          <GoDotFill className={`mr-1 text-[#14BA6D]`} />{" "}
                          {targetOrder?.status}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Payment Status:</span>
                      <span className="badge bg-[#32936F29] text-[#32936F] p-4">
                        {targetOrder?.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div className="shadow-xl mt-7 p-5 rounded-xl min-w-[600px]">
                    <h2 className="text-xl font-bold mb-6">Customer Info::</h2>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Name</span>
                      <span>{targetOrder?.user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Email:</span>
                      <span>{targetOrder?.user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Phone Num:</span>
                      <span>{targetOrder?.user?.phone}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-2">
                      <span className="text-lg font-bold">Address</span>
                      <span className="">
                        {targetOrder?.user?.addresses[0]?.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>SKU</th>
                      <th>Product Name</th>
                      <th>Vendor</th>
                      <th>Brand</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {targetOrder?.orderDetails?.map((order, idx) => (
                      <tr key={idx}>
                        <td>{order.product_information.id}</td>
                        <td>{order.sku}</td>
                        <td className=" flex gap-2 items-center text-sm">
                          <img
                            src={order?.product_information?.thumbnail}
                            className="w-10 h-10 object-cover rounded-sm"
                          />
                          <span>{order.product_information.name}</span>
                        </td>
                        <td>vendor</td>
                        <td>{order?.product_information?.brand.name}</td>
                        <td>{order?.quantity}</td>
                        <td>{order?.price}</td>
                        <td>{order?.product_information.discount}</td>
                        <td>
                          {order?.quantity} * {order?.price}{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="grid grid-cols-2 gap-20  border p-10 rounded-lg shadow-xl mt-8">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4 ">
                      <span className="font-bold text-lg mb-2">Shipping</span>
                      <span>{targetOrder.shipping}</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg mb-2">Sub total Price</h1>
                    <span>{targetOrder.totalsub}</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg mb-2">Total Price</h1>
                    <span>{targetOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4">
              <div className="skeleton h-80 w-full"></div>
              <div className="skeleton h-8 w-28"></div>
              <div className="skeleton h-8 w-full"></div>
              <div className="skeleton h-8 w-full"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrdersDetails;
