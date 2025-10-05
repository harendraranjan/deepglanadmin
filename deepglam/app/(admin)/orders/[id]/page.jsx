// app/(admin)/orders/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import orderService from "@/services/orderService";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(orderId);

      if (response.ok) {
        setOrder(response.data.order);
      } else {
        alert(response.error || "Failed to fetch order");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Fetch order error:", error);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Update order status to ${newStatus}?`)) return;

    try {
      setUpdating(true);
      const response = await orderService.updateStatus(orderId, {
        status: newStatus,
        note: `Status updated to ${newStatus}`,
      });

      if (response.ok) {
        alert("Order status updated successfully");
        fetchOrder();
      } else {
        alert(response.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async () => {
    const amount = prompt("Enter payment amount (₹):");
    if (!amount || isNaN(amount)) return;

    try {
      setUpdating(true);
      const response = await orderService.updatePayment(orderId, {
        paidAmount: parseFloat(amount),
        note: `Payment of ₹${amount} received`,
      });

      if (response.ok) {
        alert("Payment updated successfully");
        fetchOrder();
      } else {
        alert(response.error || "Failed to update payment");
      }
    } catch (error) {
      console.error("Update payment error:", error);
      alert("Failed to update payment");
    } finally {
      setUpdating(false);
    }
  };

  const handleDispatch = async () => {
    const courier = prompt("Enter courier name:", "Default Courier");
    if (!courier) return;

    try {
      setUpdating(true);
      const response = await orderService.markDispatched(orderId, {
        courier,
        note: "Order dispatched",
      });

      if (response.ok) {
        alert("Order dispatched successfully");
        fetchOrder();
      } else {
        alert(response.error || "Failed to dispatch order");
      }
    } catch (error) {
      console.error("Dispatch error:", error);
      alert("Failed to dispatch order");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      setUpdating(true);
      const response = await orderService.cancel(orderId, { reason });

      if (response.ok) {
        alert("Order cancelled successfully");
        fetchOrder();
      } else {
        alert(response.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-orange-100 text-orange-800 border-orange-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      packed: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentColor = (paymentStatus) => {
    const colors = {
      paid: "bg-green-100 text-green-800 border-green-200",
      partially_paid: "bg-yellow-100 text-yellow-800 border-yellow-200",
      unpaid: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[paymentStatus] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-orange-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500">Order not found</p>
          <button onClick={() => router.push("/orders")} className="mt-4 text-orange-600 hover:underline">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/orders")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-500 mt-1">Order #{order.orderNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getPaymentColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.products?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{((item.pricePerUnitPaise || 0) / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">per unit</p>
                      <p className="text-sm font-medium text-orange-600">
                        Total: ₹{((item.totalPaise || 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{order.deliveryAddress?.shopName}</p>
                <p className="text-gray-600">{order.deliveryAddress?.fullAddress}</p>
                <p className="text-gray-600">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.postalCode}
                </p>
                <p className="text-gray-600">{order.deliveryAddress?.country || "India"}</p>
              </div>
            </div>
          </div>

          {/* Status Logs */}
          {order.statusLogs && order.statusLogs.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.statusLogs.map((log, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-500">{log.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{((order.subtotalPaise || 0) / 100).toFixed(2)}
                </span>
              </div>
              {order.discountPaise > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -₹{((order.discountPaise || 0) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-medium text-gray-900">
                  ₹{((order.taxPaise || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-xl text-orange-600">
                  ₹{((order.finalAmountPaise || 0) / 100).toFixed(2)}
                </span>
              </div>
              {order.paidAmountPaise > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-medium text-green-600">
                      ₹{((order.paidAmountPaise || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-medium text-red-600">
                      ₹{((order.finalAmountPaise - order.paidAmountPaise) / 100).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Info</h3>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{order.buyerUserId?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{order.buyerUserId?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.buyerUserId?.email || "N/A"}</p>
              </div>
              {order.employeeCode && (
                <div>
                  <p className="text-sm text-gray-500">Employee Code</p>
                  <p className="font-medium text-gray-900">{order.employeeCode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
            </div>
            <div className="p-6 space-y-2">
              {/* ✅ NEW: Generate Bill Button */}
              <button
                onClick={() => router.push(`/orders/${orderId}/bill`)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Bill
              </button>

              {order.status === "confirmed" && (
                <button
                  onClick={() => handleStatusUpdate("processing")}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  Mark as Processing
                </button>
              )}
              {order.status === "processing" && (
                <button
                  onClick={() => handleStatusUpdate("packed")}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
                >
                  Mark as Packed
                </button>
              )}
              {order.status === "packed" && (
                <button
                  onClick={handleDispatch}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  Dispatch Order
                </button>
              )}
              {order.status === "shipped" && (
                <button
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  Mark as Delivered
                </button>
              )}
              {order.paymentStatus !== "paid" && (
                <button
                  onClick={handlePaymentUpdate}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  Update Payment
                </button>
              )}
              {!["shipped", "delivered", "cancelled"].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order Info</h3>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-gray-500">Notes</p>
                  <p className="font-medium text-gray-900">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
