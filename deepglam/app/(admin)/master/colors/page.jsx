"use client";
import { useEffect, useState } from "react";
import {
  getColors,
  createColor,
  deleteColor,
} from "@/services/masterService";

export default function ColorsPage() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", hex: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchColors = async () => {
    setLoading(true);
    const res = await getColors();
    if (res.ok) setColors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.hex.trim()) return alert("Enter color name & hex code");
    setSubmitting(true);
    const res = await createColor(form);
    if (res.ok) {
      alert("Color added");
      setForm({ name: "", hex: "" });
      fetchColors();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this color?")) return;
    const res = await deleteColor(id);
    if (res.ok) {
      alert("Color deleted");
      fetchColors();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading colors...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Colors Management</h1>

      {/* Add Color Form */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Enter color name (e.g., Red)"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="hex"
          placeholder="Enter hex code (e.g., #FF0000)"
          value={form.hex}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Colors List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Color</th>
            <th className="p-2">Hex Code</th>
            <th className="p-2">Preview</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.hex}</td>
              <td className="p-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: c.hex }}
                ></div>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(c._id)}
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
