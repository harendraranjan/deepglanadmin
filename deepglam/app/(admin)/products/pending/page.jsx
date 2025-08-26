"use client";
import { useEffect, useState } from "react";
import {
  getDisapprovedProducts,
  approveProduct,
  deleteProduct,
} from "@/services/productService";

export default function PendingProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getDisapprovedProducts();
    if (res.ok) setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    const res = await approveProduct(id);
    if (res.ok) {
      alert("Product approved successfully");
      fetchProducts();
    } else {
      alert(res.error || "Error approving product");
    }
  };

  const handleReject = async (id) => {
    const res = await deleteProduct(id);
    if (res.ok) {
      alert("Product rejected & removed");
      fetchProducts();
    } else {
      alert(res.error || "Error rejecting product");
    }
  };

  if (loading) return <p className="p-6">Loading pending products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Products</h1>
      {products.length === 0 ? (
        <p>No pending products found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Category</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.productname}</td>
                <td className="p-2">{p.seller?.brandName}</td>
                <td className="p-2">{p.mainCategory} / {p.subCategory}</td>
                <td className="p-2">{p.brand}</td>
                <td className="p-2 capitalize">{p.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleApprove(p._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
