"use client";
import { useEffect, useState } from "react";
import {
  getProfits,
  createProfit,
  updateProfit,
  deleteProfit,
} from "@/services/masterService";

export default function ProfitPage() {
  const [profitList, setProfitList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    category: "", 
    marginPercentage: "",
    applicableTo: "buyer",
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchProfits = async () => {
    setLoading(true);
    const res = await getProfits();
    if (res.ok) setProfitList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfits();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category.trim() || !form.marginPercentage) {
      return alert("Enter Category & Margin %");
    }

    setSubmitting(true);

    if (editingId) {
      const res = await updateProfit(editingId, form);
      if (res.ok) {
        alert("Profit margin updated successfully");
        resetForm();
        fetchProfits();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createProfit(form);
      if (res.ok) {
        alert("Profit margin added successfully");
        resetForm();
        fetchProfits();
      } else {
        alert(res.error);
      }
    }

    setSubmitting(false);
  };

  const handleEdit = (profit) => {
    setForm({
      category: profit.category || "",
      marginPercentage: profit.marginPercentage || "",
      applicableTo: profit.applicableTo || "buyer",
      isActive: profit.isActive !== undefined ? profit.isActive : true,
    });
    setEditingId(profit._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this profit margin?")) return;
    const res = await deleteProfit(id);
    if (res.ok) {
      alert("Profit margin deleted successfully");
      fetchProfits();
    } else {
      alert(res.error);
    }
  };

  const resetForm = () => {
    setForm({ 
      category: "", 
      marginPercentage: "",
      applicableTo: "buyer",
      isActive: true
    });
    setEditingId(null);
  };

  const getApplicableToColor = (type) => {
    switch(type) {
      case "buyer": return "bg-blue-100 text-blue-800";
      case "seller": return "bg-amber-100 text-amber-800";
      case "both": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading profit margins...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profit Margin Management</h1>

        {/* Add/Edit Profit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingId ? "✏️ Edit Profit Margin" : "➕ Add New Profit Margin"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                name="category"
                placeholder="Category (e.g., Electronics)"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
              
              <input
                type="number"
                name="marginPercentage"
                placeholder="Margin %"
                value={form.marginPercentage}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                step="0.01"
                min="0"
                max="100"
                required
              />

              <select
                name="applicableTo"
                value={form.applicableTo}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="both">Both</option>
              </select>

              <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 font-medium cursor-pointer">
                  Active
                </label>
              </div>

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
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Adding..." : "Add Profit"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Profit List */}
        {profitList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No profit margins found. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Category</th>
                    <th className="p-4 text-left font-semibold">Margin %</th>
                    <th className="p-4 text-left font-semibold">Applicable To</th>
                    <th className="p-4 text-center font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profitList.map((p) => (
                    <tr 
                      key={p._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        editingId === p._id ? 'bg-purple-100' : 'bg-white'
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {p.category || "-"}
                      </td>
                      <td className="p-4 text-gray-800">
                        <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                          {p.marginPercentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getApplicableToColor(p.applicableTo)}`}>
                          {p.applicableTo}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          p.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.isActive ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(p)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
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
