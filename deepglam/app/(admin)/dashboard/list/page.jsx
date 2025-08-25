"use client";
import { useEffect, useState } from "react";
import { getAllProducts, approveProduct } from "@/services/productService";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getAllProducts();
    if (res.ok) setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    const res = await approveProduct(id);
    if (res.ok) {
      alert("Product approved!");
      fetchProducts();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Products</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Seller</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.productname}</td>
              <td className="p-2">{p.seller?.brandName}</td>
              <td className="p-2">{p.status}</td>
              <td className="p-2">
                {p.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
