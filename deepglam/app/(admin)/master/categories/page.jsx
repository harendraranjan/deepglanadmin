"use client";
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/services/masterService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.ok) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter category name");
    setSubmitting(true);
    const res = await createCategory({ name });
    if (res.ok) {
      alert("Category added");
      setName("");
      fetchCategories();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const res = await deleteCategory(id);
    if (res.ok) {
      alert("Category deleted");
      fetchCategories();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading categories...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter category name"
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

      {/* Categories List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Category Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
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
