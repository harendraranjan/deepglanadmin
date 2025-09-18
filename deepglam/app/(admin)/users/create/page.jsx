
"use client";
import { useEffect, useState } from "react";

export default function StaffListPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("https://deepglam.onrender.com/api/staff");
        const json = await res.json();
        if (json.ok && json.data?.items) {
          setStaff(json.data.items);
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter((member) => {
    const matchSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.toLowerCase().includes(search.toLowerCase()) ||
      (member.email?.toLowerCase() || "").includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? member.isActive
        : !member.isActive;
    return matchSearch && matchStatus;
  });

  if (loading) return <p className="p-6 text-black">Loading staff...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">👨‍💼 Staff Directory</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 bg-white rounded px-4 py-2 flex-1 text-black"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 bg-white rounded px-4 py-2 text-black"
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Employee Code</th>
              <th className="border border-gray-300 p-3">Phone</th>
              <th className="border border-gray-300 p-3">Email</th>
              <th className="border border-gray-300 p-3">Salary</th>
              <th className="border border-gray-300 p-3">Allowance</th>
              <th className="border border-gray-300 p-3">Target</th>
              <th className="border border-gray-300 p-3">Address</th>
              <th className="border border-gray-300 p-3">Bank Details</th>
              <th className="border border-gray-300 p-3">Status</th>
              <th className="border border-gray-300 p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border border-gray-300 p-3">{member.name}</td>
                  <td className="border border-gray-300 p-3">
                    {member.employeeCode}
                  </td>
                  <td className="border border-gray-300 p-3">{member.phone}</td>
                  <td className="border border-gray-300 p-3">
                    {member.email || member.userId?.email}
                  </td>
                  <td className="border border-gray-300 p-3">
                    ₹{member.salary}
                  </td>
                  <td className="border border-gray-300 p-3">
                    ₹{member.travelAllowance}
                  </td>
                  <td className="border border-gray-300 p-3">{member.target}</td>
                  <td className="border border-gray-300 p-3 text-sm">
                    {member.address?.line1 && <div>{member.address.line1},</div>}
                    {member.address?.city && <div>{member.address.city},</div>}
                    {member.address?.state && (
                      <div>{member.address.state},</div>
                    )}
                    {member.address?.country}
                  </td>
                  <td className="border border-gray-300 p-3 text-sm">
                    {member.bankDetails ? (
                      <div>
                        <div>AC: {member.bankDetails.accountNumber}</div>
                        <div>IFSC: {member.bankDetails.ifscCode}</div>
                        <div>Holder: {member.bankDetails.accountHolderName}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    className={`border border-gray-300 p-3 font-semibold ${
                      member.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="border border-gray-300 p-3 text-xs text-gray-600">
                    {new Date(member.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No staff found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}