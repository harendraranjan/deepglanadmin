// export default function Hello() {
//   return (
//     <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
//       <h1>Hello Next.js1234 👋</h1>
//     </main>
//   );
// }



export default async function OrdersPage() {
  // ✅ Fetch orders from API
  const res = await fetch("http://localhost:5000/api/orders", {
    cache: "no-store",
  });
  const data = await res.json();
  const orders = data.items || [];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    const s = status?.toLowerCase();
    if (s === "confirmed")
      return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
    if (s === "unpaid")
      return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
    if (s === "paid")
      return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
    return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

      {orders.length === 0 ? (
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
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border border-black hover:bg-gray-700 transition-colors"
                >
                  <td className="p-3 border border-black font-medium">
                    {order._id.slice(-6)}
                  </td>
                  <td className="p-3 border border-black">{order.buyerId?.name}</td>
                  <td className="p-3 border border-black">
                    {order.buyerId?.email} / {order.buyerId?.phone}
                  </td>
                  <td className="p-3 border border-black">
                    {order.city}, {order.state}
                  </td>
                  <td className="p-3 border border-black">
                    <ul className="list-disc list-inside">
                      {order.products?.map((p, idx) => (
                        <li key={idx}>
                          {p.product?.productname || "Unknown"} × {p.quantity} = ₹
                          {p.total}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 border border-black font-semibold text-blue-400">
                    ₹{order.finalAmount}
                  </td>
                  <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
                  <td className="p-3 border border-black">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
