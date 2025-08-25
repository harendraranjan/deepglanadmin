"use client";
import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/orderService";
import { list } from "@/services/productService";
import { getBuyers } from "@/services/buyerService";
import { getSellers } from "@/services/sellerService";
import { getStaff } from "@/services/staffService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    buyers: 0,
    sellers: 0,
    products: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, buyersRes, sellersRes, productsRes, staffRes] =
          await Promise.all([
            getAllOrders(),
            getBuyers(),
            getSellers(),
            list(),
            getStaff(),
          ]);

        setStats({
          orders: ordersRes?.data?.length || 0,
          buyers: buyersRes?.data?.length || 0,
          sellers: sellersRes?.data?.length || 0,
          products: productsRes?.data?.length || 0,
          staff: staffRes?.data?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  const cards = [
    { label: "Total Orders", value: stats.orders },
    { label: "Total Buyers", value: stats.buyers },
    { label: "Total Sellers", value: stats.sellers },
    { label: "Total Products", value: stats.products },
    { label: "Total Staff", value: stats.staff },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="text-gray-500">{c.label}</p>
            <h2 className="text-2xl font-bold">{c.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
