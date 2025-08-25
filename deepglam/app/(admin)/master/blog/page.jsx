"use client";
import { useEffect, useState } from "react";
import {
  getBlogs,
  createBlog,
  deleteBlog,
} from "@/services/masterService";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await getBlogs();
    if (res.ok) setBlogs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      return alert("Enter title & content");
    }
    setSubmitting(true);
    const res = await createBlog(form);
    if (res.ok) {
      alert("Blog added");
      setForm({ title: "", content: "", imageUrl: "" });
      fetchBlogs();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    const res = await deleteBlog(id);
    if (res.ok) {
      alert("Blog deleted");
      fetchBlogs();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading blogs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Management</h1>

      {/* Add Blog Form */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Enter blog title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Enter blog content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          rows={4}
        />
        <button
          type="submit"
          disabled={submitting}
          className="col-span-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {submitting ? "Adding..." : "Add Blog"}
        </button>
      </form>

      {/* Blogs List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Image</th>
            <th className="p-2">Content</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="p-2">{b.title}</td>
              <td className="p-2">
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="h-12 rounded" />
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">{b.content.substring(0, 50)}...</td>
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
