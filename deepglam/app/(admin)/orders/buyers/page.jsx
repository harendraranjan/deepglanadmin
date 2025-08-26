"use client";
import { useEffect, useState } from "react";
import { getBuyers, approveBuyer, rejectBuyer } from "@/services/buyerService";

export default function BuyersPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyers = async () => {
    setLoading(true);
    const res = await getBuyers();
    if (res.ok) setBuyers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleApprove = async (id) => {
    const res = await approveBuyer(id);
    if (res.ok) {
      alert("Buyer approved successfully");
      fetchBuyers();
    } else {
      alert(res.error);
    }
  };

  const handleReject = async (id) => {
    const res = await rejectBuyer(id);
    if (res.ok) {
      alert("Buyer rejected");
      fetchBuyers();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading buyers...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyers Management</h1>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Shop Name</th>
            <th className="p-2">Employee Code</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="p-2">{b.shopName}</td>
              <td className="p-2">{b.employeeCode}</td>
              <td className="p-2">{b.email}</td>
              <td className="p-2">{b.phone}</td>
              <td className="p-2 capitalize">{b.isApproved ? "Approved" : "Pending"}</td>
              <td className="p-2 space-x-2">
                {!b.isApproved && (
                  <>
                    <button
                      onClick={() => handleApprove(b._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(b._id)}
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
