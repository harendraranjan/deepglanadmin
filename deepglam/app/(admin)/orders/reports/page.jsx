"use client";
import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/orderService";

export default function OrderReportsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    returns: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders();
    if (res.ok) {
      setOrders(res.data);
      setStats({
        total: res.data.length,
        delivered: res.data.filter((o) => o.status === "delivered").length,
        pending: res.data.filter((o) => o.status === "confirmed" || o.status === "dispatched").length,
        returns: res.data.filter((o) => o.status.includes("return")).length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Generating report...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Reports</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold">{stats.total}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Delivered</p>
          <h2 className="text-xl font-bold text-green-600">{stats.delivered}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-xl font-bold text-yellow-600">{stats.pending}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Return Orders</p>
          <h2 className="text-xl font-bold text-red-600">{stats.returns}</h2>
        </div>
      </div>

      {/* Detailed Table */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">Buyer</th>
            <th className="p-2">Seller</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-2">{o._id}</td>
              <td className="p-2">{o.buyer?.shopName || "N/A"}</td>
              <td className="p-2">{o.seller?.brandName || "N/A"}</td>
              <td className="p-2">₹{o.finalAmount}</td>
              <td className="p-2 capitalize">{o.status}</td>
              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
