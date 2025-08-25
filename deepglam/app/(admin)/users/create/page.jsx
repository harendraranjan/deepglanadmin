"use client";
import { useState } from "react";
import { createUser } from "@/services/userService";

export default function CreateUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff", // default
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await createUser(form);
    if (res.ok) {
      alert("✅ User created successfully");
      setForm({ name: "", email: "", password: "", role: "staff" });
    } else {
      alert(res.error || "Failed to create user");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create User</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="superadmin">Super Admin</option>
          <option value="salesmanager">Sales Manager</option>
          <option value="accountant">Accountant</option>
          <option value="deliverymanager">Delivery Manager</option>
          <option value="staff">Staff</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
