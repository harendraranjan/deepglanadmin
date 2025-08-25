"use client";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
} from "@/services/userService";

export default function UserPermissionPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res.ok) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    const res = await updateUserRole(id, { role: newRole });
    if (res.ok) {
      alert("Role updated ✅");
      fetchUsers();
    } else {
      alert(res.error || "Failed to update role");
    }
    setUpdatingId(null);
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Permissions</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Current Role</th>
              <th className="p-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={updatingId === u._id}
                    className="border p-1 rounded"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="salesmanager">Sales Manager</option>
                    <option value="accountant">Accountant</option>
                    <option value="deliverymanager">Delivery Manager</option>
                    <option value="staff">Staff</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
