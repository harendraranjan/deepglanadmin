"use client";
import { useEffect, useState } from "react";
import {
  getBrands,
  createBrand,
  deleteBrand,
} from "@/services/masterService";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    const res = await getBrands();
    if (res.ok) setBrands(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter brand name");
    setSubmitting(true);
    const res = await createBrand({ name });
    if (res.ok) {
      alert("Brand added");
      setName("");
      fetchBrands();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    const res = await deleteBrand(id);
    if (res.ok) {
      alert("Brand deleted");
      fetchBrands();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading brands...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Brand Management</h1>

      {/* Add Brand Form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {/* Brand List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Brand Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="p-2">{b.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(b._id)}
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
