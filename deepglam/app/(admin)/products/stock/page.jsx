// "use client";
// import { useEffect, useState } from "react";
// import { list, updateProduct } from "@/services/productService";

// export default function ProductStockPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);

//   const fetchProducts = async () => {
//     setLoading(true);
//     const res = await list();
//     if (res.ok) setProducts(res.data.items || res.data); // support both paginated & plain list
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleUpdateStock = async (id, newStock) => {
//     if (!confirm("Update stock for this product?")) return;
//     setUpdatingId(id);
//     const res = await updateProduct(id, { stock: newStock });
//     if (res.ok) {
//       alert("Stock updated successfully ✅");
//       fetchProducts();
//     } else {
//       alert(res.error || "Failed to update stock");
//     }
//     setUpdatingId(null);
//   };

//   if (loading) return <p className="p-6">Loading products...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Product Stock Management</h1>

//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <table className="w-full border border-gray-200 text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Product</th>
//               <th className="p-2">Brand</th>
//               <th className="p-2">Stock</th>
//               <th className="p-2">Update</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr key={p._id} className="border-t">
//                 <td className="p-2">{p.productname}</td>
//                 <td className="p-2">{p.brand || "-"}</td>
//                 <td className="p-2">{p.stock}</td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => {
//                       const newStock = prompt(
//                         `Enter new stock for ${p.productname}`,
//                         p.stock
//                       );
//                       if (newStock !== null) {
//                         handleUpdateStock(p._id, parseInt(newStock));
//                       }
//                     }}
//                     disabled={updatingId === p._id}
//                     className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
//                   >
//                     {updatingId === p._id ? "Updating..." : "Update Stock"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";

// export default function ProductStockPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // API se data fetch karna
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/products", {
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

//   if (loading) return <p className="p-6">Loading products...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Product List</h1>

//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <table className="w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Image</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">Brand</th>
//               <th className="p-2">Category</th>
//               <th className="p-2">Type</th>
//               <th className="p-2">Price</th>
//               <th className="p-2">Final Price</th>
//               <th className="p-2">Stock</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Sizes</th>
//               <th className="p-2">Colors</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr key={p._id} className="border-t">
//                 <td className="p-2">
//                   <img
//                     src={p.mainImage?.url}
//                     alt={p.productname}
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                 </td>
//                 <td className="p-2">{p.productname}</td>
//                 <td className="p-2">{p.brand}</td>
//                 <td className="p-2">{p.mainCategory} / {p.subCategory}</td>
//                 <td className="p-2">{p.productType}</td>
//                 <td className="p-2">₹{p.mrp}</td>
//                 <td className="p-2">₹{p.finalPrice}</td>
//                 <td className="p-2">{p.stock}</td>
//                 <td className="p-2">{p.status}</td>
//                 <td className="p-2">{p.sizes?.join(", ")}</td>
//                 <td className="p-2">{p.colors?.join(", ")}</td>
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

export default function ProductStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://deepglam.onrender.com/api/products", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    const lower = (s) => s?.toLowerCase() || "";
    return products.filter((p) => {
      const matchesStatus =
        filter === "all" || lower(p.status) === filter.toLowerCase();
      const matchesSearch = lower(p.productName).includes(lower(searchTerm));
      return matchesStatus && matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();
  const filters = ["all", "approved", "disapproved", "pending"];

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    const s = status?.toLowerCase();
    if (s === "approved")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Approved</span>
      );
    if (s === "disapproved")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Disapproved</span>
      );
    if (s === "pending")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
      );
    return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
  };

  if (loading)
    return (
      <p className="p-6 text-orange-600 font-medium">Loading products...</p>
    );

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        🛍 Product Management
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {filters.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`capitalize px-5 py-2 rounded-md font-medium transition duration-150 text-white bg-orange-500 hover:bg-orange-600`}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black placeholder-black"
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
                <th className="p-3 text-left border border-black">Name</th>
                <th className="p-3 text-left border border-black">Brand</th>
                <th className="p-3 text-left border border-black">Category</th>
                <th className="p-3 text-left border border-black">Type</th>
                <th className="p-3 text-left border border-black">Price</th>
                <th className="p-3 text-left border border-black">Status</th>
                <th className="p-3 text-left border border-black">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border border-black hover:bg-orange-50">
                  <td className="p-3 font-medium border border-black">
                    {p.productName}
                  </td>
                  <td className="p-3 border border-black">{p.brand}</td>
                  <td className="p-3 border border-black">
                    {p.mainCategory} / {p.subCategory}
                  </td>
                  <td className="p-3 border border-black">{p.productType}</td>
                  <td className="p-3 text-blue-600 font-semibold border border-black">
                    ₹{p.salePrice}
                  </td>
                  <td className="p-3 border border-black">{getStatusBadge(p.status)}</td>
                  <td className="p-3 border border-black">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for product details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.productName}</h2>

            {/* Images */}
            <div className="flex flex-wrap gap-4 mb-4">
              <img
                src={selectedProduct.mainImage?.url}
                alt="Main"
                className="w-32 h-32 object-cover rounded border cursor-pointer"
                onClick={() => window.open(selectedProduct.mainImage?.url, "_blank")}
              />
              {selectedProduct.images?.map((img) => (
                <img
                  key={img._id}
                  src={img.url}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded border cursor-pointer"
                  onClick={() => window.open(img.url, "_blank")}
                />
              ))}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b>Brand:</b> {selectedProduct.brand}</p>
              <p><b>Category:</b> {selectedProduct.mainCategory} / {selectedProduct.subCategory}</p>
              <p><b>Type:</b> {selectedProduct.productType}</p>
              <p><b>HSN Code:</b> {selectedProduct.hsnCode}</p>
              <p><b>Price:</b> ₹{selectedProduct.price}</p>
              <p><b>Sale Price:</b> ₹{selectedProduct.salePrice}</p>
              <p><b>Status:</b> {selectedProduct.status}</p>
              <p><b>MOQ:</b> {selectedProduct.MOQ}</p>
              <p><b>GST:</b> {selectedProduct.gstPercentage}% ({selectedProduct.gstType})</p>
              <p><b>Seller:</b> {selectedProduct.userId?.name} ({selectedProduct.userId?.email})</p>
            </div>

            {/* Variations */}
            {selectedProduct.variations?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Variations</h3>
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Size</th>
                      <th className="p-2 border">Color</th>
                      <th className="p-2 border">Pieces</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.variations.map((v, i) => (
                      <tr key={i}>
                        <td className="p-2 border">{v.size}</td>
                        <td className="p-2 border">{v.color}</td>
                        <td className="p-2 border">{v.pieces || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{selectedProduct.productDescription}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
