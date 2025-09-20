// // // "use client";
// // // import { useEffect, useState } from "react";
// // // import { list, updateProduct } from "@/services/productService";

// // // export default function ProductStockPage() {
// // //   const [products, setProducts] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [updatingId, setUpdatingId] = useState(null);

// // //   const fetchProducts = async () => {
// // //     setLoading(true);
// // //     const res = await list();
// // //     if (res.ok) setProducts(res.data.items || res.data); // support both paginated & plain list
// // //     setLoading(false);
// // //   };

// // //   useEffect(() => {
// // //     fetchProducts();
// // //   }, []);

// // //   const handleUpdateStock = async (id, newStock) => {
// // //     if (!confirm("Update stock for this product?")) return;
// // //     setUpdatingId(id);
// // //     const res = await updateProduct(id, { stock: newStock });
// // //     if (res.ok) {
// // //       alert("Stock updated successfully ✅");
// // //       fetchProducts();
// // //     } else {
// // //       alert(res.error || "Failed to update stock");
// // //     }
// // //     setUpdatingId(null);
// // //   };

// // //   if (loading) return <p className="p-6">Loading products...</p>;

// // //   return (
// // //     <div>
// // //       <h1 className="text-2xl font-bold mb-6">Product Stock Management</h1>

// // //       {products.length === 0 ? (
// // //         <p>No products found.</p>
// // //       ) : (
// // //         <table className="w-full border border-gray-200 text-sm">
// // //           <thead className="bg-gray-100 text-left">
// // //             <tr>
// // //               <th className="p-2">Product</th>
// // //               <th className="p-2">Brand</th>
// // //               <th className="p-2">Stock</th>
// // //               <th className="p-2">Update</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {products.map((p) => (
// // //               <tr key={p._id} className="border-t">
// // //                 <td className="p-2">{p.productname}</td>
// // //                 <td className="p-2">{p.brand || "-"}</td>
// // //                 <td className="p-2">{p.stock}</td>
// // //                 <td className="p-2">
// // //                   <button
// // //                     onClick={() => {
// // //                       const newStock = prompt(
// // //                         `Enter new stock for ${p.productname}`,
// // //                         p.stock
// // //                       );
// // //                       if (newStock !== null) {
// // //                         handleUpdateStock(p._id, parseInt(newStock));
// // //                       }
// // //                     }}
// // //                     disabled={updatingId === p._id}
// // //                     className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
// // //                   >
// // //                     {updatingId === p._id ? "Updating..." : "Update Stock"}
// // //                   </button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       )}
// // //     </div>
// // //   );
// // // }

// "use client";
// import { useEffect, useState } from "react";

// export default function ProductStockPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // 🟠 Fetch Products
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("https://deepglam.onrender.com/api/products", {
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       setProducts(data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // 🟠 Update Product
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(
//         `https://deepglam.onrender.com/api/products/${editingProduct._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(editingProduct),
//         }
//       );
//       if (res.ok) {
//         alert("Product updated ✅");
//         setEditingProduct(null);
//         fetchProducts();
//       } else {
//         const err = await res.json();
//         alert(err.message || "Failed to update ❌");
//       }
//     } catch (error) {
//       console.error("Update Error:", error);
//       alert("Something went wrong ❌");
//     }
//   };

//   // 🟠 Approve Product
//   const handleApprove = async (id) => {
//     await fetch(`https://deepglam.onrender.com/api/products/approve/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//     });
//     fetchProducts();
//   };

//   // 🟠 Reject Product
//   const handleReject = async (id) => {
//     await fetch(`https://deepglam.onrender.com/api/products/reject/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//     });
//     fetchProducts();
//   };

//   // 🟠 Filter + Search
//   const getFilteredProducts = () => {
//     const lower = (s) => s?.toLowerCase() || "";
//     return products.filter((p) => {
//       if (filter === "deleted" && !p.isActive) return true;
//       if (filter === "rejected" && lower(p.status) === "disapproved")
//         return true;
//       const matchesStatus =
//         filter === "all" || lower(p.status) === filter.toLowerCase();
//       const matchesSearch = lower(p.productName).includes(lower(searchTerm));
//       return matchesStatus && matchesSearch;
//     });
//   };

//   const filteredProducts = getFilteredProducts();
//   const filters = ["all", "approved", "pending", "rejected"];

//   const getStatusBadge = (status) => {
//     const base = "px-3 py-1 rounded-full text-xs font-bold";
//     const s = status?.toLowerCase();

//     if (s === "approved")
//       return (
//         <span className={`${base} bg-green-100 text-green-700`}>Approved</span>
//       );

//     // ✅ Reject / Rejected / Disapproved
//     if (s === "disapproved" || s === "reject" || s === "rejected")
//       return (
//         <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>
//       );

//     if (s === "pending")
//       return (
//         <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
//       );

//     // Default fallback
//     return (
//       <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>
//     );
//   };

//   if (loading)
//     return (
//       <p className="p-6 text-orange-600 font-medium">Loading products...</p>
//     );

//   return (
//     <div className="bg-white min-h-screen p-6 text-gray-900">
//       <h1 className="text-3xl font-bold mb-6 text-orange-600">
//         🛍 Product Management
//       </h1>

//       {/* Filter Buttons */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         {filters.map((type) => (
//           <button
//             key={type}
//             onClick={() => setFilter(type)}
//             className="capitalize px-5 py-2 rounded-md font-medium transition duration-150 text-white bg-orange-500 hover:bg-orange-600"
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by product name..."
//           className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder-gray-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       {filteredProducts.length === 0 ? (
//         <p className="text-orange-700 font-medium">No products found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-md border border-black mb-6">
//           <table className="min-w-full text-sm bg-white border-collapse border border-black">
//             <thead className="bg-orange-100 text-gray-800 text-xs font-semibold uppercase border border-black">
//               <tr>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Brand</th>
//                 <th className="p-3 border">Category</th>
//                 <th className="p-3 border">Type</th>
//                 <th className="p-3 border">Price</th>
//                 <th className="p-3 border">Stock</th>
//                 <th className="p-3 border">Status</th>
//                 <th className="p-3 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-800">
//               {filteredProducts.map((p) => (
//                 <tr key={p._id} className="border hover:bg-orange-50">
//                   <td className="p-3 font-medium border">{p.productName}</td>
//                   <td className="p-3 border">{p.brand}</td>
//                   <td className="p-3 border">
//                     {p.mainCategory} / {p.subCategory}
//                   </td>
//                   <td className="p-3 border">{p.productType}</td>
//                   <td className="p-3 text-blue-600 font-semibold border">
//                     ₹{p.salePrice}
//                   </td>
//                   <td className="p-3 border">{p.stock || 0}</td>
//                   <td className="p-3 border">{getStatusBadge(p.status)}</td>
//                   <td className="p-3 border flex gap-2 flex-wrap">
//                     <button
//                       onClick={() => setSelectedProduct(p)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => setEditingProduct(p)}
//                       className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//                     >
//                       Update
//                     </button>
//                     <button
//                       onClick={() => handleApprove(p._id)}
//                       className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleReject(p._id)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal (View Details) */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//           <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 text-gray-900">
//             <h2 className="text-2xl font-bold mb-4">
//               {selectedProduct.productName}
//             </h2>
//             <img
//               src={selectedProduct.mainImage?.url}
//               alt="Main"
//               onClick={() => setImagePreview(selectedProduct.mainImage?.url)}
//               className="w-40 h-40 object-cover rounded border mb-4 cursor-pointer hover:opacity-80"
//             />
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <p>
//                 <b>Brand:</b> {selectedProduct.brand}
//               </p>
//               <p>
//                 <b>Category:</b> {selectedProduct.mainCategory} /{" "}
//                 {selectedProduct.subCategory}
//               </p>
//               <p>
//                 <b>Type:</b> {selectedProduct.productType}
//               </p>
//               <p>
//                 <b>Price:</b> ₹{selectedProduct.salePrice}
//               </p>
//               <p>
//                 <b>Stock:</b> {selectedProduct.stock || 0}
//               </p>
//               <p>
//                 <b>Status:</b> {selectedProduct.status}
//               </p>
//               <p className="col-span-2">
//                 <b>Description:</b> {selectedProduct.productDescription}
//               </p>
//             </div>
//             <div className="grid grid-cols-3 gap-2 mt-4">
//               {selectedProduct.images?.map((img) => (
//                 <img
//                   key={img._id}
//                   src={img.url}
//                   alt="Gallery"
//                   onClick={() => setImagePreview(img.url)}
//                   className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
//                 />
//               ))}
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setSelectedProduct(null)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {imagePreview && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//           onClick={() => setImagePreview(null)}
//         >
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="max-w-[90%] max-h-[90%] rounded shadow-lg"
//           />
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editingProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
//             <form onSubmit={handleUpdateSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 value={editingProduct.productName}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     productName: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Product Name"
//               />
//               <input
//                 type="text"
//                 value={editingProduct.brand}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     brand: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Brand"
//               />
//               <input
//                 type="text"
//                 value={editingProduct.mainCategory}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     mainCategory: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Main Category"
//               />
//               <input
//                 type="text"
//                 value={editingProduct.subCategory}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     subCategory: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Sub Category"
//               />
//               <input
//                 type="text"
//                 value={editingProduct.productType}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     productType: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Product Type"
//               />
//               <input
//                 type="number"
//                 value={editingProduct.salePrice}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     salePrice: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Sale Price"
//               />
//               <input
//                 type="number"
//                 value={editingProduct.mrp}
//                 onChange={(e) =>
//                   setEditingProduct({ ...editingProduct, mrp: e.target.value })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="MRP"
//               />
//               <input
//                 type="number"
//                 value={editingProduct.stock || 0}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     stock: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Stock"
//               />
//               <textarea
//                 value={editingProduct.productDescription}
//                 onChange={(e) =>
//                   setEditingProduct({
//                     ...editingProduct,
//                     productDescription: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Description"
//               />
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setEditingProduct(null)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  const API_URL = "https://deepglam.onrender.com/api/products";

  // 🔑 Get Auth Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // token should be set on login
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  };

  // 🟠 Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      setProducts(res.data.data || res.data); // adjust based on API response
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟠 Update Product
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/${editingProduct._id}`,
        editingProduct,
        { headers: getAuthHeaders() }
      );
      setMessage("✅ Product updated");
      setEditingProduct(null);
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to update product");
    }
  };

  // 🟠 Approve Product
  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/approve/${id}`, {}, { headers: getAuthHeaders() });
      setMessage("✅ Product approved");
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to approve product");
    }
  };

  // 🟠 Reject Product
  const handleReject = async (id) => {
    try {
      await axios.put(`${API_URL}/reject/${id}`, {}, { headers: getAuthHeaders() });
      setMessage("✅ Product rejected");
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to reject product");
    }
  };

  // 🟠 Delete Product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      setMessage("✅ Product deleted");
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to delete product");
    }
  };

  // 🟠 Filter + Search
  const getFilteredProducts = () => {
    const lower = (s) => s?.toLowerCase() || "";
    return products.filter((p) => {
      if (filter === "deleted" && !p.isActive) return true;
      if (filter === "rejected" && lower(p.status) === "disapproved") return true;
      const matchesStatus = filter === "all" || lower(p.status) === filter.toLowerCase();
      const matchesSearch = lower(p.productName).includes(lower(searchTerm));
      return matchesStatus && matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();
  const filters = ["all", "approved", "pending", "rejected"];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    const s = status?.toLowerCase();
    if (s === "approved") return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
    if (s === "disapproved" || s === "reject" || s === "rejected") return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
    if (s === "pending") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
    return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
  };

  if (loading) return <p className="p-6 text-orange-600 font-medium">Loading products...</p>;

  return (
    <div className="bg-white min-h-screen p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">🛍 Product Management</h1>
      {message && <div className="mb-4 p-3 rounded bg-green-600 text-white">{message}</div>}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {filters.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className="capitalize px-5 py-2 rounded-md font-medium transition duration-150 text-white bg-orange-500 hover:bg-orange-600"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <p className="text-orange-700 font-medium">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black mb-6">
          <table className="min-w-full text-sm bg-white border-collapse border border-black">
            <thead className="bg-orange-100 text-gray-800 text-xs font-semibold uppercase border border-black">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Brand</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Stock</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border hover:bg-orange-50">
                  <td className="p-3 font-medium border">{p.productName}</td>
                  <td className="p-3 border">{p.brand}</td>
                  <td className="p-3 border">{p.mainCategory} / {p.subCategory}</td>
                  <td className="p-3 border">{p.productType}</td>
                  <td className="p-3 text-blue-600 font-semibold border">₹{p.salePrice}</td>
                  <td className="p-3 border">{p.stock || 0}</td>
                  <td className="p-3 border">{getStatusBadge(p.status)}</td>
                  <td className="p-3 border flex gap-2 flex-wrap">
                    <button onClick={() => setSelectedProduct(p)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">View</button>
                    <button onClick={() => setEditingProduct(p)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Update</button>
                    <button onClick={() => handleApprove(p._id)} className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600">Approve</button>
                    <button onClick={() => handleReject(p._id)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Reject</button>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View & Edit Modals */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 text-gray-900">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.productName}</h2>
            <img src={selectedProduct.mainImage?.url} alt="Main" onClick={() => setImagePreview(selectedProduct.mainImage?.url)} className="w-40 h-40 object-cover rounded border mb-4 cursor-pointer hover:opacity-80" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b>Brand:</b> {selectedProduct.brand}</p>
              <p><b>Category:</b> {selectedProduct.mainCategory} / {selectedProduct.subCategory}</p>
              <p><b>Type:</b> {selectedProduct.productType}</p>
              <p><b>Price:</b> ₹{selectedProduct.salePrice}</p>
              <p><b>Stock:</b> {selectedProduct.stock || 0}</p>
              <p><b>Status:</b> {selectedProduct.status}</p>
              <p className="col-span-2"><b>Description:</b> {selectedProduct.productDescription}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedProduct(null)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Close</button>
            </div>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setImagePreview(null)}>
          <img src={imagePreview} alt="Preview" className="max-w-[90%] max-h-[90%] rounded shadow-lg" />
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input type="text" value={editingProduct.productName} onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })} className="w-full p-2 border rounded" placeholder="Product Name" />
              <input type="text" value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} className="w-full p-2 border rounded" placeholder="Brand" />
              <input type="text" value={editingProduct.mainCategory} onChange={(e) => setEditingProduct({ ...editingProduct, mainCategory: e.target.value })} className="w-full p-2 border rounded" placeholder="Main Category" />
              <input type="text" value={editingProduct.subCategory} onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })} className="w-full p-2 border rounded" placeholder="Sub Category" />
              <input type="text" value={editingProduct.productType} onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value })} className="w-full p-2 border rounded" placeholder="Product Type" />
              <input type="number" value={editingProduct.salePrice} onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })} className="w-full p-2 border rounded" placeholder="Sale Price" />
              <input type="number" value={editingProduct.mrp} onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })} className="w-full p-2 border rounded" placeholder="MRP" />
              <input type="number" value={editingProduct.stock || 0} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="w-full p-2 border rounded" placeholder="Stock" />
              <textarea value={editingProduct.productDescription} onChange={(e) => setEditingProduct({ ...editingProduct, productDescription: e.target.value })} className="w-full p-2 border rounded" placeholder="Description" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

