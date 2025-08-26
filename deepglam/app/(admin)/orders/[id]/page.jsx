"use client";
// app/orders/[id]/page.jsx
import api from "@/services/api";

export default async function OrderDetailPage({ params }) {
  const { id } = params;

  let order = null;
  let error = null;

  try {
    // fetch order details from backend
    const res = await api.get(`/orders/${id}`);
    order = res.data;
  } catch (e) {
    error = e?.response?.data?.message || e.message || "Failed to load order";
  }

  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }

  if (!order) {
    return <p className="p-6">Order not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>

      {/* Buyer / Shipping Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Buyer</h2>
        <p>{order.buyer?.name}</p>
        <p>{order.fullAddress}</p>
        <p>
          {order.city}, {order.state} {order.pincode}
        </p>
      </div>

      {/* Products */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Products</h2>
        <ul className="divide-y divide-gray-200">
          {order.products?.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span>
                {item.product?.productname || "Unnamed Product"} × {item.quantity}
              </span>
              <span className="font-semibold">₹{item.total}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Totals */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Summary</h2>
        <p>Subtotal: ₹{order.subtotal}</p>
        <p>GST: ₹{order.gstAmount}</p>
        <p className="font-bold">Final Amount: ₹{order.finalAmount}</p>
      </div>
    </div>
  );
}
