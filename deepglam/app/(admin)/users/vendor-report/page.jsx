"use client";
import { useEffect, useState } from "react";
import { getVendorReport } from "@/services/analyticsService";

export default function VendorReportPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    const res = await getVendorReport();
    if (res.ok) setVendors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <p className="p-6">Loading vendor report...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Report</h1>

      {vendors.length === 0 ? (
        <p>No vendor data available.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Seller</th>
              <th className="p-2">Total Products</th>
              <th className="p-2">Total Orders</th>
              <th className="p-2">Total Sales</th>
              <th className="p-2">Pending Payments</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id} className="border-t">
                <td className="p-2">{v.brandName || v.email}</td>
                <td className="p-2">{v.totalProducts}</td>
                <td className="p-2">{v.totalOrders}</td>
                <td className="p-2 font-semibold">₹{v.totalSales}</td>
                <td className="p-2 text-red-600">₹{v.pendingPayments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
