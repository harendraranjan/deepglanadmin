"use client";
import { useEffect, useState } from "react";
import {
  getSizes,
  createSize,
  deleteSize,
} from "@/services/masterService";

export default function SizesPage() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSizes = async () => {
    setLoading(true);
    const res = await getSizes();
    if (res.ok) setSizes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter size name");
    setSubmitting(true);
    const res = await createSize({ name });
    if (res.ok) {
      alert("Size added");
      setName("");
      fetchSizes();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this size?")) return;
    const res = await deleteSize(id);
    if (res.ok) {
      alert("Size deleted");
      fetchSizes();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading sizes...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sizes Management</h1>

      {/* Add Size Form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter size (e.g., S, M, L, XL, 38)"
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

      {/* Sizes List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Size</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(s._id)}
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
