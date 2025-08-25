"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/userService";

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.ok) {
      setProfile(res.data);
      setForm({ name: res.data.name, email: res.data.email, password: "" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateProfile(form);
    if (res.ok) {
      alert("Profile updated successfully!");
      fetchProfile();
    } else {
      alert(res.error || "Update failed");
    }
    setSubmitting(false);
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Update */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (leave blank to keep old)"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-orange-500" />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-orange-500" />
            SMS Notifications
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-orange-500" />
            Push Notifications
          </label>
        </div>
      </div>
    </div>
  );
}
