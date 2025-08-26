"use client";
import { useEffect, useState } from "react";
import { getReturnOrders, updateOrderStatus } from "@/services/orderService";

export default function ReturnOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getReturnOrders();
    if (res.ok) setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReturnDecision = async (id, decision) => {
    const newStatus = decision === "approve" ? "return-approved" : "return-rejected";
    const res = await updateOrderStatus(id, { status: newStatus });
    if (res.ok) {
      alert(`Return ${decision}d successfully`);
      fetchOrders();
    } else {
      alert(res.error || "Error updating return status");
    }
  };

  if (loading) return <p className="p-6">Loading return orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Return Orders</h1>
      {orders.length === 0 ? (
        <p>No return requests found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{o._id}</td>
                <td className="p-2">{o.buyer?.shopName || "N/A"}</td>
                <td className="p-2">{o.seller?.brandName || "N/A"}</td>
                <td className="p-2">{o.returnReason || "N/A"}</td>
                <td className="p-2 capitalize">{o.status}</td>
                <td className="p-2 space-x-2">
                  {o.status === "return-requested" && (
                    <>
                      <button
                        onClick={() => handleReturnDecision(o._id, "approve")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReturnDecision(o._id, "reject")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
