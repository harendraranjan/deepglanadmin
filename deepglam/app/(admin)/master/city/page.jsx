"use client";
import { useEffect, useState } from "react";
import {
  getStates,
  getCities,
  createCity,
  deleteCity,
} from "@/services/masterService";

export default function CityPage() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ stateId: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [stateRes, cityRes] = await Promise.all([
      getStates(),
      getCities(),
    ]);
    if (stateRes.ok) setStates(stateRes.data);
    if (cityRes.ok) setCities(cityRes.data);
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
    if (!form.name.trim() || !form.stateId) {
      return alert("Select state & enter city name");
    }
    setSubmitting(true);
    const res = await createCity(form);
    if (res.ok) {
      alert("City added");
      setForm({ stateId: "", name: "" });
      fetchData();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this city?")) return;
    const res = await deleteCity(id);
    if (res.ok) {
      alert("City deleted");
      fetchData();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading cities...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">City Management</h1>

      {/* Add City */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="stateId"
          value={form.stateId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Enter city name"
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

      {/* City List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">State</th>
            <th className="p-2">City</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.state?.name || "N/A"}</td>
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
