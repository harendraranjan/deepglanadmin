
"use client";
import { useEffect, useState } from "react";
import Image from "next/image"; // required for optimized image
import QRCode from "qrcode";
import { toWords } from "number-to-words";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://deepglam.onrender.com/api/orders", {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(data.items || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center text-orange-500">Loading orders...</p>;
  if (!orders?.length)
    return <p className="text-center text-orange-500">No orders found</p>;

  if (selectedOrder) {
    const order = selectedOrder;
    const buyer = order.buyerId || {};
    const seller = {
      name: "Glamella Private Limited",
      gstNumber: "09AALCG6951G1Z7",
      phone: "+919876543210",
      address:
        "119/509 A, First Floor Darshan Purwa, Kalpi Road, Kanpur, UP-208012",
    };

    const subTotal =
      order.products?.reduce((sum, p) => sum + (p.total || 0), 0) || 0;
    const taxableValue =
      order.products?.reduce(
        (sum, p) => sum + (p.amount || p.total || 0),
        0
      ) || 0;
    const gstAmount = order.gstAmount || 0;
    const shipping = order.shipping || 0;
    const roundOff = order.roundOff || 0;
    const coupon = order.couponAmount || 0;
    const grandTotal =
      order.finalAmount ||
      taxableValue + gstAmount + shipping + roundOff - coupon;

    const generateQr = async () => {
      const qrString = `upi://pay?pa=glamelia@okhdfcbank&pn=GLAMELIA PRIVATE LIMITED&am=${grandTotal}&cu=INR&tn=${order._id}`;
      const url = await QRCode.toDataURL(qrString);
      setQrCodeUrl(url);
    };
    generateQr();

    return (
      <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-0 print:m-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div className="flex gap-4 items-center">
            <Image src="/image.png" alt="Logo 1" width={160} height={60} />
            <Image
              src="/1.png"
              alt="Logo 2"
              width={160}
              height={60}
            />
          </div>
          <div className="text-right text-sm">
            <p>
              <strong>Invoice No:</strong> {order._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Order No:</strong>{" "}
              {order.orderNumber || order._id || "N/A"}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="flex justify-between gap-8 mb-6 text-sm">
          <div className="w-1/2">
            <h2 className="font-bold mb-1">DISPATCHED FROM</h2>
            <p>GSTIN: {seller.gstNumber}</p>
            <p>Phone: {seller.phone}</p>
            <p>Address: {seller.address}</p>
          </div>
          <div className="w-1/2">
            <h2 className="font-bold mb-1">BUYER (BILL TO / SHIP TO)</h2>
            <p>Name: {buyer.name || "-"}</p>
            <p>GSTIN: {buyer.gstNumber || "-"}</p>
            <p>Phone: {buyer.phone || "-"}</p>
            <p>
              Address:{" "}
              {buyer.fullAddress ||
                order.fullAddress ||
                "-"}, {order.city || ""}, {order.state || ""},{" "}
              {order.pincode || ""}
            </p>
          </div>
        </div>

        {/* Product Table */}
        <table className="w-full border text-sm border-collapse mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Sr</th>
              <th className="border px-2 py-1">Item</th>
              <th className="border px-2 py-1">HSN</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Disc %</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((p, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">
                  {p.product?.productname || "Unknown"}
                </td>
                <td className="border px-2 py-1">{p.product?.hsn || "-"}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
                <td className="border px-2 py-1">₹{p.price}</td>
                <td className="border px-2 py-1">₹{p.total}</td>
                <td className="border px-2 py-1">{p.discountPercent || 0}</td>
                <td className="border px-2 py-1">₹{p.amount || p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary & Tax */}
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p>
              <strong>Sub Total:</strong> ₹{subTotal}
            </p>
            <p>
              <strong>Discount (Products):</strong> Included
            </p>
            <p>
              <strong>Taxable Value:</strong> ₹{taxableValue}
            </p>
          </div>
          <div>
            <p>
              <strong>IGST (5%):</strong> ₹{gstAmount}
            </p>
            <p>
              <strong>Coupon:</strong> ₹{coupon}
            </p>
            <p>
              <strong>Shipping:</strong> ₹{shipping}
            </p>
            <p>
              <strong>Round Off:</strong> ₹{roundOff}
            </p>
            <div className="bg-orange-500 text-white px-4 py-1 mt-2 text-lg font-semibold rounded inline-block">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <p className="mb-6 text-sm">
          <strong>Amount in words:</strong>{" "}
          {toWords(Math.round(grandTotal))} rupees only
        </p>

        {/* QR Code + Bank + Signatures */}
        <div className="flex justify-between gap-10 mb-6 text-sm">
          <div>
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mb-2" />
            )}
            <p className="text-xs">Scan to pay UPI</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Bank Details</h3>
            <p>Account Name: GLAMELIA PRIVATE LIMITED</p>
            <p>Bank: HDFC BANK</p>
            <p>Account No: 50200016189590</p>
            <p>IFSC: HDFC0000298</p>
            <p>UPI: glamelia@okhdfcbank</p>
          </div>
          <div className="flex flex-col justify-between text-sm">
            <p>Receiver's Signature</p>
            <p>Authorized Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs border-t pt-3">
          <p className="font-bold">Glamella Private Limited</p>
          <p>
            119/509 A, First Floor Darshan Purwa, Kalpi Road, Kanpur, UP-208012
          </p>
          <p>GSTIN: {seller.gstNumber}</p>
          <br />
          <p>Terms & Notes:</p>
          <p>1) Goods once sold will not be returned or exchanged</p>
          <p>2) Interest @18% p.a. will be charged if payment is delayed.</p>
          <p>3) Subject to seller’s jurisdiction</p>
          <p className="mt-1">
            Generated on {new Date().toLocaleString()}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 print:hidden space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Print
          </button>
          <button
            onClick={() => setSelectedOrder(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Default View - Order List
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        📦 Orders Management
      </h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-md p-4 bg-gray-800 shadow"
          >
            <h2 className="font-semibold text-lg">{order.buyerId?.name}</h2>
            <p>
              Email / Phone: {order.buyerId?.email} / {order.buyerId?.phone}
            </p>
            <p>
              Address: {order.fullAddress || "-"}, {order.city},{" "}
              {order.state}
            </p>
            <p>Status: {order.status}</p>
            <p>Final Amount: ₹{order.finalAmount}</p>

            <h3 className="mt-2 font-semibold">Products:</h3>
            <ul className="list-disc pl-6">
              {order.products?.map((p, idx) => (
                <li key={idx}>
                  {p.product?.productname || "Unknown"} × {p.quantity} = ₹
                  {p.total}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
            >
              Generate Bill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
 }

