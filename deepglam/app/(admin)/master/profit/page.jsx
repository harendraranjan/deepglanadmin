"use client";
import { useEffect, useState } from "react";
import { getProfits, setProfit } from "@/services/masterService";

export default function ProfitPage() {
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  const fetchProfits = async () => {
    setLoading(true);
    const res = await getProfits();
    if (res.ok) setProfits(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfits();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await setProfit({ percentage: value });
    if (res.ok) {
      alert("Profit % updated");
      setValue("");
      fetchProfits();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading Profit %...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profit % Master</h1>
      <form onSubmit={handleSave} className="mb-6 flex gap-2">
        <input
          type="number"
          placeholder="Enter Profit %"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Save
        </button>
      </form>

      <ul className="space-y-2">
        {profits.map((p) => (
          <li key={p._id} className="p-3 bg-white shadow rounded flex justify-between">
            <span>{p.percentage}%</span>
            <span className="text-gray-400 text-xs">{new Date(p.updatedAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
