
"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://deepglam.onrender.com/api/orders");
      const data = await res.json();
      if (data && Array.isArray(data)) setOrders(data);
      else if (data.items) setOrders(data.items); // agar pagination wala format aaya
      else setOrders([]);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel Order
  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      alert("Order cancelled successfully!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const statusColors = {
    placed: "bg-gray-500",
    packed: "bg-yellow-500",
    confirmed: "bg-indigo-500",
    "ready-to-dispatch": "bg-blue-500",
    dispatched: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    returned: "bg-orange-500",
  };

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center">No cancel orders found</p>;

  return (
    <div className="p-6">
      {/* Heading Changed */}
      <h1 className="text-xl font-bold mb-4">❌ Cancel Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border rounded-lg p-4 shadow">
            <h2 className="font-semibold text-lg">
              Buyer: {order.buyerId?.name} ({order.buyerId?.phone})
            </h2>
            <p>Address: {order.fullAddress}</p>
            <p className="mt-1">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-white font-medium ${
                  statusColors[order.status] || "bg-gray-400"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p>Total Amount: ₹{order.finalAmount}</p>

            <h3 className="mt-2 font-semibold">Products:</h3>
            <ul className="list-disc pl-6">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  {p.product?.productname || "Unknown"} (x{p.quantity}) - ₹
                  {p.total}
                </li>
              ))}
            </ul>

            {/* Cancel Button Only */}
            <div className="mt-3 flex gap-2">
              {order.status !== "delivered" &&
                order.status !== "cancelled" &&
                order.status !== "returned" && (
                  <button
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
