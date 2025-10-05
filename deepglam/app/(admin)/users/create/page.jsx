"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { createStaff, getAllStaff } from "@/services/staffService";

export default function StaffListPage() {
  const { token, user } = useContext(AuthContext);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    salary: "",
    travelAllowance: "",
    target: "",
    addressLine1: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankHolderName: "",
    photo: "",
    isActive: true,
    fcmToken: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        console.log("Fetching staff...");
        const result = await getAllStaff();
        console.log("getAllStaff result:", result);
        
        if (result.ok) {
          let staffList = [];
          if (result.data?.data?.items) {
            staffList = result.data.data.items;
          } else if (result.data?.items) {
            staffList = result.data.items;
          } else if (Array.isArray(result.data)) {
            staffList = result.data;
          } else if (result.data?.data && Array.isArray(result.data.data)) {
            staffList = result.data.data;
          }
          
          console.log("Staff list:", staffList);
          setStaff(staffList);
        } else {
          console.error("Failed to fetch staff:", result.error);
          setStaff([]);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
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

  async function handleFormSubmit(e) {
    e.preventDefault();
    setError(null);
    
    console.log("Form submission started");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("User:", user);

    if (!token) {
      setError("Authentication required. Please login as admin.");
      return;
    }

    if (user?.role !== "admin") {
      setError("Only admin users can create staff.");
      return;
    }

    setSaving(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      password: formData.password,
      salary: Number(formData.salary) || 0,
      travelAllowance: Number(formData.travelAllowance) || 0,
      target: Number(formData.target) || 0,
      address: {
        line1: formData.addressLine1,
        city: formData.addressCity,
        state: formData.addressState,
        country: formData.addressCountry,
      },
      bankDetails: {
        accountNumber: formData.bankAccountNumber,
        ifscCode: formData.bankIfsc,
        accountHolderName: formData.bankHolderName,
      },
      photo: formData.photo || undefined,
      isActive: formData.isActive,
      fcmToken: formData.fcmToken || undefined,
    };

    console.log("Payload being sent:", payload);

    try {
      const result = await createStaff(payload);
      console.log("createStaff result:", result);

      if (result.ok) {
        let newStaff = null;
        if (result.data?.data?.staff) {
          newStaff = result.data.data.staff;
        } else if (result.data?.staff) {
          newStaff = result.data.staff;
        } else if (result.data?.data) {
          newStaff = result.data.data;
        } else {
          newStaff = result.data;
        }

        console.log("New staff created:", newStaff);
        
        if (newStaff) {
          setStaff((prev) => [...prev, newStaff]);
        }
        
        setShowForm(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          password: "",
          salary: "",
          travelAllowance: "",
          target: "",
          addressLine1: "",
          addressCity: "",
          addressState: "",
          addressCountry: "",
          bankAccountNumber: "",
          bankIfsc: "",
          bankHolderName: "",
          photo: "",
          isActive: true,
          fcmToken: "",
        });
        alert("Staff created successfully!");
      } else {
        console.error("Create staff failed:", result.error);
        setError("Failed to create staff: " + result.error);
      }
    } catch (err) {
      console.error("Exception during staff creation:", err);
      setError("Error creating staff: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6 text-black">Loading staff...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">👨‍💼 Staff Directory</h1>

      {/* Button HAMESHA dikhega - NO condition */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Staff
      </button>

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
                  <td className="border border-gray-300 p-3">₹{member.salary}</td>
                  <td className="border border-gray-300 p-3">
                    ₹{member.travelAllowance}
                  </td>
                  <td className="border border-gray-300 p-3">{member.target}</td>
                  <td className="border border-gray-300 p-3 text-sm">
                    {member.address?.line1 && <div>{member.address.line1},</div>}
                    {member.address?.city && <div>{member.address.city},</div>}
                    {member.address?.state && <div>{member.address.state},</div>}
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

      {/* Create Staff Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-xl overflow-auto max-h-[80vh]"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                required
                placeholder="Phone *"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                required
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Travel Allowance"
                value={formData.travelAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, travelAllowance: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Target"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="City"
                value={formData.addressCity}
                onChange={(e) =>
                  setFormData({ ...formData, addressCity: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="State"
                value={formData.addressState}
                onChange={(e) =>
                  setFormData({ ...formData, addressState: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Country"
                value={formData.addressCountry}
                onChange={(e) =>
                  setFormData({ ...formData, addressCountry: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Bank Account Number"
                value={formData.bankAccountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, bankAccountNumber: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="IFSC Code"
                value={formData.bankIfsc}
                onChange={(e) =>
                  setFormData({ ...formData, bankIfsc: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Account Holder Name"
                value={formData.bankHolderName}
                onChange={(e) =>
                  setFormData({ ...formData, bankHolderName: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Photo URL"
                value={formData.photo}
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="FCM Token (optional)"
                value={formData.fcmToken}
                onChange={(e) =>
                  setFormData({ ...formData, fcmToken: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <span>Active</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="px-4 py-2 rounded border border-gray-400"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Staff"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
