"use client";
import { useEffect, useState } from "react";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "@/services/masterService";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage", // percentage | fixed
    value: "",
    expiryDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await getCoupons();
    if (res.ok) setCoupons(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) return alert("Enter coupon details");
    setSubmitting(true);
    const res = await createCoupon(form);
    if (res.ok) {
      alert("Coupon created");
      setForm({ code: "", discountType: "percentage", value: "", expiryDate: "" });
      fetchCoupons();
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    const res = await deleteCoupon(id);
    if (res.ok) {
      alert("Coupon deleted");
      fetchCoupons();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading coupons...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Coupons Management</h1>

      {/* Add Coupon Form */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (₹)</option>
        </select>
        <input
          type="number"
          name="value"
          placeholder="Discount Value"
          value={form.value}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="col-span-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {submitting ? "Adding..." : "Add Coupon"}
        </button>
      </form>

      {/* Coupons List */}
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Code</th>
            <th className="p-2">Type</th>
            <th className="p-2">Value</th>
            <th className="p-2">Expiry</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.code}</td>
              <td className="p-2 capitalize">{c.discountType}</td>
              <td className="p-2">
                {c.discountType === "percentage"
                  ? `${c.value}%`
                  : `₹${c.value}`}
              </td>
              <td className="p-2">
                {c.expiryDate
                  ? new Date(c.expiryDate).toLocaleDateString()
                  : "-"}
              </td>
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
