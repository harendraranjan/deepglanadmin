//OrdersPage.jsx
"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  // Orders fetch karna
  const fetchOrders = async () => {
    const res = await fetch("https://deepglam.onrender.com/api/orders");
    const data = await res.json();
    if (data.ok) setOrders(data.items);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Pack status update karna
  const markAsPacked = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/pack`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Failed with ${res.status}`);

      await fetchOrders(); // refresh list
      alert("Order packed successfully ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 mb-3 border rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>

          {/* ✅ Pack Button */}
          <button
            onClick={() => markAsPacked(order._id)}
            className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Mark as Packed
          </button>
        </div>
      ))}
    </div>
  );
}


