"use client";
import { useEffect, useState } from "react";
import { getStaffPerformance } from "@/services/analyticsService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    const res = await getStaffPerformance();
    if (res.ok) setAnalytics(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <p className="p-6">Loading analytics...</p>;

  if (!analytics) return <p className="p-6">No analytics data available.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-xl font-bold">₹{analytics.totalSales}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold">{analytics.totalOrders}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Total Buyers</p>
          <h2 className="text-xl font-bold">{analytics.totalBuyers}</h2>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500">Total Sellers</p>
          <h2 className="text-xl font-bold">{analytics.totalSellers}</h2>
        </div>
      </div>

      {/* Sales Over Time */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Sales Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.salesOverTime}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Staff Performance */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Staff Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.staffPerformance}
              dataKey="achieved"
              nameKey="staff"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {analytics.staffPerformance.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Buyers */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top Buyers</h2>
        <ul className="divide-y divide-gray-200">
          {analytics.topBuyers.map((b) => (
            <li key={b._id} className="py-2 flex justify-between">
              <span>{b.shopName}</span>
              <span className="font-semibold">₹{b.totalSpent}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
