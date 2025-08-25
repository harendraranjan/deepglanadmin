"use client";
import { useEffect, useState } from "react";
import {
  getCountries,
  createCountry,
  deleteCountry,
} from "@/services/masterService";

export default function CountryPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCountries = async () => {
    setLoading(true);
    const res = await getCountries();
    if (res.ok) setCountries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter country name");
    setSubmitting(true);
    const res = await createCountry({ name });
    if (res.ok) {
      alert("Country added");
      setName("");
      fetchCountries();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this country?")) return;
    const res = await deleteCountry(id);
    if (res.ok) {
      alert("Country deleted");
      fetchCountries();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading countries...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Country Management</h1>

      {/* Add Country */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter country name"
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

      {/* Country List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Country Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
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
