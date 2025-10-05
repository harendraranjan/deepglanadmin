// app/(admin)/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import orderService from "@/services/orderService";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    paymentStatus: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await orderService.getMyOrders(params);
      
      if (response.ok) {
        const ordersData = response.data.orders || response.data || [];
        setOrders(ordersData);
        
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages,
          }));
        } else if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
        
        calculateStats(ordersData);
      } else {
        console.error("Failed to fetch orders:", response.error);
        alert(response.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const newStats = {
      total: ordersData.length,
      confirmed: ordersData.filter((o) => o.status === "confirmed").length,
      processing: ordersData.filter((o) => o.status === "processing").length,
      shipped: ordersData.filter((o) => o.status === "shipped").length,
      delivered: ordersData.filter((o) => o.status === "delivered").length,
    };
    setStats(newStats);
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setTimeout(() => fetchOrders(), 0);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setTimeout(() => fetchOrders(), 0);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id));
    }
  };

  // ✅ NEW: Handle bulk bill generation
 
// In app/(admin)/orders/page.jsx
// Replace handleBulkBill completely:

const handleBulkBill = () => {
  if (selectedOrders.length === 0) {
    alert("Please select orders to generate bills");
    return;
  }
  
  if (selectedOrders.length === 1) {
    // Single order - use normal route
    router.push(`/orders/${selectedOrders[0]}/bill`);
  } else {
    // Multiple orders - use query params with first ID
    const allIds = selectedOrders.join(',');
    router.push(`/orders/${selectedOrders[0]}/bill?ids=${allIds}`);
  }
};



  const handleBulkDispatch = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select orders to dispatch");
      return;
    }

    const courier = prompt("Enter courier name:", "Default Courier");
    if (!courier) return;

    try {
      const response = await orderService.bulkDispatch(selectedOrders, {
        courier,
        note: "Bulk dispatch from admin panel",
      });

      if (response.ok) {
        alert(`${selectedOrders.length} orders dispatched successfully`);
        setSelectedOrders([]);
        fetchOrders();
      } else {
        alert(response.error || "Bulk dispatch failed");
      }
    } catch (error) {
      console.error("Bulk dispatch error:", error);
      alert("Failed to dispatch orders");
    }
  };

  const handleBulkUpdate = async (status) => {
    if (selectedOrders.length === 0) {
      alert("Please select orders to update");
      return;
    }

    const note = prompt(`Update ${selectedOrders.length} orders to ${status}?`, "");
    if (note === null) return;

    try {
      const response = await orderService.bulkUpdate(selectedOrders, status, note);

      if (response.ok) {
        alert(`${selectedOrders.length} orders updated to ${status}`);
        setSelectedOrders([]);
        fetchOrders();
      } else {
        alert(response.error || "Bulk update failed");
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      alert("Failed to update orders");
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ 
        ...prev, 
        page: prev.page - 1 
      }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination((prev) => ({ 
        ...prev, 
        page: prev.page + 1 
      }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-orange-100 text-orange-800",
      processing: "bg-blue-100 text-blue-800",
      packed: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentColor = (paymentStatus) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      partially_paid: "bg-yellow-100 text-yellow-800",
      unpaid: "bg-red-100 text-red-800",
    };
    return colors[paymentStatus] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all orders from admin panel
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-500 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-orange-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-500 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-500 mb-1">Shipped</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.shipped}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-500 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900 placeholder:text-gray-400"
          />

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900"
          >
            <option value="" className="text-gray-500">All Status</option>
            <option value="confirmed" className="text-gray-900">Confirmed</option>
            <option value="processing" className="text-gray-900">Processing</option>
            <option value="packed" className="text-gray-900">Packed</option>
            <option value="shipped" className="text-gray-900">Shipped</option>
            <option value="delivered" className="text-gray-900">Delivered</option>
            <option value="cancelled" className="text-gray-900">Cancelled</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900"
          >
            <option value="" className="text-gray-500">All Payments</option>
            <option value="paid" className="text-gray-900">Paid</option>
            <option value="partially_paid" className="text-gray-900">Partially Paid</option>
            <option value="unpaid" className="text-gray-900">Unpaid</option>
          </select>

          <input
            type="date"
            placeholder="From Date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900"
          />

          <input
            type="date"
            placeholder="To Date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-gray-900"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-medium text-blue-900">
              {selectedOrders.length} orders selected
            </p>
            <div className="flex flex-wrap gap-2">
              {/* ✅ NEW: Generate Bills Button */}
              <button
                onClick={handleBulkBill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Bills ({selectedOrders.length})
              </button>

              <button
                onClick={() => handleBulkUpdate("processing")}
                className="px-4 py-2 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                Mark Processing
              </button>
              <button
                onClick={() => handleBulkUpdate("packed")}
                className="px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 text-sm font-medium"
              >
                Mark Packed
              </button>
              <button
                onClick={handleBulkDispatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Bulk Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.buyerUserId?.name || "N/A"}</p>
                        <p className="text-xs text-gray-500">{order.buyerUserId?.phone || ""}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.products?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{((order.finalAmountPaise || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/orders/${order._id}/bill`)}
                          className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {Math.max(1, (pagination.page - 1) * pagination.limit + 1)} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} orders
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.page <= 1}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagination.page >= (pagination.pages || 1)}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
