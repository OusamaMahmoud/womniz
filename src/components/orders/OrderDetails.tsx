import useTargetOrder from "../../hooks/useTargetOrder";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import { toast, ToastContainer } from "react-toastify";

const OrdersDetails = () => {
  const { id } = useParams();

  const { targetOrder, error, isLoading } = useTargetOrder({
    orderId: id || "",
  });

  // const subtotal = targetOrder?.orderDetails?.reduce(
  //   (accumulator, currentValue) => {
  //     return accumulator + currentValue.price_after_sale;
  //   },
  //   0
  // );

  const [selectStatus, setSelectStatus] = useState(targetOrder?.status);
  const [changeStatusError, setChangeStatusError] = useState("");
  const [, setLoading] = useState(false);

  useEffect(() => {
    setSelectStatus(targetOrder?.status);
    console.log(targetOrder);
  }, [targetOrder]);

  useEffect(() => {
    const changeStatus = async () => {
      if (selectStatus && targetOrder && targetOrder.id) {
        try {
          setChangeStatusError("");
          setLoading(true);
          await apiClient.get(
            `/orders/changeStatus/${targetOrder.id}/${selectStatus}`
          );
          toast.success("Status has been changed successfully.");
        } catch (error: any) {
          setChangeStatusError(error.message);
          setSelectStatus(targetOrder?.status);
          toast.error(
            "Oops! You can't change status for that order. Something went wrong!"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectStatus && targetOrder?.status !== selectStatus) {
      changeStatus();
    }
  }, [selectStatus, targetOrder]);

  return (
    <>
      <ToastContainer />
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
      ) : error.includes("500") ? (
        <p className="my-4 text-lg text-red-500 tracking-wider">
          "Oops!! Something Went Wrong."
        </p>
      ) : (
        <p className="my-4 text-lg text-red-500 tracking-wider">{error}</p>
      )}
      {changeStatusError && <p>{changeStatusError}</p>}
      {!error && (
        <div className="container mx-auto px-10">
          {!isLoading ? (
            <div>
              <div className=" my-10">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <div className="block xl:flex justify-around ">
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
                      <select
                        className={`select select-bordered
                           ${
                             targetOrder?.status === "pending"
                               ? "bg-[#ECFDF3] text-[#14BA6D]"
                               : targetOrder?.status === "canceled"
                               ? "bg-[#E2000029] text-[#E2000099]"
                               : targetOrder?.status === "delivery_failed"
                               ? "bg-[#E2000029] text-[#29210499]"
                               : targetOrder?.status === "returned"
                               ? "bg-[#ECFDF3] text-[#14BA6D]"
                               : targetOrder?.status === "delivered"
                               ? "bg-[#ECFDF3] text-[#7F9B8D]"
                               : targetOrder?.status === "ready_to_ship"
                               ? "bg-[#7F9B8D29]"
                               : "bg-[#ECFDF3] text-[#037847]"
                           }`}
                        onChange={(e) => {
                          setSelectStatus(e.currentTarget.value);
                        }}
                        value={selectStatus}
                      >
                        <option value={`pending`}>pending</option>
                        <option value={`returned`}>returned</option>
                        <option value={`delivered`}>delivered</option>
                        <option value={`delivery_failed`}>
                          delivery_failed
                        </option>
                        <option value={`shipped`}>shipped</option>
                        <option value={`canceled`}>canceled</option>
                        <option value={`ready_to_ship`}>ready_to_ship</option>
                      </select>
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
                    <div className="flex justify-between items-center  mt-4">
                      <p className="text-lg font-bold">Address:</p>
                      {targetOrder?.address && (
                        <div className="flex flex-wrap gap-1  rounded-lg  xl:max-w-[250px]">
                          <span>{targetOrder?.address?.label}</span>,
                          <span>{targetOrder?.address?.map_address}</span>,
                          <span>
                            apartment_floor: {targetOrder?.address?.apt_floor}
                          </span>
                          ,<span>{targetOrder?.address?.street_address}</span>,
                          <span>{targetOrder?.address?.lat}</span>,
                          <span>{targetOrder?.address?.long}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="overflow-x-auto">
                  <table className="table w-full ">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>SKU</th>
                        <th>Product Name</th>
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
                          <td>{order?.product_information?.id}</td>
                          <td>{order?.product_information?.seller_sku}</td>
                          <td className=" flex gap-2 items-center text-sm">
                            <img
                              src={order?.product_information?.thumbnail}
                              className="w-10 h-10 object-cover rounded-sm"
                            />
                            <span>{order?.product_information?.name_en}</span>
                          </td>

                          <td>{order?.product_information?.brand?.name_en}</td>
                          <td>{order?.quantity}</td>
                          <td>{order?.product_information?.price}</td>
                          <td>{order?.product_information?.discount}</td>
                          <td>
                            {order?.product_information?.price_after_sale}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-20  border p-10 rounded-lg shadow-xl mt-8">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4 ">
                      <span className="font-bold text-lg mb-2">Shipping</span>
                      <span>{targetOrder?.shipping}</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg mb-2">Sub total Price</h1>
                    {targetOrder.totalsub}
                  </div>
                  <div>
                    <h1 className="font-bold text-lg mb-2">Total Price</h1>
                    {targetOrder.total}
                  </div>
                </div>
              </div>{" "}
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
