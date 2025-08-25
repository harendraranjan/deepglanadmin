"use client";
import { useEffect, useState } from "react";
import { list, updateProduct } from "@/services/productService";

export default function ProductStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await list();
    if (res.ok) setProducts(res.data.items || res.data); // support both paginated & plain list
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    if (!confirm("Update stock for this product?")) return;
    setUpdatingId(id);
    const res = await updateProduct(id, { stock: newStock });
    if (res.ok) {
      alert("Stock updated successfully ✅");
      fetchProducts();
    } else {
      alert(res.error || "Failed to update stock");
    }
    setUpdatingId(null);
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Stock Management</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.productname}</td>
                <td className="p-2">{p.brand || "-"}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      const newStock = prompt(
                        `Enter new stock for ${p.productname}`,
                        p.stock
                      );
                      if (newStock !== null) {
                        handleUpdateStock(p._id, parseInt(newStock));
                      }
                    }}
                    disabled={updatingId === p._id}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {updatingId === p._id ? "Updating..." : "Update Stock"}
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
