
"use client";
import { useEffect, useState } from "react";
import { list as getProducts } from "@/services/productService";
import { getAllOrders } from "@/services/orderService";
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
      setLoading(true);
      try {
        const [ordersRes, buyersRes, sellersRes, productsRes, staffRes] =
          await Promise.all([
            getAllOrders(), // fetch orders
            getBuyers(),
            getSellers(),
            getProducts(),
            getStaff(),
          ]);

        const getCount = (res) => {
          if (!res || !res.ok) return 0;
          // data is array
          if (Array.isArray(res.data)) return res.data.length;
          // data is object with array inside
          if (res.data && typeof res.data === "object") {
            const firstArray = Object.values(res.data).find(Array.isArray);
            if (firstArray) return firstArray.length;
          }
          return 0;
        };

        setStats({
          orders: getCount(ordersRes),
          buyers: getCount(buyersRes),
          sellers: getCount(sellersRes),
          products: getCount(productsRes),
          staff: getCount(staffRes),
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;

  const cards = [
    { label: "Total Orders", value: stats.orders },
    { label: "Total Buyers", value: stats.buyers },
    { label: "Total Sellers", value: stats.sellers },
    { label: "Total Products", value: stats.products },
    { label: "Total Staff", value: stats.staff },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="text-gray-500">{c.label}</p>
            <h2 className="text-2xl font-bold mt-2">{c.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
