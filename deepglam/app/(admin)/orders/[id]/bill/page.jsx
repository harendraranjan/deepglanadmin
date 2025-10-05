// app/(admin)/orders/[id]/bill/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import orderService from "@/services/orderService";
import Image from "next/image";

export default function BillGenerationPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  const printRef = useRef();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billType, setBillType] = useState("full");
  const [customBillData, setCustomBillData] = useState(null);
  const [priceType, setPriceType] = useState("selling");

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
        setSelectedProducts(response.data.order.products.map(p => p._id || p.product));
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

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === order.products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(order.products.map(p => p._id || p.product));
    }
  };

  const calculateTotals = (products, type = priceType) => {
    const subtotal = products.reduce((sum, p) => {
      if (type === "purchase") {
        return sum + ((p.purchasePricePerUnitPaise || p.pricePerUnitPaise) * p.quantity);
      } else {
        return sum + (p.totalPaise || 0);
      }
    }, 0);
    
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return {
      subtotal: subtotal / 100,
      tax: tax / 100,
      total: total / 100
    };
  };

  const generateCustomBill = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    const filteredProducts = order.products.filter(p => 
      selectedProducts.includes(p._id || p.product)
    );

    const firstProduct = filteredProducts[0];
    const sellerDetails = firstProduct?.sellerDetails || null;

    const totals = calculateTotals(filteredProducts);

    setCustomBillData({
      billNumber: `BILL-${order.orderNumber}-CUSTOM-${priceType.toUpperCase()}`,
      orderNumber: order.orderNumber,
      date: new Date().toLocaleDateString("en-IN"),
      buyer: {
        name: order.buyerUserId?.name || "N/A",
        phone: order.buyerUserId?.phone || "N/A",
        email: order.buyerUserId?.email || "N/A",
        address: order.deliveryAddress,
      },
      products: filteredProducts,
      subtotal: totals.subtotal,
      discount: 0,
      tax: totals.tax,
      total: totals.total,
      paid: 0,
      remaining: totals.total,
      priceType: priceType,
      sellerDetails: sellerDetails
    });
    setBillType("custom");
  };

  const generateBrandBill = async (brand, sellerUserId) => {
    try {
      const response = await orderService.getBrandBill(orderId, { 
        brand, 
        sellerUserId,
        priceType
      });

      if (response.ok) {
        setCustomBillData({
          ...response.data,
          priceType: priceType
        });
        setBillType("brand");
      } else {
        alert(response.error || "Failed to generate brand bill");
      }
    } catch (error) {
      console.error("Generate brand bill error:", error);
      alert("Failed to generate brand bill");
    }
  };

  const generateFullBill = () => {
    const firstProduct = order.products[0];
    const sellerDetails = firstProduct?.sellerDetails || null;

    const totals = calculateTotals(order.products);

    setCustomBillData({
      billNumber: `BILL-${order.orderNumber}-${priceType.toUpperCase()}`,
      orderNumber: order.orderNumber,
      date: new Date().toLocaleDateString("en-IN"),
      buyer: {
        name: order.buyerUserId?.name || "N/A",
        phone: order.buyerUserId?.phone || "N/A",
        email: order.buyerUserId?.email || "N/A",
        address: order.deliveryAddress,
      },
      products: order.products || [],
      subtotal: totals.subtotal,
      discount: (order.discountPaise || 0) / 100,
      tax: totals.tax,
      total: totals.total,
      paid: (order.paidAmountPaise || 0) / 100,
      remaining: totals.total - ((order.paidAmountPaise || 0) / 100),
      priceType: priceType,
      sellerDetails: sellerDetails
    });
    setBillType("full");
    setSelectedProducts(order.products.map(p => p._id || p.product));
  };

  const handlePrint = () => {
    if (!customBillData) {
      alert("Please generate a bill first");
      return;
    }
    window.print();
  };

  const getBrandsList = () => {
    if (!order || !order.brandBreakdown) return [];
    return order.brandBreakdown.map((breakdown) => ({
      brand: breakdown.brand,
      sellerUserId: breakdown.sellerUserId?._id || breakdown.sellerUserId,
      sellerName: breakdown.sellerUserId?.name || breakdown.sellerUserId?.businessName || "Unknown",
      total: (breakdown.totalPaise || 0) / 100,
    }));
  };

  const getPricePerUnit = (product) => {
    if (customBillData?.priceType === "purchase") {
      return ((product.purchasePricePerUnitPaise || product.pricePerUnitPaise) / 100).toFixed(2);
    }
    return ((product.pricePerUnitPaise || 0) / 100).toFixed(2);
  };

  const getTotalPrice = (product) => {
    if (customBillData?.priceType === "purchase") {
      const price = (product.purchasePricePerUnitPaise || product.pricePerUnitPaise) * product.quantity;
      return (price / 100).toFixed(2);
    }
    return ((product.totalPaise || 0) / 100).toFixed(2);
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    
    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    
    let words = convert(rupees) + ' Rupees';
    if (paise > 0) words += ' and ' + convert(paise) + ' Paise';
    return words + ' Only';
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
            <p className="text-gray-500">Loading bill details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push(`/orders/${orderId}`)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bill Generation</h1>
                <p className="text-sm text-gray-500">
                  Order #{order?.orderNumber} • 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    priceType === "selling" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {priceType === "selling" ? "Selling Price" : "Purchase Price"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                disabled={!customBillData}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Bill Options */}
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6 space-y-6">
              {/* Price Type Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Price Type</h3>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    priceType === "selling" 
                      ? "bg-green-50 border-green-500" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="radio"
                      name="priceType"
                      value="selling"
                      checked={priceType === "selling"}
                      onChange={(e) => setPriceType(e.target.value)}
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Selling Price</p>
                      <p className="text-xs text-gray-500">Customer invoice price</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    priceType === "purchase" 
                      ? "bg-blue-50 border-blue-500" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="radio"
                      name="priceType"
                      value="purchase"
                      checked={priceType === "purchase"}
                      onChange={(e) => setPriceType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Purchase Price</p>
                      <p className="text-xs text-gray-500">Cost price / Vendor price</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Full Bill */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Bills</h3>
                <button
                  onClick={generateFullBill}
                  className={`w-full px-4 py-3 text-left rounded-lg border transition-colors ${
                    billType === "full"
                      ? "bg-orange-50 border-orange-500 text-orange-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">Full Order Bill</div>
                  <div className="text-xs mt-1 opacity-75">All {order?.products?.length} products</div>
                </button>
              </div>

              {/* Custom Bill with Product Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Custom Bill</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Select Products</span>
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedProducts.length === order?.products?.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {order?.products?.map((product, index) => (
                      <label
                        key={index}
                        className="flex items-start gap-2 p-2 hover:bg-blue-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id || product.product)}
                          onChange={() => toggleProductSelection(product._id || product.product)}
                          className="mt-1 w-4 h-4 rounded border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.productName}</p>
                          <p className="text-xs text-gray-500">{product.brand} • Qty: {product.quantity}</p>
                          <p className="text-xs font-semibold text-blue-600">
                            ₹{priceType === "purchase" 
                              ? (((product.purchasePricePerUnitPaise || product.pricePerUnitPaise) * product.quantity) / 100).toFixed(2)
                              : ((product.totalPaise || 0) / 100).toFixed(2)
                            }
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={generateCustomBill}
                    disabled={selectedProducts.length === 0}
                    className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                  >
                    Generate Custom Bill ({selectedProducts.length})
                  </button>
                </div>
              </div>

              {/* Brand-wise Bills */}
              {getBrandsList().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Brand-wise Bills</h3>
                  <div className="space-y-2">
                    {getBrandsList().map((item, index) => (
                      <button
                        key={index}
                        onClick={() => generateBrandBill(item.brand, item.sellerUserId)}
                        className={`w-full px-4 py-3 text-left rounded-lg border transition-colors ${
                          billType === "brand" && customBillData?.brand === item.brand
                            ? "bg-purple-50 border-purple-500 text-purple-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{item.brand}</div>
                        <div className="text-xs mt-1 opacity-75">{item.sellerName}</div>
                        <div className="text-sm mt-1 font-semibold">₹{item.total.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bill Preview */}
          <div className="lg:col-span-3">
            {!customBillData ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bill Generated</h3>
                <p className="text-gray-500">Select a bill type from the sidebar to preview</p>
              </div>
            ) : (
              <div ref={printRef} id="bill-area" className="bg-white shadow-lg print:shadow-none border-2 border-gray-300" style={{ maxWidth: '210mm', margin: '0 auto' }}>
                {/* Header with Logo */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex items-center justify-between print:bg-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-md">
                      <Image 
                        src="/image.png" 
                        alt="DeepGlam Logo" 
                        width={60} 
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-white print:text-black">
                      <h1 className="text-3xl font-bold">DeepGlam</h1>
                      
                    </div>
                  </div>
                  <div className="text-right text-white print:text-black">
                    <p className="text-2xl font-bold">INVOICE</p>
                    <p className="text-sm">Tax Invoice</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="p-6 bg-gray-100 border-b-2 border-gray-400">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Order No:</p>
                      <p className="text-sm font-bold text-black">{customBillData?.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Invoice No:</p>
                      <p className="text-sm font-bold text-black">{customBillData?.billNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Date:</p>
                    <p className="text-sm font-bold text-black">{customBillData?.date}</p>
                  </div>
                </div>

                {/* Company & Buyer Details */}
                <div className="p-6 grid grid-cols-2 gap-6 border-b-2 border-gray-300">
                  {/* Seller Details */}
                  <div className="border-r-2 border-gray-300 pr-6">
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <h3 className="text-xs font-bold text-black uppercase mb-2 border-b border-orange-300 pb-1">Seller Details</h3>
                      {customBillData?.sellerDetails ? (
                        <>
                          <p className="text-sm font-bold text-black">{customBillData.sellerDetails.brandName}</p>
                          <p className="text-xs text-gray-800 mt-1">{customBillData.sellerDetails.address?.line1}</p>
                          {customBillData.sellerDetails.address?.line2 && (
                            <p className="text-xs text-gray-800">{customBillData.sellerDetails.address.line2}</p>
                          )}
                          <p className="text-xs text-gray-800">
                            {customBillData.sellerDetails.address?.city}, {customBillData.sellerDetails.address?.state} - {customBillData.sellerDetails.address?.postalCode}
                          </p>
                          {customBillData.sellerDetails.gstNumber && (
                            <p className="text-xs text-black font-semibold mt-1">GSTIN: {customBillData.sellerDetails.gstNumber}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-black">DeepGlam Private Limited</p>
                          <p className="text-xs text-gray-800 mt-1">123, Business Park, Mumbai</p>
                          <p className="text-xs text-gray-800">Maharashtra - 400001, India</p>
                          <p className="text-xs text-black font-semibold mt-1">GSTIN: 27AABCD1234E1Z5</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h3 className="text-xs font-bold text-black uppercase mb-2 border-b border-blue-300 pb-1">Buyer (Bill To)</h3>
                      <p className="text-sm font-bold text-black">{customBillData?.buyer?.name}</p>
                      <p className="text-xs text-gray-800 mt-1">{customBillData?.buyer?.address?.shopName}</p>
                      <p className="text-xs text-gray-800">{customBillData?.buyer?.address?.fullAddress}</p>
                      <p className="text-xs text-gray-800">
                        {customBillData?.buyer?.address?.city}, {customBillData?.buyer?.address?.state} - {customBillData?.buyer?.address?.postalCode}
                      </p>
                      <p className="text-xs text-black font-semibold mt-1">Phone: {customBillData?.buyer?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="p-6">
                  <table className="w-full text-xs border-2 border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 font-bold border-r-2 border-black text-black">Sr.No.</th>
                        <th className="text-left p-2 font-bold border-r-2 border-black text-black">Product</th>
                        <th className="text-center p-2 font-bold border-r-2 border-black text-black">HSN/SAC</th>
                        <th className="text-center p-2 font-bold border-r-2 border-black text-black">Qty</th>
                        <th className="text-right p-2 font-bold border-r-2 border-black text-black">
                          {customBillData?.priceType === "purchase" ? "Purchase Price" : "Price"}
                        </th>
                        <th className="text-right p-2 font-bold border-r-2 border-black text-black">Total Amt</th>
                        <th className="text-center p-2 font-bold border-r-2 border-black text-black">Per</th>
                        <th className="text-right p-2 font-bold border-r-2 border-black text-black">Disc %</th>
                        <th className="text-right p-2 font-bold text-black">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customBillData?.products?.map((product, index) => {
                        const pricePerUnit = getPricePerUnit(product);
                        const totalPrice = getTotalPrice(product);
                        const taxAmount = (parseFloat(totalPrice) * 0.18).toFixed(2);
                        const finalAmount = (parseFloat(totalPrice) + parseFloat(taxAmount)).toFixed(2);
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-2 text-black border-r border-t border-black">{index + 1}</td>
                            <td className="p-2 border-r border-t border-black">
                              <p className="text-black font-semibold">{product.productName || product.name}</p>
                              <p className="text-gray-700 text-[10px]">{product.brand}</p>
                            </td>
                            <td className="p-2 text-center text-black border-r border-t border-black">6203</td>
                            <td className="p-2 text-center text-black font-semibold border-r border-t border-black">{product.quantity}</td>
                            <td className="p-2 text-right text-black border-r border-t border-black">₹{pricePerUnit}</td>
                            <td className="p-2 text-right text-black font-semibold border-r border-t border-black">₹{totalPrice}</td>
                            <td className="p-2 text-center text-black border-r border-t border-black">PCS</td>
                            <td className="p-2 text-right text-black border-r border-t border-black">0.00</td>
                            <td className="p-2 text-right text-black font-bold border-t border-black">₹{finalAmount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tax Breakdown */}
                <div className="px-6 pb-4">
                  <table className="w-full text-xs border-2 border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 border-r border-black text-black font-bold">HSN/SAC</th>
                        <th className="text-right p-2 border-r border-black text-black font-bold">Taxable Value</th>
                        <th className="text-center p-2 border-r border-black text-black font-bold" colSpan="2">Central Tax</th>
                        <th className="text-center p-2 border-r border-black text-black font-bold" colSpan="2">State Tax</th>
                        <th className="text-right p-2 text-black font-bold">Total Tax</th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="p-2 border-r border-t border-black"></th>
                        <th className="p-2 border-r border-t border-black"></th>
                        <th className="text-center p-2 border-r border-t border-black text-[10px] text-black">Rate</th>
                        <th className="text-center p-2 border-r border-t border-black text-[10px] text-black">Amount</th>
                        <th className="text-center p-2 border-r border-t border-black text-[10px] text-black">Rate</th>
                        <th className="text-center p-2 border-r border-t border-black text-[10px] text-black">Amount</th>
                        <th className="p-2 border-t border-black"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-t border-black text-black">6203</td>
                        <td className="p-2 text-right border-r border-t border-black text-black">₹{customBillData?.subtotal?.toFixed(2)}</td>
                        <td className="p-2 text-center border-r border-t border-black text-black">9.00%</td>
                        <td className="p-2 text-right border-r border-t border-black text-black">₹{(customBillData?.tax / 2)?.toFixed(2)}</td>
                        <td className="p-2 text-center border-r border-t border-black text-black">9.00%</td>
                        <td className="p-2 text-right border-r border-t border-black text-black">₹{(customBillData?.tax / 2)?.toFixed(2)}</td>
                        <td className="p-2 text-right border-t border-black text-black font-bold">₹{customBillData?.tax?.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-gray-200">
                        <td className="p-2 border-r border-t border-black text-black font-bold">Total</td>
                        <td className="p-2 text-right border-r border-t border-black text-black font-bold">₹{customBillData?.subtotal?.toFixed(2)}</td>
                        <td className="p-2 border-r border-t border-black"></td>
                        <td className="p-2 text-right border-r border-t border-black text-black font-bold">₹{(customBillData?.tax / 2)?.toFixed(2)}</td>
                        <td className="p-2 border-r border-t border-black"></td>
                        <td className="p-2 text-right border-r border-t border-black text-black font-bold">₹{(customBillData?.tax / 2)?.toFixed(2)}</td>
                        <td className="p-2 text-right border-t border-black text-black font-bold">₹{customBillData?.tax?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Grand Total */}
                <div className="px-6 pb-6">
                  <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-black">Grand Total (in words):</p>
                      <p className="text-sm font-bold text-black">Grand Total: ₹{customBillData?.total?.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-black capitalize">
                      {numberToWords(customBillData?.total)}
                    </p>
                  </div>
                </div>

                {/* Bank Details & Declaration */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-6">
                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                    <h3 className="text-xs font-bold text-black mb-2 border-b border-blue-400 pb-1">Company's Bank Details</h3>
                    <p className="text-xs text-black">A/c Holder: <span className="font-bold">DEEPGLAM PRIVATE LIMITED</span></p>
                    <p className="text-xs text-black">Bank: <span className="font-bold">HDFC BANK</span></p>
                    <p className="text-xs text-black">A/c No.: <span className="font-bold">50200106185909</span></p>
                    <p className="text-xs text-black">Branch & IFSC: <span className="font-bold">GOVIND NAGAR & HDFC0000298</span></p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-400">
                    <h3 className="text-xs font-bold text-black mb-2 border-b border-gray-500 pb-1">Declaration</h3>
                    <p className="text-xs text-black leading-relaxed">
                      We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                    </p>
                    {customBillData?.priceType === "purchase" && (
                      <p className="text-xs text-blue-800 font-bold mt-2">
                        PURCHASE PRICE INVOICE - FOR INTERNAL USE ONLY
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center print:bg-gray-300 border-t-2 border-black">
                  <p className="text-white print:text-black text-xs font-bold">For DEEPGLAM PRIVATE LIMITED</p>
                  <div className="mt-6 mb-2">
                    <p className="text-white print:text-black text-xs">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #bill-area,
          #bill-area * {
            visibility: visible;
          }
          #bill-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
          }
          
          /* Force print colors - Light backgrounds with dark text */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Table borders - must be visible */
          table, th, td {
            border-color: #000 !important;
          }
          
          /* All text must be black */
          .text-black {
            color: #000 !important;
          }
          
          .text-gray-700,
          .text-gray-800 {
            color: #333 !important;
          }
          
          /* Keep light backgrounds for readability */
          .bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .bg-gray-200 {
            background-color: #e5e7eb !important;
          }
          .bg-orange-50 {
            background-color: #fff7ed !important;
          }
          .bg-orange-100 {
            background-color: #ffedd5 !important;
          }
          .bg-blue-50 {
            background-color: #eff6ff !important;
          }
          .bg-blue-100 {
            background-color: #dbeafe !important;
          }
          
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
