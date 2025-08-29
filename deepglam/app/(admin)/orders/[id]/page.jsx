"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://deepglam.onrender.com/api/orders", {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(data.items || []);
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

  // Status badge
  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    const s = status?.toLowerCase();
    if (s === "confirmed") return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
    if (s === "unpaid") return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
    if (s === "paid") return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
    if (s === "delivered") return <span className={`${base} bg-green-200 text-green-900`}>Delivered</span>;
    if (s === "cancelled") return <span className={`${base} bg-gray-400 text-black`}>Cancelled</span>;
    return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
  };

  // Filter + Sort
  const filteredOrders = orders
    .filter((order) => {
      if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
      if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
      if (filter === "recent" && selectedDate) {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return orderDate === selectedDate;
      }
      return true;
    })
    .sort((a, b) => {
      if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filter === "highvalue") return b.finalAmount - a.finalAmount;
      return 0;
    });

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelectedDate(""); }}
            className={`px-4 py-2 rounded-md ${filter === f ? "bg-orange-500" : "bg-gray-700"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Date Picker */}
      {filter === "recent" && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white-300">Search by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-md bg-white border border-white text-black"
          />
        </div>
      )}

      {loading ? (
        <p className="text-orange-400">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-orange-400 font-medium">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black">
          <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
            <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
              <tr>
                <th className="p-3 border border-black">Order ID</th>
                <th className="p-3 border border-black">Buyer</th>
                <th className="p-3 border border-black">Email / Phone</th>
                <th className="p-3 border border-black">City / State</th>
                <th className="p-3 border border-black">Products</th>
                <th className="p-3 border border-black">Total Amount</th>
                <th className="p-3 border border-black">Status</th>
                <th className="p-3 border border-black">Created At</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border border-black hover:bg-gray-700 transition-colors">
                  <td className="p-3 border border-black font-medium">{order._id.slice(-6)}</td>
                  <td className="p-3 border border-black">{order.buyerId?.name}</td>
                  <td className="p-3 border border-black">{order.buyerId?.email} / {order.buyerId?.phone}</td>
                  <td className="p-3 border border-black">{order.city}, {order.state}</td>
                  <td className="p-3 border border-black">
                    <ul className="list-disc list-inside">
                      {order.products?.map((p, idx) => (
                        <li key={idx}>{p.product?.productname || "Unknown"} × {p.quantity} = ₹{p.total}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 border border-black font-semibold text-blue-400">₹{order.finalAmount}</td>
                  <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
                  <td className="p-3 border border-black">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
