"use client";
import { useEffect, useState } from "react";
import { list, markPaid } from "@/services/payrollService";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayrolls = async () => {
    setLoading(true);
    const res = await list();
    if (res.ok) setPayrolls(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleMarkPaid = async (id) => {
    if (!confirm("Mark this salary as paid?")) return;
    const res = await markPaid(id);
    if (res.ok) {
      alert("Payroll marked as paid");
      fetchPayrolls();
    } else {
      alert(res.error);
    }
  };

  if (loading) return <p className="p-6">Loading payrolls...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payroll Management</h1>

      {payrolls.length === 0 ? (
        <p>No payroll records found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Staff</th>
              <th className="p-2">Month</th>
              <th className="p-2">Base Salary</th>
              <th className="p-2">Target</th>
              <th className="p-2">Achieved</th>
              <th className="p-2">Final Salary</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.staff?.name} ({p.staff?.employeeCode})</td>
                <td className="p-2">{p.month}</td>
                <td className="p-2">₹{p.baseSalary}</td>
                <td className="p-2">{p.target}</td>
                <td className="p-2">{p.achieved}</td>
                <td className="p-2 font-semibold">₹{p.finalSalary}</td>
                <td className="p-2 capitalize">
                  {p.isPaid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Pending</span>
                  )}
                </td>
                <td className="p-2">
                  {!p.isPaid && (
                    <button
                      onClick={() => handleMarkPaid(p._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
