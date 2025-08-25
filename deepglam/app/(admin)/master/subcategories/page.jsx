"use client";
import { useEffect, useState } from "react";
import {
  getCategories,
  getSubcategories,
  createSubcategory,
  deleteSubcategory,
} from "@/services/masterService";

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categoryId: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories & subcategories
  const fetchData = async () => {
    setLoading(true);
    const [catRes, subRes] = await Promise.all([
      getCategories(),
      getSubcategories(),
    ]);
    if (catRes.ok) setCategories(catRes.data);
    if (subRes.ok) setSubcategories(subRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) {
      return alert("Select category & enter subcategory name");
    }
    setSubmitting(true);
    const res = await createSubcategory(form);
    if (res.ok) {
      alert("Subcategory added");
      setForm({ categoryId: "", name: "" });
      fetchData();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subcategory?")) return;
    const res = await deleteSubcategory(id);
    if (res.ok) {
      alert("Deleted successfully");
      fetchData();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading subcategories...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subcategories Management</h1>

      {/* Add Subcategory */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Enter subcategory name"
          value={form.name}
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

      {/* Subcategories List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Category</th>
            <th className="p-2">Subcategory</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.category?.name || "N/A"}</td>
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
