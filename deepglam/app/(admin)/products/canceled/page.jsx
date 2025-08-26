"use client";
import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/orderService";

export default function CancelOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders({ status: "canceled" });
    if (res.ok) setOrders(res.data.items || res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading canceled orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Canceled Orders</h1>

      {orders.length === 0 ? (
        <p>No canceled orders found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{o._id}</td>
                <td className="p-2">{o.buyer?.shopName || o.buyer?.email}</td>
                <td className="p-2">{o.seller?.brandName || "-"}</td>
                <td className="p-2">₹{o.finalAmount}</td>
                <td className="p-2">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-red-600 font-medium capitalize">
                  {o.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
