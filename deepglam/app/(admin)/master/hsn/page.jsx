"use client";
import { useEffect, useState } from "react";
import {
  getHSNs,
  createHSN,
  updateHSN,
  deleteHSN,
} from "@/services/masterService";

export default function HSNPage() {
  const [hsnList, setHsnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ hsnCode: "", description: "", gstPercentage: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchHSN = async () => {
    setLoading(true);
    const res = await getHSNs();
    if (res.ok) setHsnList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHSN();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hsnCode.trim() || !form.gstPercentage) {
      return alert("Enter HSN Code & GST %");
    }

    setSubmitting(true);

    if (editingId) {
      const res = await updateHSN(editingId, form);
      if (res.ok) {
        alert("HSN updated successfully");
        resetForm();
        fetchHSN();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createHSN(form);
      if (res.ok) {
        alert("HSN added successfully");
        resetForm();
        fetchHSN();
      } else {
        alert(res.error);
      }
    }

    setSubmitting(false);
  };

  const handleEdit = (hsn) => {
    setForm({
      hsnCode: hsn.hsnCode,
      description: hsn.description || "",
      gstPercentage: hsn.gstPercentage,
    });
    setEditingId(hsn._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this HSN?")) return;
    const res = await deleteHSN(id);
    if (res.ok) {
      alert("HSN deleted successfully");
      fetchHSN();
    } else {
      alert(res.error);
    }
  };

  const resetForm = () => {
    setForm({ hsnCode: "", description: "", gstPercentage: "" });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading HSN codes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">HSN Codes Management</h1>

        {/* Add/Edit HSN Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingId ? "✏️ Edit HSN Code" : "➕ Add New HSN Code"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                name="hsnCode"
                placeholder="HSN Code"
                value={form.hsnCode}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <input
                type="number"
                name="gstPercentage"
                placeholder="GST %"
                value={form.gstPercentage}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                step="0.01"
                required
              />
              <div className="flex gap-2">
                {editingId ? (
                  <>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      {submitting ? "Updating..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Adding..." : "Add HSN"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* HSN List */}
        {hsnList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No HSN codes found. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">HSN Code</th>
                    <th className="p-4 text-left font-semibold">Description</th>
                    <th className="p-4 text-left font-semibold">GST %</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hsnList.map((h) => (
                    <tr 
                      key={h._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        editingId === h._id ? 'bg-orange-100' : 'bg-white'
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-800">{h.hsnCode}</td>
                      <td className="p-4 text-gray-600">{h.description || "-"}</td>
                      <td className="p-4 text-gray-800">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {h.gstPercentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(h)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(h._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
