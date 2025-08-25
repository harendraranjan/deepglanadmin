"use client";
import { useEffect, useState } from "react";
import {
  getHSN,
  createHSN,
  deleteHSN,
} from "@/services/masterService";

export default function HSNPage() {
  const [hsnList, setHsnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", gstPercentage: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchHSN = async () => {
    setLoading(true);
    const res = await getHSN();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.gstPercentage) return alert("Enter HSN & GST %");
    setSubmitting(true);
    const res = await createHSN(form);
    if (res.ok) {
      alert("HSN added");
      setForm({ code: "", gstPercentage: "" });
      fetchHSN();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this HSN?")) return;
    const res = await deleteHSN(id);
    if (res.ok) {
      alert("HSN deleted");
      fetchHSN();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading HSN codes...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">HSN Codes Management</h1>

      {/* Add HSN Form */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          name="code"
          placeholder="HSN Code"
          value={form.code}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="gstPercentage"
          placeholder="GST %"
          value={form.gstPercentage}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>

      {/* HSN List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">HSN Code</th>
            <th className="p-2">GST %</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {hsnList.map((h) => (
            <tr key={h._id} className="border-t">
              <td className="p-2">{h.code}</td>
              <td className="p-2">{h.gstPercentage}%</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(h._id)}
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
