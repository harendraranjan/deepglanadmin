// "use client";
// import { useEffect, useState } from "react";
// import { getBuyerReport } from "@/services/analyticsService";

// export default function BuyerReportPage() {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReport = async () => {
//     setLoading(true);
//     const res = await getBuyerReport();
//     if (res.ok) setBuyers(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReport();
//   }, []);

//   if (loading) return <p className="p-6">Loading buyer report...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Buyer Report</h1>

//       {buyers.length === 0 ? (
//         <p>No buyer data available.</p>
//       ) : (
//         <table className="w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Buyer</th>
//               <th className="p-2">Shop Name</th>
//               <th className="p-2">Total Orders</th>
//               <th className="p-2">Total Spent</th>
//               <th className="p-2">Pending Payments</th>
//             </tr>
//           </thead>
//           <tbody>
//             {buyers.map((b) => (
//               <tr key={b._id} className="border-t">
//                 <td className="p-2">{b.name || b.email}</td>
//                 <td className="p-2">{b.shopName || "-"}</td>
//                 <td className="p-2">{b.totalOrders}</td>
//                 <td className="p-2 font-semibold">₹{b.totalSpent}</td>
//                 <td className="p-2 text-red-600">₹{b.pendingPayments}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
