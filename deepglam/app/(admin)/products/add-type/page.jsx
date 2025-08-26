"use client";
import { useEffect, useState } from "react";
import { createProductType, getProductTypes, deleteProductType } from "@/services/productService";

export default function AddProductTypePage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    const res = await getProductTypes();
    if (res.ok) setTypes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleInputChange = (e) => {
    setForm({ name: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Enter a type name");
    setSubmitting(true);
    const res = await createProductType({ name: form.name });
    if (res.ok) {
      alert("Product type added");
      setForm({ name: "" });
      fetchTypes();
    } else {
      alert(res.error || "Error creating product type");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product type?")) return;
    const res = await deleteProductType(id);
    if (res.ok) {
      alert("Deleted successfully");
      fetchTypes();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading product types...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Product Type</h1>

      {/* Add Form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter product type name"
          value={form.name}
          onChange={handleInputChange}
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      {/* List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Type Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t._id} className="border-t">
              <td className="p-2">{t.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
