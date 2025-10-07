"use client";
import { useEffect, useState } from "react";
import { getCoupons, createCoupon, deleteCoupon } from "@/services/masterService";

export default function CouponsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    maxUses: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const res = await getCoupons();
    // handle different shapes: your service returns { ok:true, data } or raw array
    if (res?.ok) setList(res.data || []);
    else if (Array.isArray(res)) setList(res);
    else if (res?.data && Array.isArray(res.data)) setList(res.data);
    else setList([]);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      value: "",
      minOrderAmount: "",
      maxDiscount: "",
      expiryDate: "",
      maxUses: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) return alert("Code aur value chahiye");
    setSubmitting(true);
    const payload = {
      code: form.code.trim(),
      discountType: form.discountType,
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      expiryDate: form.expiryDate || null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      isActive: !!form.isActive,
    };
    const res = await createCoupon(payload);
    if (res?.ok) {
      alert("Coupon created");
      resetForm();
      fetch();
    } else {
      alert(res?.message || res?.error || "Failed to create coupon");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    const res = await deleteCoupon(id);
    if (res?.ok) {
      alert("Deleted");
      fetch();
    } else {
      alert(res?.message || res?.error || "Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Force-visible heading (dark text) */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Coupons Management</h1>

        {/* Create Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Coupon</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Coupon code (e.g. SAVE10)"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
            />

            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>

            <input
              name="value"
              value={form.value}
              onChange={handleChange}
              type="number"
              placeholder="Value (10 or 100)"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            />

            <input
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              type="number"
              placeholder="Min order (optional)"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            />

            <input
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
              type="number"
              placeholder="Max discount (optional)"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            />

            <input
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              type="date"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            />

            <input
              name="maxUses"
              value={form.maxUses}
              onChange={handleChange}
              type="number"
              placeholder="Max uses (optional)"
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900"
            />

            <label className="flex items-center gap-2">
              <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
              <span className="text-gray-800">Active</span>
            </label>

            <div className="col-span-full mt-2 flex gap-3">
              <button type="submit" disabled={submitting} className="bg-orange-600 text-white px-4 py-2 rounded">
                {submitting ? "Creating..." : "Create Coupon"}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Reset</button>
            </div>
          </form>
        </div>

        {/* Coupon list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-orange-600 text-white">
                <tr>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4 text-left">Type / Value</th>
                  <th className="p-4 text-left">Min Order</th>
                  <th className="p-4 text-left">Expiry</th>
                  <th className="p-4 text-left">Max Uses</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No coupons yet</td>
                  </tr>
                )}

                {list.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-4 font-semibold text-gray-800">{c.code}</td>
                    <td className="p-4 text-gray-700">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                    <td className="p-4 text-gray-700">{c.minOrderAmount ?? "-"}</td>
                    <td className="p-4 text-gray-700">{c.validTill ? new Date(c.validTill).toLocaleDateString() : "-"}</td>
                    <td className="p-4 text-gray-700">{c.maxUses ?? "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => navigator.clipboard.writeText(c.code)} className="px-3 py-1 bg-blue-600 text-white rounded">Copy</button>
                        <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
