// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AddBuyerForm from "@/components/AddSellerForm"; 

// const API_URL = "http://localhost:5000/api/sellers";

// export default function SellersPage() {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all"); // all, approved, pending, rejected, disapproved
//   const [showAddModal, setShowAddModal] = useState(false);

//   const getAuthHeaders = () => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
//   };

//   const fetchSellers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL, { headers: getAuthHeaders() });
//       setSellers(res.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch sellers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveSeller = async (id) => {
//     try {
//       await axios.patch(`${API_URL}/${id}/approve`, {}, { headers: getAuthHeaders() });
//       fetchSellers();
//     } catch (err) {
//       console.error(err);
//       alert("Approve failed");
//     }
//   };

//   const rejectSeller = async (id) => {
//     try {
//       await axios.patch(`${API_URL}/${id}/reject`, { reason: "Rejected" }, { headers: getAuthHeaders() });
//       fetchSellers();
//     } catch (err) {
//       console.error(err);
//       alert("Reject failed");
//     }
//   };

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   const filteredSellers = sellers.filter((s) => {
//     const nameBrand = `${s.userId?.name} ${s.brandName}`.toLowerCase();
//     const matchesSearch = nameBrand.includes(search.toLowerCase());
//     const statusFilter =
//       filter === "all" ? true :
//       filter === "approved" ? s.isApproved && !s.isRejected :
//       filter === "pending" ? !s.isApproved && !s.isRejected :
//       filter === "rejected" ? s.isRejected :
//       filter === "disapproved" ? s.isRejected : true;
//     return matchesSearch && statusFilter;
//   });

//   const getStatus = (s) => {
//     if (s.isRejected) return "Rejected";
//     if (!s.isApproved && !s.isRejected) return "Pending";
//     if (s.isApproved && s.isActive) return "Active";
//     return "Inactive";
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-black">🛍️ Seller Management</h1>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search by name or brand..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full md:w-full p-2 border rounded-lg bg-gray-50 text-gray-900 mb-2"
//       />

//       {/* Filter buttons + Add Buyer */}
//       <div className="flex flex-wrap justify-between items-center mb-4">
//         <div className="flex space-x-2 mb-2 md:mb-0">
//           {["all", "approved", "pending", "rejected", "disapproved"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded ${
//                 filter === f ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"
//               }`}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           + Add Buyer
//         </button>
//       </div>

//       {/* Sellers table */}
//       {loading ? (
//         <p>Loading sellers...</p>
//       ) : filteredSellers.length === 0 ? (
//         <p>No sellers found</p>
//       ) : (
//         <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
//           <table className="w-full border-collapse text-gray-200">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Brand</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSellers.map((s) => (
//                 <tr key={s._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
//                   <td className="p-3">{s.userId?.name}</td>
//                   <td className="p-3">{s.userId?.email}</td>
//                   <td className="p-3">{s.userId?.phone}</td>
//                   <td className="p-3">{s.brandName}</td>
//                   <td className="p-3">{getStatus(s)}</td>
//                   <td className="p-3 space-x-2">
//                     <button
//                       onClick={() => setSelectedSeller(s)}
//                       className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
//                     >
//                       View
//                     </button>
//                     {!s.isApproved && !s.isRejected && (
//                       <>
//                         <button
//                           onClick={() => approveSeller(s._id)}
//                           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => rejectSeller(s._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//      {/* View Seller Modal */}
// {selectedSeller && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//     onClick={() => setSelectedSeller(null)}
//   >
//     <div
//       className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">{selectedSeller.userId?.name} — {selectedSeller.brandName}</h2>
//         <button
//           onClick={() => setSelectedSeller(null)}
//           className="text-red-400 hover:text-red-600 font-bold"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="space-y-2">
//         <p><b>Name:</b> {selectedSeller.userId?.name}</p>
//         <p><b>Email:</b> {selectedSeller.userId?.email}</p>
//         <p><b>Phone:</b> {selectedSeller.userId?.phone}</p>
//         <p><b>Brand:</b> {selectedSeller.brandName}</p>
//         <p><b>GST:</b> {selectedSeller.gstNumber}</p>
//         <p><b>KYC Verified:</b> {selectedSeller.kycVerified ? "Yes" : "No"}</p>
//         <p><b>GST Verified:</b> {selectedSeller.gstVerified ? "Yes" : "No"}</p>
//         <p><b>Receivable (Paise):</b> {selectedSeller.receivablePaise}</p>
//         <p><b>Payout Hold (Paise):</b> {selectedSeller.payoutHoldPaise}</p>
//         <p><b>Auto Payout:</b> {selectedSeller.autoPayout ? "Yes" : "No"}</p>
//         <p><b>Approved:</b> {selectedSeller.isApproved ? "Yes" : "No"}</p>
//         <p><b>Rejected:</b> {selectedSeller.isRejected ? "Yes" : "No"}</p>
//         {selectedSeller.isRejected && <p><b>Reject Reason:</b> {selectedSeller.rejectReason || "N/A"}</p>}
//         <p><b>Active:</b> {selectedSeller.isActive ? "Yes" : "No"}</p>
//         <p>
//           <b>Address:</b>{" "}
//           {selectedSeller.fullAddress?.line1}, {selectedSeller.fullAddress?.line2},{" "}
//           {selectedSeller.fullAddress?.city}, {selectedSeller.fullAddress?.state},{" "}
//           {selectedSeller.fullAddress?.postalCode}, {selectedSeller.fullAddress?.country}
//         </p>

//         <h3 className="font-bold mt-4">Documents</h3>
//         <div className="flex space-x-4">
//           {selectedSeller.aadhaarCard?.front?.url && (
//             <a href={selectedSeller.aadhaarCard.front.url} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={selectedSeller.aadhaarCard.front.url}
//                 alt="Aadhaar Front"
//                 className="w-32 h-20 object-cover rounded border cursor-pointer hover:scale-105 transition"
//               />
//             </a>
//           )}
//           {selectedSeller.aadhaarCard?.back?.url && (
//             <a href={selectedSeller.aadhaarCard.back.url} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={selectedSeller.aadhaarCard.back.url}
//                 alt="Aadhaar Back"
//                 className="w-32 h-20 object-cover rounded border cursor-pointer hover:scale-105 transition"
//               />
//             </a>
//           )}
//         </div>

//         <p><b>Created At:</b> {new Date(selectedSeller.createdAt).toLocaleString()}</p>
//         <p><b>Updated At:</b> {new Date(selectedSeller.updatedAt).toLocaleString()}</p>
//       </div>
//     </div>
//   </div>
// )}


//       {/* Add Buyer Modal */}
//       {showAddModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setShowAddModal(false)}
//         >
//           <div
//             className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">Add Buyer</h2>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-red-400 hover:text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <AddBuyerForm onSuccess={() => { setShowAddModal(false); fetchSellers(); }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AddBuyerForm from "@/components/AddSellerForm"; 

// const API_URL = "https://deepglam.onrender.com/api/sellers"; // ✅ updated

// export default function SellersPage() {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all"); // all, approved, pending, rejected, disapproved
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false); // ✅ button loading state

//   const getAuthHeaders = () => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
//   };

//   const fetchSellers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL, { headers: getAuthHeaders() });
//       setSellers(res.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch sellers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveSeller = async (id) => {
//   try {
//     setActionLoading(true);
//     console.log("Approving sellerId:", id); // debug
//     const res = await axios.patch(`${API_URL}/${id}/approve`, {}, { headers: getAuthHeaders() });
//     console.log(res.data); // debug
//     alert(res.data.message);
//     fetchSellers();
//   } catch (err) {
//     console.error("Approve error:", err.response || err);
//     alert(err.response?.data?.message || "Approve failed");
//   } finally {
//     setActionLoading(false);
//   }
// };

//   const rejectSeller = async (id) => {
//     try {
//       setActionLoading(true);
//       const res = await axios.patch(
//         `${API_URL}/${id}/reject`,
//         { reason: "Rejected by admin" },
//         { headers: getAuthHeaders() }
//       );
//       alert(res.data.message);
//       fetchSellers();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Reject failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   const filteredSellers = sellers.filter((s) => {
//     const nameBrand = `${s.userId?.name} ${s.brandName}`.toLowerCase();
//     const matchesSearch = nameBrand.includes(search.toLowerCase());
//     const statusFilter =
//       filter === "all" ? true :
//       filter === "approved" ? s.isApproved && !s.isRejected :
//       filter === "pending" ? !s.isApproved && !s.isRejected :
//       filter === "rejected" ? s.isRejected :
//       filter === "disapproved" ? s.isRejected : true;
//     return matchesSearch && statusFilter;
//   });

//   const getStatus = (s) => {
//     if (s.isRejected) return "Rejected";
//     if (!s.isApproved && !s.isRejected) return "Pending";
//     if (s.isApproved && s.isActive) return "Active";
//     return "Inactive";
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-black">🛍️ Seller Management</h1>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search by name or brand..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full md:w-full p-2 border rounded-lg bg-gray-50 text-gray-900 mb-2"
//       />

//       {/* Filter buttons + Add Buyer */}
//       <div className="flex flex-wrap justify-between items-center mb-4">
//         <div className="flex space-x-2 mb-2 md:mb-0">
//           {["all", "approved", "pending", "rejected", "disapproved"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded ${
//                 filter === f ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"
//               }`}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           + Add Buyer
//         </button>
//       </div>

//       {/* Sellers table */}
//       {loading ? (
//         <p>Loading sellers...</p>
//       ) : filteredSellers.length === 0 ? (
//         <p>No sellers found</p>
//       ) : (
//         <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
//           <table className="w-full border-collapse text-gray-200">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Brand</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSellers.map((s) => (
//                 <tr key={s._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
//                   <td className="p-3">{s.userId?.name}</td>
//                   <td className="p-3">{s.userId?.email}</td>
//                   <td className="p-3">{s.userId?.phone}</td>
//                   <td className="p-3">{s.brandName}</td>
//                   <td className="p-3">{getStatus(s)}</td>
//                   <td className="p-3 space-x-2">
//                     <button
//                       onClick={() => setSelectedSeller(s)}
//                       className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
//                     >
//                       View
//                     </button>
//                     {!s.isApproved && !s.isRejected && (
//                       <>
//                         <button
//                           onClick={() => approveSeller(s._id)}
//                           disabled={actionLoading}
//                           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => rejectSeller(s._id)}
//                           disabled={actionLoading}
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* View Seller Modal */}
//       {selectedSeller && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setSelectedSeller(null)}
//         >
//           <div
//             className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">{selectedSeller.userId?.name} — {selectedSeller.brandName}</h2>
//               <button
//                 onClick={() => setSelectedSeller(null)}
//                 className="text-red-400 hover:text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-2">
//               <p><b>Name:</b> {selectedSeller.userId?.name}</p>
//               <p><b>Email:</b> {selectedSeller.userId?.email}</p>
//               <p><b>Phone:</b> {selectedSeller.userId?.phone}</p>
//               <p><b>Brand:</b> {selectedSeller.brandName}</p>
//               <p><b>Status:</b> {getStatus(selectedSeller)}</p>
//               <p><b>Created At:</b> {new Date(selectedSeller.createdAt).toLocaleString()}</p>
//               <p><b>Updated At:</b> {new Date(selectedSeller.updatedAt).toLocaleString()}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Buyer Modal */}
//       {showAddModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setShowAddModal(false)}
//         >
//           <div
//             className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">Add Buyer</h2>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-red-400 hover:text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <AddBuyerForm onSuccess={() => { setShowAddModal(false); fetchSellers(); }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AddBuyerForm from "@/components/AddSellerForm"; 

// const API_URL = "https://deepglam.onrender.com/api/sellers"; // ✅ backend URL

// export default function SellersPage() {
//   const [sellers, setSellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);

//   const getAuthHeaders = () => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
//   };

//   // Fetch sellers from backend
//   const fetchSellers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL, { headers: getAuthHeaders() });
//       setSellers(res.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch sellers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve seller
//   const approveSeller = async (id) => {
//     try {
//       setActionLoading(true);
//       const res = await axios.patch(`${API_URL}/${id}/approve`, {}, { headers: getAuthHeaders() });
//       alert(res.data.message);

//       // Update the seller in local state immediately
//       setSellers((prev) =>
//         prev.map((s) =>
//           s._id === id ? { ...s, isApproved: true, isRejected: false } : s
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Approve failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Reject seller
//   const rejectSeller = async (id) => {
//     try {
//       setActionLoading(true);
//       const res = await axios.patch(
//         `${API_URL}/${id}/reject`,
//         { reason: "Rejected by admin" },
//         { headers: getAuthHeaders() }
//       );
//       alert(res.data.message);

//       // Update the seller in local state immediately
//       setSellers((prev) =>
//         prev.map((s) =>
//           s._id === id ? { ...s, isApproved: false, isRejected: true } : s
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Reject failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   // Filter sellers based on search and status
//   const filteredSellers = sellers.filter((s) => {
//     const nameBrand = `${s.userId?.name} ${s.brandName}`.toLowerCase();
//     const matchesSearch = nameBrand.includes(search.toLowerCase());
//     const statusFilter =
//       filter === "all" ? true :
//       filter === "approved" ? s.isApproved && !s.isRejected :
//       filter === "pending" ? !s.isApproved && !s.isRejected :
//       filter === "rejected" ? s.isRejected :
//       filter === "disapproved" ? s.isRejected : true;
//     return matchesSearch && statusFilter;
//   });

//   const getStatus = (s) => {
//     if (s.isRejected) return "Rejected";
//     if (!s.isApproved && !s.isRejected) return "Pending";
//     if (s.isApproved && s.isActive) return "Active";
//     return "Inactive";
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-black">🛍️ Seller Management</h1>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search by name or brand..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full md:w-full p-2 border rounded-lg bg-gray-50 text-gray-900 mb-2"
//       />

//       {/* Filter buttons + Add Buyer */}
//       <div className="flex flex-wrap justify-between items-center mb-4">
//         <div className="flex space-x-2 mb-2 md:mb-0">
//           {["all", "approved", "pending", "rejected", "disapproved"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded ${
//                 filter === f ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"
//               }`}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           + Add Buyer
//         </button>
//       </div>

//       {/* Sellers table */}
//       {loading ? (
//         <p>Loading sellers...</p>
//       ) : filteredSellers.length === 0 ? (
//         <p>No sellers found</p>
//       ) : (
//         <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
//           <table className="w-full border-collapse text-gray-200">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Brand</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSellers.map((s) => (
//                 <tr key={s._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
//                   <td className="p-3">{s.userId?.name}</td>
//                   <td className="p-3">{s.userId?.email}</td>
//                   <td className="p-3">{s.userId?.phone}</td>
//                   <td className="p-3">{s.brandName}</td>
//                   <td className="p-3">{getStatus(s)}</td>
//                   <td className="p-3 space-x-2">
//                     <button
//                       onClick={() => setSelectedSeller(s)}
//                       className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
//                     >
//                       View
//                     </button>
//                     {!s.isApproved && !s.isRejected && (
//                       <>
//                         <button
//                           onClick={() => approveSeller(s._id)}
//                           disabled={actionLoading}
//                           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => rejectSeller(s._id)}
//                           disabled={actionLoading}
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* View Seller Modal */}
//       {selectedSeller && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setSelectedSeller(null)}
//         >
//           <div
//             className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">{selectedSeller.userId?.name} — {selectedSeller.brandName}</h2>
//               <button
//                 onClick={() => setSelectedSeller(null)}
//                 className="text-red-400 hover:text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-2">
//               <p><b>Name:</b> {selectedSeller.userId?.name}</p>
//               <p><b>Email:</b> {selectedSeller.userId?.email}</p>
//               <p><b>Phone:</b> {selectedSeller.userId?.phone}</p>
//               <p><b>Brand:</b> {selectedSeller.brandName}</p>
//               <p><b>Status:</b> {getStatus(selectedSeller)}</p>
//               <p><b>Created At:</b> {new Date(selectedSeller.createdAt).toLocaleString()}</p>
//               <p><b>Updated At:</b> {new Date(selectedSeller.updatedAt).toLocaleString()}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Buyer Modal */}
//       {showAddModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//           onClick={() => setShowAddModal(false)}
//         >
//           <div
//             className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">Add Buyer</h2>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-red-400 hover:text-red-600 font-bold"
//               >
//                 ✕
//               </button>
//             </div>
//             <AddBuyerForm onSuccess={() => { setShowAddModal(false); fetchSellers(); }} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AddBuyerForm from "@/components/AddSellerForm"; 

const API_URL = "https://deepglam.onrender.com/api/sellers"; // ✅ your API

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      setSellers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const approveSeller = async (id) => {
    try {
      setActionLoading(true);
      const res = await axios.patch(`${API_URL}/${id}/approve`, {}, { headers: getAuthHeaders() });
      alert(res.data.message);
      fetchSellers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectSeller = async (id) => {
    try {
      setActionLoading(true);
      const res = await axios.patch(
        `${API_URL}/${id}/reject`,
        { reason: "Rejected by admin" },
        { headers: getAuthHeaders() }
      );
      alert(res.data.message);
      fetchSellers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter((s) => {
    const nameBrand = `${s.userId?.name} ${s.brandName}`.toLowerCase();
    const matchesSearch = nameBrand.includes(search.toLowerCase());
    const statusFilter =
      filter === "all" ? true :
      filter === "approved" ? s.isApproved :
      filter === "pending" ? !s.isApproved && !s.isRejected :
      filter === "rejected" ? s.isRejected :
      filter === "disapproved" ? s.isRejected : true;
    return matchesSearch && statusFilter;
  });

  const getStatus = (s) => {
    if (s.isRejected) return "Rejected";
    if (s.isApproved) return "Approved";
    return "Pending";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">🛍️ Seller Management</h1>

      <input
        type="text"
        placeholder="Search by name or brand..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-full p-2 border rounded-lg bg-gray-50 text-gray-900 mb-2"
      />

      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2 mb-2 md:mb-0">
          {["all", "approved", "pending", "rejected", "disapproved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Seller
        </button>
      </div>

      {loading ? (
        <p>Loading sellers...</p>
      ) : filteredSellers.length === 0 ? (
        <p>No sellers found</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
          <table className="w-full border-collapse text-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((s) => (
                <tr key={s._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="p-3">{s.userId?.name}</td>
                  <td className="p-3">{s.userId?.email}</td>
                  <td className="p-3">{s.userId?.phone}</td>
                  <td className="p-3">{s.brandName}</td>
                  <td className="p-3">{getStatus(s)}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setSelectedSeller(s)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      View
                    </button>
                    {!s.isApproved && !s.isRejected && (
                      <>
                        <button
                          onClick={() => approveSeller(s._id)}
                          disabled={actionLoading}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectSeller(s._id)}
                          disabled={actionLoading}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      )}

      {selectedSeller && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedSeller(null)}
        >
          <div
            className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{selectedSeller.userId?.name} — {selectedSeller.brandName}</h2>
              <button
                onClick={() => setSelectedSeller(null)}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <p><b>Name:</b> {selectedSeller.userId?.name}</p>
              <p><b>Email:</b> {selectedSeller.userId?.email}</p>
              <p><b>Phone:</b> {selectedSeller.userId?.phone}</p>
              <p><b>Brand:</b> {selectedSeller.brandName}</p>
              <p><b>Status:</b> {getStatus(selectedSeller)}</p>
              <p><b>Created At:</b> {new Date(selectedSeller.createdAt).toLocaleString()}</p>
              <p><b>Updated At:</b> {new Date(selectedSeller.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-gray-900 text-gray-100 w-2/3 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Seller</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
            <AddBuyerForm onSuccess={() => { setShowAddModal(false); fetchSellers(); }} />
          </div>
        </div>
      )}
    </div>
  );
}
