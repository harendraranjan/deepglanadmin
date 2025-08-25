"use client";
import { useEffect, useState } from "react";
import { getSellers, approveSeller, rejectSeller } from "@/services/sellerService";

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    setLoading(true);
    const res = await getSellers();
    if (res.ok) setSellers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (id) => {
    const res = await approveSeller(id);
    if (res.ok) {
      alert("Seller approved successfully");
      fetchSellers();
    } else {
      alert(res.error);
    }
  };

  const handleReject = async (id) => {
    const res = await rejectSeller(id);
    if (res.ok) {
      alert("Seller rejected");
      fetchSellers();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading sellers...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sellers Management</h1>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Brand Name</th>
            <th className="p-2">GST Number</th>
            <th className="p-2">Aadhaar</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.brandName}</td>
              <td className="p-2">{s.gstNumber}</td>
              <td className="p-2">{s.aadhaarCard?.front || "N/A"}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.phone}</td>
              <td className="p-2 capitalize">{s.isApproved ? "Approved" : "Pending"}</td>
              <td className="p-2 space-x-2">
                {!s.isApproved && (
                  <>
                    <button
                      onClick={() => handleApprove(s._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(s._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
