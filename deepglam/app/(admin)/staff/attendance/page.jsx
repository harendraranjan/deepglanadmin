"use client";
import { useEffect, useState } from "react";
import { getAttendance } from "@/services/attendanceService";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    const res = await getAttendance();
    if (res.ok) setRecords(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <p className="p-6">Loading attendance...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Attendance</h1>
      {records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Staff</th>
              <th className="p-2">Date</th>
              <th className="p-2">Check-In</th>
              <th className="p-2">Check-Out</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">
                  {r.staff?.name} ({r.staff?.employeeCode})
                </td>
                <td className="p-2">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "-"}
                </td>
                <td className="p-2">
                  {r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "-"}
                </td>
                <td className="p-2">
                  {r.checkIn && r.checkOut ? (
                    <span className="text-green-600">Present</span>
                  ) : (
                    <span className="text-red-600">Absent</span>
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
