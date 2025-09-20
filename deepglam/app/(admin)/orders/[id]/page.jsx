// // // "use client";

// // // import { useEffect, useState } from "react";

// // // export default function OrdersPage() {
// // //   const [orders, setOrders] = useState([]);
// // //   const [filter, setFilter] = useState("all");
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedDate, setSelectedDate] = useState("");

// // //   // Fetch orders
// // //   const fetchOrders = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await fetch("https://deepglam.onrender.com/api/orders", {
// // //         cache: "no-store",
// // //       });
// // //       const data = await res.json();
// // //       setOrders(data.items || []);
// // //     } catch (err) {
// // //       console.error(err);
// // //       setOrders([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Status badge
// // //   const getStatusBadge = (status) => {
// // //     const base = "px-3 py-1 rounded-full text-xs font-bold";
// // //     const s = status?.toLowerCase();
// // //     if (s === "confirmed") return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
// // //     if (s === "unpaid") return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
// // //     if (s === "paid") return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
// // //     if (s === "delivered") return <span className={`${base} bg-green-200 text-green-900`}>Delivered</span>;
// // //     if (s === "cancelled") return <span className={`${base} bg-gray-400 text-black`}>Cancelled</span>;
// // //     return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
// // //   };

// // //   // Filter + Sort
// // //   const filteredOrders = orders
// // //     .filter((order) => {
// // //       if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
// // //       if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
// // //       if (filter === "recent" && selectedDate) {
// // //         const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
// // //         return orderDate === selectedDate;
// // //       }
// // //       return true;
// // //     })
// // //     .sort((a, b) => {
// // //       if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
// // //       if (filter === "highvalue") return b.finalAmount - a.finalAmount;
// // //       return 0;
// // //     });

// // //   return (
// // //     <div className="bg-gray-900 min-h-screen p-6 text-white">
// // //       <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

// // //       {/* Filter Buttons */}
// // //       <div className="flex gap-3 mb-6">
// // //         {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
// // //           <button
// // //             key={f}
// // //             onClick={() => { setFilter(f); setSelectedDate(""); }}
// // //             className={`px-4 py-2 rounded-md ${filter === f ? "bg-orange-500" : "bg-gray-700"}`}
// // //           >
// // //             {f.charAt(0).toUpperCase() + f.slice(1)}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Date Picker */}
// // //       {filter === "recent" && (
// // //         <div className="mb-6">
// // //           <label className="block text-sm font-medium mb-2 text-white-300">Search by Date:</label>
// // //           <input
// // //             type="date"
// // //             value={selectedDate}
// // //             onChange={(e) => setSelectedDate(e.target.value)}
// // //             className="px-3 py-2 rounded-md bg-white border border-white text-black"
// // //           />
// // //         </div>
// // //       )}

// // //       {loading ? (
// // //         <p className="text-orange-400">Loading orders...</p>
// // //       ) : filteredOrders.length === 0 ? (
// // //         <p className="text-orange-400 font-medium">No orders found.</p>
// // //       ) : (
// // //         <div className="overflow-x-auto rounded-md border border-black">
// // //           <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
// // //             <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
// // //               <tr>
// // //                 <th className="p-3 border border-black">Order ID</th>
// // //                 <th className="p-3 border border-black">Buyer</th>
// // //                 <th className="p-3 border border-black">Email / Phone</th>
// // //                 <th className="p-3 border border-black">City / State</th>
// // //                 <th className="p-3 border border-black">Products</th>
// // //                 <th className="p-3 border border-black">Total Amount</th>
// // //                 <th className="p-3 border border-black">Status</th>
// // //                 <th className="p-3 border border-black">Created At</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="text-gray-200">
// // //               {filteredOrders.map((order) => (
// // //                 <tr key={order._id} className="border border-black hover:bg-gray-700 transition-colors">
// // //                   <td className="p-3 border border-black font-medium">{order._id.slice(-6)}</td>
// // //                   <td className="p-3 border border-black">{order.buyerId?.name}</td>
// // //                   <td className="p-3 border border-black">{order.buyerId?.email} / {order.buyerId?.phone}</td>
// // //                   <td className="p-3 border border-black">{order.city}, {order.state}</td>
// // //                   <td className="p-3 border border-black">
// // //                     <ul className="list-disc list-inside">
// // //                       {order.products?.map((p, idx) => (
// // //                         <li key={idx}>{p.product?.productname || "Unknown"} × {p.quantity} = ₹{p.total}</li>
// // //                       ))}
// // //                     </ul>
// // //                   </td>
// // //                   <td className="p-3 border border-black font-semibold text-blue-400">₹{order.finalAmount}</td>
// // //                   <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
// // //                   <td className="p-3 border border-black">{new Date(order.createdAt).toLocaleString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import axios from "axios";

// // // const API_URL = "http://localhost:5000/api/orders";

// // // export default function OrdersPage() {
// // //   const [orders, setOrders] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedOrder, setSelectedOrder] = useState(null);
// // //   const [search, setSearch] = useState("");
// // //   const [filter, setFilter] = useState("all");
// // //   const [selectedDate, setSelectedDate] = useState("");

// // //   const getAuthHeaders = () => {
// // //     const token =
// // //       typeof window !== "undefined"
// // //         ? localStorage.getItem("token") || localStorage.getItem("accessToken")
// // //         : null;
// // //     return token
// // //       ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
// // //       : {};
// // //   };

// // //   const fetchOrders = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const res = await axios.get(API_URL, { headers: getAuthHeaders() });

// // //       const mappedOrders = (res.data.data || []).map((o) => ({
// // //         ...o,
// // //         buyerName: o.buyerUserId?.name,
// // //         buyerEmail: o.buyerUserId?.email,
// // //         buyerPhone: o.buyerUserId?.phone,
// // //         finalAmount: (o.finalAmountPaise || 0) / 100,
// // //         city: o.deliveryAddress?.city,
// // //         state: o.deliveryAddress?.state,
// // //         products: (o.products || []).map((p) => ({
// // //           ...p,
// // //           total: (p.totalPaise || 0) / 100,
// // //         })),
// // //       }));

// // //       setOrders(mappedOrders);
// // //     } catch (err) {
// // //       console.error("Fetch orders error:", err);
// // //       setOrders([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchOrders();
// // //   }, []);

// // //   const getStatusBadge = (status) => {
// // //     const base = "px-3 py-1 rounded-full text-xs font-bold";
// // //     const s = status?.toLowerCase();
// // //     if (s === "confirmed") return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
// // //     if (s === "unpaid") return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
// // //     if (s === "paid") return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
// // //     if (s === "delivered") return <span className={`${base} bg-green-200 text-green-900`}>Delivered</span>;
// // //     if (s === "cancelled") return <span className={`${base} bg-gray-400 text-black`}>Cancelled</span>;
// // //     return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
// // //   };

// // //   const filteredOrders = orders
// // //     .filter((order) => {
// // //       if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
// // //       if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
// // //       if (filter === "recent" && selectedDate) {
// // //         const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
// // //         return orderDate === selectedDate;
// // //       }
// // //       return (
// // //         order.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
// // //         order.orderNumber?.toLowerCase().includes(search.toLowerCase())
// // //       );
// // //     })
// // //     .sort((a, b) => {
// // //       if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
// // //       if (filter === "highvalue") return b.finalAmount - a.finalAmount;
// // //       return 0;
// // //     });

// // //   return (
// // //     <div className="bg-gray-900 min-h-screen p-6 text-white">
// // //       <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

// // //       {/* Filter Buttons */}
// // //       <div className="flex gap-3 mb-6">
// // //         {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
// // //           <button
// // //             key={f}
// // //             onClick={() => { setFilter(f); setSelectedDate(""); }}
// // //             className={`px-4 py-2 rounded-md ${filter === f ? "bg-orange-500" : "bg-gray-700"}`}
// // //           >
// // //             {f.charAt(0).toUpperCase() + f.slice(1)}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Date Picker */}
// // //       {filter === "recent" && (
// // //         <div className="mb-6">
// // //           <label className="block text-sm font-medium mb-2 text-white-300">Search by Date:</label>
// // //           <input
// // //             type="date"
// // //             value={selectedDate}
// // //             onChange={(e) => setSelectedDate(e.target.value)}
// // //             className="px-3 py-2 rounded-md bg-white border border-white text-black"
// // //           />
// // //         </div>
// // //       )}

// // //       {/* Search Bar */}
// // //       <input
// // //         type="text"
// // //         placeholder="Search by buyer or order..."
// // //         value={search}
// // //         onChange={(e) => setSearch(e.target.value)}
// // //         className="p-2 border rounded bg-white mb-4"
// // //       />

// // //       {loading ? (
// // //         <p className="text-orange-400">Loading orders...</p>
// // //       ) : filteredOrders.length === 0 ? (
// // //         <p className="text-orange-400 font-medium">No orders found.</p>
// // //       ) : (
// // //         <div className="overflow-x-auto rounded-md border border-black">
// // //           <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
// // //             <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
// // //               <tr>
// // //                 <th className="p-3 border border-black">Order ID</th>
// // //                 <th className="p-3 border border-black">Buyer</th>
// // //                 <th className="p-3 border border-black">Email / Phone</th>
// // //                 <th className="p-3 border border-black">City / State</th>
// // //                 <th className="p-3 border border-black">Products</th>
// // //                 <th className="p-3 border border-black">Total Amount</th>
// // //                 <th className="p-3 border border-black">Status</th>
// // //                 <th className="p-3 border border-black">Created At</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="text-gray-200">
// // //               {filteredOrders.map((order) => (
// // //                 <tr key={order._id} className="border border-black hover:bg-gray-700 transition-colors">
// // //                   <td className="p-3 border border-black font-medium">{order.orderNumber}</td>
// // //                   <td className="p-3 border border-black">{order.buyerName}</td>
// // //                   <td className="p-3 border border-black">{order.buyerEmail} / {order.buyerPhone}</td>
// // //                   <td className="p-3 border border-black">{order.city}, {order.state}</td>
// // //                   <td className="p-3 border border-black">
// // //                     <ul className="list-disc list-inside">
// // //                       {order.products?.map((p, idx) => (
// // //                         <li key={idx}>{p.product?.productName || "Unknown"} × {p.quantity} = ₹{p.total}</li>
// // //                       ))}
// // //                     </ul>
// // //                   </td>
// // //                   <td className="p-3 border border-black font-semibold text-blue-400">₹{order.finalAmount}</td>
// // //                   <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
// // //                   <td className="p-3 border border-black">{new Date(order.createdAt).toLocaleString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect } from "react";
// // import axios from "axios";

// // const API_URL = "http://localhost:5000/api/orders";

// // export default function OrdersPage() {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedOrders, setSelectedOrders] = useState([]); // ✅ for bulk selection
// //   const [search, setSearch] = useState("");
// //   const [filter, setFilter] = useState("all");
// //   const [selectedDate, setSelectedDate] = useState("");
// //   const [bulkStatus, setBulkStatus] = useState(""); // ✅ new status for bulk update

// //   const getAuthHeaders = () => {
// //     const token =
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("token") || localStorage.getItem("accessToken")
// //         : null;
// //     return token
// //       ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
// //       : {};
// //   };

// //   // ✅ Fetch all orders (GET /api/orders)
// //   const fetchOrders = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get(API_URL, { headers: getAuthHeaders() });

// //       const mappedOrders = (res.data.data || []).map((o) => ({
// //         ...o,
// //         buyerName: o.buyerUserId?.name,
// //         buyerEmail: o.buyerUserId?.email,
// //         buyerPhone: o.buyerUserId?.phone,
// //         finalAmount: (o.finalAmountPaise || 0) / 100,
// //         city: o.deliveryAddress?.city,
// //         state: o.deliveryAddress?.state,
// //         products: (o.products || []).map((p) => ({
// //           ...p,
// //           total: (p.totalPaise || 0) / 100,
// //         })),
// //       }));

// //       setOrders(mappedOrders);
// //     } catch (err) {
// //       console.error("Fetch orders error:", err);
// //       setOrders([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrders();
// //   }, []);

// //   // ✅ Bulk Update (PUT /api/orders/bulk)
// //   const handleBulkUpdate = async () => {
// //     if (selectedOrders.length === 0) {
// //       alert("Please select at least one order.");
// //       return;
// //     }
// //     if (!bulkStatus) {
// //       alert("Please select a status to update.");
// //       return;
// //     }

// //     try {
// //       const res = await axios.put(
// //         `${API_URL}/bulk`,
// //         {
// //           orderIds: selectedOrders,
// //           status: bulkStatus,
// //         },
// //         { headers: getAuthHeaders() }
// //       );

// //       alert(res.data.message || "Orders updated successfully!");
// //       setSelectedOrders([]);
// //       setBulkStatus("");
// //       fetchOrders();
// //     } catch (err) {
// //       console.error("Bulk update error:", err);
// //       alert("Failed to bulk update orders");
// //     }
// //   };

// //   const getStatusBadge = (status) => {
// //     const base = "px-3 py-1 rounded-full text-xs font-bold";
// //     const s = status?.toLowerCase();
// //     if (s === "confirmed") return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
// //     if (s === "unpaid") return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
// //     if (s === "paid") return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
// //     if (s === "delivered") return <span className={`${base} bg-green-200 text-green-900`}>Delivered</span>;
// //     if (s === "cancelled") return <span className={`${base} bg-gray-400 text-black`}>Cancelled</span>;
// //     return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
// //   };

// //   const filteredOrders = orders
// //     .filter((order) => {
// //       if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
// //       if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
// //       if (filter === "recent" && selectedDate) {
// //         const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
// //         return orderDate === selectedDate;
// //       }
// //       return (
// //         order.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
// //         order.orderNumber?.toLowerCase().includes(search.toLowerCase())
// //       );
// //     })
// //     .sort((a, b) => {
// //       if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
// //       if (filter === "highvalue") return b.finalAmount - a.finalAmount;
// //       return 0;
// //     });

// //   return (
// //     <div className="bg-gray-900 min-h-screen p-6 text-white">
// //       <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

// //       {/* Bulk Update Controls */}
// //       <div className="flex items-center gap-3 mb-6">
// //         <select
// //           value={bulkStatus}
// //           onChange={(e) => setBulkStatus(e.target.value)}
// //           className="px-3 py-2 rounded-md bg-gray-700 border border-gray-500 text-white"
// //         >
// //           <option value="">-- Select Status --</option>
// //           <option value="confirmed">Confirmed</option>
// //           <option value="paid">Paid</option>
// //           <option value="delivered">Delivered</option>
// //           <option value="cancelled">Cancelled</option>
// //         </select>
// //         <button
// //           onClick={handleBulkUpdate}
// //           className="px-4 py-2 rounded-md bg-orange-500 text-white font-bold hover:bg-orange-600"
// //         >
// //           Bulk Update
// //         </button>
// //       </div>

// //       {/* Filter Buttons */}
// //       <div className="flex gap-3 mb-6">
// //         {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
// //           <button
// //             key={f}
// //             onClick={() => { setFilter(f); setSelectedDate(""); }}
// //             className={`px-4 py-2 rounded-md ${filter === f ? "bg-orange-500" : "bg-gray-700"}`}
// //           >
// //             {f.charAt(0).toUpperCase() + f.slice(1)}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Date Picker */}
// //       {filter === "recent" && (
// //         <div className="mb-6">
// //           <label className="block text-sm font-medium mb-2 text-white-300">Search by Date:</label>
// //           <input
// //             type="date"
// //             value={selectedDate}
// //             onChange={(e) => setSelectedDate(e.target.value)}
// //             className="px-3 py-2 rounded-md bg-white border border-white text-black"
// //           />
// //         </div>
// //       )}

// //       {/* Search Bar */}
// //       <input
// //         type="text"
// //         placeholder="Search by buyer or order..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //         className="p-2 border rounded bg-white mb-4 text-black"
// //       />

// //       {loading ? (
// //         <p className="text-orange-400">Loading orders...</p>
// //       ) : filteredOrders.length === 0 ? (
// //         <p className="text-orange-400 font-medium">No orders found.</p>
// //       ) : (
// //         <div className="overflow-x-auto rounded-md border border-black">
// //           <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
// //             <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
// //               <tr>
// //                 <th className="p-3 border border-black">✅</th>
// //                 <th className="p-3 border border-black">Order ID</th>
// //                 <th className="p-3 border border-black">Buyer</th>
// //                 <th className="p-3 border border-black">Email / Phone</th>
// //                 <th className="p-3 border border-black">City / State</th>
// //                 <th className="p-3 border border-black">Products</th>
// //                 <th className="p-3 border border-black">Total Amount</th>
// //                 <th className="p-3 border border-black">Status</th>
// //                 <th className="p-3 border border-black">Created At</th>
// //               </tr>
// //             </thead>
// //             <tbody className="text-gray-200">
// //               {filteredOrders.map((order) => (
// //                 <tr key={order._id} className="border border-black hover:bg-gray-700 transition-colors">
// //                   <td className="p-3 border border-black text-center">
// //                     <input
// //                       type="checkbox"
// //                       checked={selectedOrders.includes(order._id)}
// //                       onChange={(e) => {
// //                         if (e.target.checked) {
// //                           setSelectedOrders((prev) => [...prev, order._id]);
// //                         } else {
// //                           setSelectedOrders((prev) => prev.filter((id) => id !== order._id));
// //                         }
// //                       }}
// //                     />
// //                   </td>
// //                   <td className="p-3 border border-black font-medium">{order.orderNumber}</td>
// //                   <td className="p-3 border border-black">{order.buyerName}</td>
// //                   <td className="p-3 border border-black">{order.buyerEmail} / {order.buyerPhone}</td>
// //                   <td className="p-3 border border-black">{order.city}, {order.state}</td>
// //                   <td className="p-3 border border-black">
// //                     <ul className="list-disc list-inside">
// //                       {order.products?.map((p, idx) => (
// //                         <li key={idx}>{p.product?.productName || "Unknown"} × {p.quantity} = ₹{p.total}</li>
// //                       ))}
// //                     </ul>
// //                   </td>
// //                   <td className="p-3 border border-black font-semibold text-blue-400">₹{order.finalAmount}</td>
// //                   <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
// //                   <td className="p-3 border border-black">{new Date(order.createdAt).toLocaleString()}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/orders";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [bulkStatus, setBulkStatus] = useState("");
//   const [message, setMessage] = useState("");

//   // 🔑 Auth headers with token from localStorage
//   const getAuthHeaders = () => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token") || localStorage.getItem("accessToken")
//         : null;
//     return token
//       ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//       : {};
//   };

//   // 📥 Fetch orders
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL, { headers: getAuthHeaders() });

//       const mappedOrders = (res.data.data || []).map((o) => ({
//         ...o,
//         buyerName: o.buyerUserId?.name,
//         buyerEmail: o.buyerUserId?.email,
//         buyerPhone: o.buyerUserId?.phone,
//         finalAmount: (o.finalAmountPaise || 0) / 100,
//         city: o.deliveryAddress?.city,
//         state: o.deliveryAddress?.state,
//         products: (o.products || []).map((p) => ({
//           ...p,
//           total: (p.totalPaise || 0) / 100,
//         })),
//       }));

//       setOrders(mappedOrders);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // 📌 Status badge
//   const getStatusBadge = (status) => {
//     const base = "px-3 py-1 rounded-full text-xs font-bold";
//     const s = status?.toLowerCase();
//     if (s === "confirmed") return <span className={`${base} bg-blue-100 text-blue-700`}>Confirmed</span>;
//     if (s === "unpaid") return <span className={`${base} bg-red-100 text-red-700`}>Unpaid</span>;
//     if (s === "paid") return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
//     if (s === "delivered") return <span className={`${base} bg-green-200 text-green-900`}>Delivered</span>;
//     if (s === "cancelled") return <span className={`${base} bg-gray-400 text-black`}>Cancelled</span>;
//     return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
//   };

//   // ✅ Bulk update handler
//   const handleBulkUpdate = async () => {
//     if (!bulkStatus || selectedOrders.length === 0) {
//       setMessage("⚠️ Select at least one order and a status");
//       return;
//     }
//     try {
//       const res = await axios.put(
//         `${API_URL}/bulk`,
//         { orderIds: selectedOrders, status: bulkStatus },
//         { headers: getAuthHeaders() }
//       );

//       setMessage(res.data.message || "✅ Orders updated successfully!");
//       setSelectedOrders([]);
//       setBulkStatus("");
//       fetchOrders();

//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error("Bulk update error:", err);
//       setMessage("❌ Failed to bulk update orders");
//     }
//   };

//   // 🔍 Filtering
//   const filteredOrders = orders
//     .filter((order) => {
//       if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
//       if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
//       if (filter === "recent" && selectedDate) {
//         const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
//         return orderDate === selectedDate;
//       }
//       return (
//         order.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
//         order.orderNumber?.toLowerCase().includes(search.toLowerCase())
//       );
//     })
//     .sort((a, b) => {
//       if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
//       if (filter === "highvalue") return b.finalAmount - a.finalAmount;
//       return 0;
//     });

//   return (
//     <div className="bg-gray-900 min-h-screen p-6 text-white">
//       <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

//       {/* ✅ Message Banner */}
//       {message && (
//         <div className="mb-4 p-3 rounded bg-green-600 text-white font-medium">
//           {message}
//         </div>
//       )}

//       {/* Filter Buttons */}
//       <div className="flex gap-3 mb-6">
//         {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
//           <button
//             key={f}
//             onClick={() => {
//               setFilter(f);
//               setSelectedDate("");
//             }}
//             className={`px-4 py-2 rounded-md ${
//               filter === f ? "bg-orange-500" : "bg-gray-700"
//             }`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Date Picker */}
//       {filter === "recent" && (
//         <div className="mb-6">
//           <label className="block text-sm font-medium mb-2 text-white-300">
//             Search by Date:
//           </label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="px-3 py-2 rounded-md bg-white border border-white text-black"
//           />
//         </div>
//       )}

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by buyer or order..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="p-2 border rounded bg-white mb-4 text-black"
//       />

//       {/* Bulk Update Controls */}
//       <div className="flex gap-3 mb-6 items-center">
//         <select
//           value={bulkStatus}
//           onChange={(e) => setBulkStatus(e.target.value)}
//           className="px-3 py-2 rounded bg-white text-black"
//         >
//           <option value="">-- Select Status --</option>
//           <option value="confirmed">Confirmed</option>
//           <option value="paid">Paid</option>
//           <option value="delivered">Delivered</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//         <button
//           onClick={handleBulkUpdate}
//           className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Update Selected Orders
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-orange-400">Loading orders...</p>
//       ) : filteredOrders.length === 0 ? (
//         <p className="text-orange-400 font-medium">No orders found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-md border border-black">
//           <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
//             <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
//               <tr>
//                 <th className="p-3 border border-black">
//                   <input
//                     type="checkbox"
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setSelectedOrders(filteredOrders.map((o) => o._id));
//                       } else {
//                         setSelectedOrders([]);
//                       }
//                     }}
//                   />
//                 </th>
//                 <th className="p-3 border border-black">Order ID</th>
//                 <th className="p-3 border border-black">Buyer</th>
//                 <th className="p-3 border border-black">Email / Phone</th>
//                 <th className="p-3 border border-black">City / State</th>
//                 <th className="p-3 border border-black">Products</th>
//                 <th className="p-3 border border-black">Total Amount</th>
//                 <th className="p-3 border border-black">Status</th>
//                 <th className="p-3 border border-black">Created At</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-200">
//               {filteredOrders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border border-black hover:bg-gray-700 transition-colors"
//                 >
//                   <td className="p-3 border border-black">
//                     <input
//                       type="checkbox"
//                       checked={selectedOrders.includes(order._id)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedOrders([...selectedOrders, order._id]);
//                         } else {
//                           setSelectedOrders(
//                             selectedOrders.filter((id) => id !== order._id)
//                           );
//                         }
//                       }}
//                     />
//                   </td>
//                   <td className="p-3 border border-black font-medium">
//                     {order.orderNumber}
//                   </td>
//                   <td className="p-3 border border-black">{order.buyerName}</td>
//                   <td className="p-3 border border-black">
//                     {order.buyerEmail} / {order.buyerPhone}
//                   </td>
//                   <td className="p-3 border border-black">
//                     {order.city}, {order.state}
//                   </td>
//                   <td className="p-3 border border-black">
//                     <ul className="list-disc list-inside">
//                       {order.products?.map((p, idx) => (
//                         <li key={idx}>
//                           {p.product?.productName || "Unknown"} × {p.quantity} = ₹
//                           {p.total}
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td className="p-3 border border-black font-semibold text-blue-400">
//                     ₹{order.finalAmount}
//                   </td>
//                   <td className="p-3 border border-black">
//                     {getStatusBadge(order.status)}
//                   </td>
//                   <td className="p-3 border border-black">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [message, setMessage] = useState("");

  // 🔑 Token headers
  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};
  };

  // 📥 Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });

      const mappedOrders = (res.data.data || []).map((o) => ({
        ...o,
        buyerName: o.buyerUserId?.name,
        buyerEmail: o.buyerUserId?.email,
        buyerPhone: o.buyerUserId?.phone,
        finalAmount: (o.finalAmountPaise || 0) / 100,
        city: o.deliveryAddress?.city,
        state: o.deliveryAddress?.state,
        products: (o.products || []).map((p) => ({
          ...p,
          total: (p.totalPaise || 0) / 100,
        })),
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 📌 Status badge
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

  // ✅ Bulk status update
  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) {
      setMessage("⚠️ Select at least one order and a status");
      return;
    }
    try {
      const res = await axios.put(
        `${API_URL}/bulk`,
        { orderIds: selectedOrders, status: bulkStatus },
        { headers: getAuthHeaders() }
      );
      setMessage(res.data.message || "✅ Orders updated successfully!");
      setSelectedOrders([]);
      setBulkStatus("");
      fetchOrders();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Bulk update error:", err);
      setMessage("❌ Failed to bulk update orders");
    }
  };

  // ✅ Cancel single order
  const cancelOrder = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      setMessage("✅ Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      setMessage("❌ Failed to cancel order");
    }
  };

  // ✅ Update status (confirmed, delivered, etc.)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
      setMessage(`✅ Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      setMessage("❌ Failed to update status");
    }
  };

  // ✅ Dispatch selected orders
  const dispatchOrders = async () => {
    if (selectedOrders.length === 0) {
      setMessage("⚠️ Select at least one order to dispatch");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/dispatch`,
        { orderIds: selectedOrders },
        { headers: getAuthHeaders() }
      );
      setMessage("✅ Orders dispatched successfully!");
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      console.error("Dispatch error:", err);
      setMessage("❌ Failed to dispatch orders");
    }
  };

  // 🔍 Filtering
  const filteredOrders = orders
    .filter((order) => {
      if (filter === "delivered") return order.status?.toLowerCase() === "delivered";
      if (filter === "cancelled") return order.status?.toLowerCase() === "cancelled";
      if (filter === "recent" && selectedDate) {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return orderDate === selectedDate;
      }
      return (
        order.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (filter === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filter === "highvalue") return b.finalAmount - a.finalAmount;
      return 0;
    });

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">📦 Orders Management</h1>

      {message && <div className="mb-4 p-3 rounded bg-green-600">{message}</div>}

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "delivered", "cancelled", "recent", "highvalue"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setSelectedDate("");
            }}
            className={`px-4 py-2 rounded-md ${
              filter === f ? "bg-orange-500" : "bg-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by buyer or order..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded bg-white mb-4 text-black"
      />

      {/* Bulk Controls */}
      <div className="flex gap-3 mb-6 items-center">
        <select
          value={bulkStatus}
          onChange={(e) => setBulkStatus(e.target.value)}
          className="px-3 py-2 rounded bg-white text-black"
        >
          <option value="">-- Select Status --</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleBulkUpdate}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Bulk Update
        </button>
        <button
          onClick={dispatchOrders}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Dispatch Selected
        </button>
      </div>

      {loading ? (
        <p className="text-orange-400">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black">
          <table className="min-w-full text-sm bg-gray-800 border-collapse border border-black">
            <thead className="bg-gray-700 text-white text-xs font-semibold uppercase border border-black">
              <tr>
                <th className="p-3 border border-black">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map((o) => o._id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </th>
                <th className="p-3 border border-black">Order ID</th>
                <th className="p-3 border border-black">Buyer</th>
                <th className="p-3 border border-black">Email / Phone</th>
                <th className="p-3 border border-black">Products</th>
                <th className="p-3 border border-black">Amount</th>
                <th className="p-3 border border-black">Status</th>
                <th className="p-3 border border-black">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border border-black hover:bg-gray-700">
                  <td className="p-3 border border-black">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order._id]);
                        } else {
                          setSelectedOrders(
                            selectedOrders.filter((id) => id !== order._id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="p-3 border border-black">{order.orderNumber}</td>
                  <td className="p-3 border border-black">{order.buyerName}</td>
                  <td className="p-3 border border-black">
                    {order.buyerEmail} / {order.buyerPhone}
                  </td>
                  <td className="p-3 border border-black">
                    {order.products?.map((p, i) => (
                      <div key={i}>
                        {p.product?.productName} × {p.quantity} = ₹{p.total}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 border border-black">₹{order.finalAmount}</td>
                  <td className="p-3 border border-black">{getStatusBadge(order.status)}</td>
                  <td className="p-3 border border-black space-x-2">
                    <button
                      onClick={() => updateStatus(order._id, "confirmed")}
                      className="px-2 py-1 bg-blue-600 rounded text-xs"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, "delivered")}
                      className="px-2 py-1 bg-green-600 rounded text-xs"
                    >
                      Deliver
                    </button>
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="px-2 py-1 bg-red-600 rounded text-xs"
                    >
                      Cancel
                    </button>
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

