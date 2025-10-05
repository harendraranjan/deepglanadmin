"use client";
import { useEffect, useState } from "react";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/services/masterService";

export default function LocationPage() {
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    country: "India",
    state: "", 
    city: "",
    pincode: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchLocations = async () => {
    setLoading(true);
    const res = await getAllLocations();
    if (res.ok) setLocationList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.state.trim() || !form.city.trim()) {
      return alert("Enter State & City");
    }

    setSubmitting(true);

    if (editingId) {
      const res = await updateLocation(editingId, form);
      if (res.ok) {
        alert("Location updated successfully");
        resetForm();
        fetchLocations();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createLocation(form);
      if (res.ok) {
        alert("Location added successfully");
        resetForm();
        fetchLocations();
      } else {
        alert(res.error);
      }
    }

    setSubmitting(false);
  };

  const handleEdit = (location) => {
    setForm({
      country: location.country || "India",
      state: location.state || "",
      city: location.city || "",
      pincode: location.pincode || "",
    });
    setEditingId(location._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this location?")) return;
    const res = await deleteLocation(id);
    if (res.ok) {
      alert("Location deleted successfully");
      fetchLocations();
    } else {
      alert(res.error);
    }
  };

  const resetForm = () => {
    setForm({ 
      country: "India",
      state: "", 
      city: "",
      pincode: ""
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Location Management</h1>

        {/* Add/Edit Location Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingId ? "✏️ Edit Location" : "➕ Add New Location"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
              
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={form.state}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City *"
                value={form.city}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode (optional)"
                value={form.pincode}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                maxLength="6"
                pattern="[0-9]*"
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
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Adding..." : "Add Location"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Location List */}
        {locationList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No locations found. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Country</th>
                    <th className="p-4 text-left font-semibold">State</th>
                    <th className="p-4 text-left font-semibold">City</th>
                    <th className="p-4 text-left font-semibold">Pincode</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {locationList.map((loc) => (
                    <tr 
                      key={loc._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        editingId === loc._id ? 'bg-teal-100' : 'bg-white'
                      }`}
                    >
                      <td className="p-4 text-gray-800">
                        <span className="inline-flex items-center gap-1">
                          🌍 {loc.country || "India"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">
                        {loc.state}
                      </td>
                      <td className="p-4 text-gray-700">
                        {loc.city}
                      </td>
                      <td className="p-4 text-gray-700">
                        {loc.pincode ? (
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {loc.pincode}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(loc)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(loc._id)}
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
