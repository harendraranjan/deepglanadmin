// "use client";
// import { useEffect, useState } from "react";
// import { getReturnOrders, updateOrderStatus } from "@/services/orderService";

// export default function ReturnOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     setLoading(true);
//     const res = await getReturnOrders();
//     if (res.ok) setOrders(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleReturnDecision = async (id, decision) => {
//     const newStatus = decision === "approve" ? "return-approved" : "return-rejected";
//     const res = await updateOrderStatus(id, { status: newStatus });
//     if (res.ok) {
//       alert(`Return ${decision}d successfully`);
//       fetchOrders();
//     } else {
//       alert(res.error || "Error updating return status");
//     }
//   };

//   if (loading) return <p className="p-6">Loading return orders...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Return Orders</h1>
//       {orders.length === 0 ? (
//         <p>No return requests found.</p>
//       ) : (
//         <table className="w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Order ID</th>
//               <th className="p-2">Buyer</th>
//               <th className="p-2">Seller</th>
//               <th className="p-2">Reason</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o._id} className="border-t">
//                 <td className="p-2">{o._id}</td>
//                 <td className="p-2">{o.buyer?.shopName || "N/A"}</td>
//                 <td className="p-2">{o.seller?.brandName || "N/A"}</td>
//                 <td className="p-2">{o.returnReason || "N/A"}</td>
//                 <td className="p-2 capitalize">{o.status}</td>
//                 <td className="p-2 space-x-2">
//                   {o.status === "return-requested" && (
//                     <>
//                       <button
//                         onClick={() => handleReturnDecision(o._id, "approve")}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => handleReturnDecision(o._id, "reject")}
//                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
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
      else if (data.items) setOrders(data.items);
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

  // Deliver Order
  const deliverOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/deliver`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      alert("Order delivered successfully!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Return Order
  const returnOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/return`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      alert("Order returned successfully!");
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
  if (orders.length === 0) return <p className="text-center">No orders found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4"> ↩️ Return Order</h1>
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

            {/* Buttons */}
            <div className="mt-3 flex gap-2">
              {order.status !== "delivered" &&
                order.status !== "cancelled" &&
                order.status !== "returned" && (
                  <button
                    className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => deliverOrder(order._id)}
                  >
                    Deliver Order
                  </button>
                )}

              {order.status !== "cancelled" &&
                order.status !== "returned" && (
                  <button
                    className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => returnOrder(order._id)}
                  >
                    Return Order
                  </button>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
