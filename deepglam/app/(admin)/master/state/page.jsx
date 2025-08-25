"use client";
import { useEffect, useState } from "react";
import {
  getCountries,
  getStates,
  createState,
  deleteState,
} from "@/services/masterService";

export default function StatePage() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ countryId: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [countryRes, stateRes] = await Promise.all([
      getCountries(),
      getStates(),
    ]);
    if (countryRes.ok) setCountries(countryRes.data);
    if (stateRes.ok) setStates(stateRes.data);
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
    if (!form.name.trim() || !form.countryId) {
      return alert("Select country & enter state name");
    }
    setSubmitting(true);
    const res = await createState(form);
    if (res.ok) {
      alert("State added");
      setForm({ countryId: "", name: "" });
      fetchData();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this state?")) return;
    const res = await deleteState(id);
    if (res.ok) {
      alert("State deleted");
      fetchData();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading states...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">State Management</h1>

      {/* Add State */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="countryId"
          value={form.countryId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Enter state name"
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

      {/* State List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Country</th>
            <th className="p-2">State</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.country?.name || "N/A"}</td>
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
