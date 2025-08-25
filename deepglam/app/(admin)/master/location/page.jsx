"use client";
import { useEffect, useState } from "react";
import {
  getLocations,
  createLocation,
  deleteLocation,
} from "@/services/masterService";

export default function LocationPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ pincode: "", city: "", state: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    const res = await getLocations();
    if (res.ok) setLocations(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.pincode.trim() || !form.city.trim() || !form.state.trim())
      return alert("Enter complete location details");

    setSubmitting(true);
    const res = await createLocation(form);
    if (res.ok) {
      alert("Location added");
      setForm({ pincode: "", city: "", state: "" });
      fetchLocations();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this location?")) return;
    const res = await deleteLocation(id);
    if (res.ok) {
      alert("Location deleted");
      fetchLocations();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading locations...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Locations Management</h1>

      {/* Add Location Form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
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

      {/* Locations List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Pincode</th>
            <th className="p-2">City</th>
            <th className="p-2">State</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc._id} className="border-t">
              <td className="p-2">{loc.pincode}</td>
              <td className="p-2">{loc.city}</td>
              <td className="p-2">{loc.state}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(loc._id)}
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
