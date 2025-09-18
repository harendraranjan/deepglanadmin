
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BuyerAddForm from "@/components/AddBuyerForm";

const API_URL = "https://deepglam.onrender.com/api/buyers"; 

export default function BuyersPage() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editBuyer, setEditBuyer] = useState(null);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};
  };

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers: getAuthHeaders() });
      setBuyers(res.data.data || []);
    } catch (err) {
      console.error("Fetch buyers error:", err);
      alert(err?.response?.data?.message || "Failed to fetch buyers");
    } finally {
      setLoading(false);
    }
  };

  

  const fetchBuyerOrders = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}/orders`, {
        headers: getAuthHeaders(),
      });
      setBuyerOrders(res.data.data || []);
    } catch (err) {
      alert("Failed to fetch orders");
    }
  };

  const updateBuyer = async (id, payload) => {
    try {
      await axios.patch(`${API_URL}/${id}`, payload, { headers: getAuthHeaders() });
      alert("Buyer updated successfully");
      fetchBuyers();
    } catch (err) {
      console.error(err?.response?.data);
      alert("Update failed: " + (err?.response?.data?.message || ""));
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter(
    (b) =>
      b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">👥 Buyers Management</h1>
        <div className="space-x-2">
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Buyer
          </button>
        </div>
      </div>

      {/* Inline Add Buyer Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Add New Buyer</h2>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
          <BuyerAddForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              fetchBuyers();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or shop..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredBuyers.length === 0 ? (
        <p>No buyers found</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow">
          <table className="w-full border-collapse text-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Shop</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuyers.map((buyer) => (
                <tr
                  key={buyer._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{buyer.userId?.name}</td>
                  <td className="p-3">{buyer.userId?.email}</td>
                  <td className="p-3">{buyer.shopName}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setSelectedBuyer(buyer)}
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => fetchBuyerOrders(buyer.userId._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setEditBuyer(buyer)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedBuyer(null)}
        >
          <div
            className="bg-gray-900 text-gray-100 w-2/3 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {selectedBuyer.userId?.name} — {selectedBuyer.shopName}
              </h2>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedBuyer.shopImage?.url && (
                <a href={selectedBuyer.shopImage.url} target="_blank" rel="noreferrer">
                  <img
                    src={selectedBuyer.shopImage.url}
                    alt="Shop"
                    className="w-40 h-40 object-cover rounded-lg mb-4 cursor-pointer"
                  />
                </a>
              )}

              <p><b>Email:</b> {selectedBuyer.userId?.email}</p>
              <p><b>Phone:</b> {selectedBuyer.userId?.phone}</p>
              <p><b>Employee Code:</b> {selectedBuyer.employeeCode}</p>
              <p><b>Gender:</b> {selectedBuyer.gender}</p>
              <p><b>Staff:</b> {selectedBuyer.staffUserId?.name} ({selectedBuyer.staffUserId?.phone})</p>

              <h3 className="font-bold mt-4">Shop Address</h3>
              <p>{selectedBuyer.shopAddress?.line1}, {selectedBuyer.shopAddress?.city}, {selectedBuyer.shopAddress?.state}, {selectedBuyer.shopAddress?.postalCode}, {selectedBuyer.shopAddress?.country}</p>

              <h3 className="font-bold mt-4">Bank Details</h3>
              <p><b>Bank:</b> {selectedBuyer.bankDetails?.bankName}</p>
              <p><b>Account No:</b> {selectedBuyer.bankDetails?.accountNumber}</p>
              <p><b>IFSC:</b> {selectedBuyer.bankDetails?.ifscCode}</p>
              <p><b>UPI:</b> {selectedBuyer.bankDetails?.upiId}</p>

              {selectedBuyer.documents?.length > 0 && (
                <>
                  <h3 className="font-bold mt-4">Documents</h3>
                  {selectedBuyer.documents.map((doc) => (
                    <div key={doc._id} className="mb-2">
                      <p><b>{doc.type}</b>: {doc.number}</p>
                      {doc.file?.url && (
                        <a href={doc.file.url} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                          View Document
                        </a>
                      )}
                    </div>
                  ))}
                </>
              )}

              <p><b>Credit Limit:</b> {selectedBuyer.creditLimit}</p>
              <p><b>Current Due:</b> {selectedBuyer.currentDue}</p>
              <p><b>Approval Status:</b> {selectedBuyer.approvalStatus}</p>
              <p><b>KYC Verified:</b> {selectedBuyer.kycVerified ? "Yes" : "No"}</p>
              <p><b>Created At:</b> {new Date(selectedBuyer.createdAt).toLocaleString()}</p>
              <p><b>Updated At:</b> {new Date(selectedBuyer.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Edit Modal */}
      {editBuyer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setEditBuyer(null)}
        >
          <div
            className="bg-gray-900 text-gray-100 w-2/3 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Edit Buyer</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const payload = Object.fromEntries(formData.entries());
                updateBuyer(editBuyer.userId._id, payload);
                setEditBuyer(null);
              }}
              className="space-y-4"
            >
              <input name="shopName" defaultValue={editBuyer.shopName} className="w-full p-2 rounded bg-gray-800" placeholder="Shop Name" />
              <input name="employeeCode" defaultValue={editBuyer.employeeCode} className="w-full p-2 rounded bg-gray-800" placeholder="Employee Code" />
              <input name="gender" defaultValue={editBuyer.gender} className="w-full p-2 rounded bg-gray-800" placeholder="Gender" />
              <input name="shopAddress.line1" defaultValue={editBuyer.shopAddress?.line1} className="w-full p-2 rounded bg-gray-800" placeholder="Address Line 1" />
              <input name="shopAddress.city" defaultValue={editBuyer.shopAddress?.city} className="w-full p-2 rounded bg-gray-800" placeholder="City" />
              <input name="shopAddress.state" defaultValue={editBuyer.shopAddress?.state} className="w-full p-2 rounded bg-gray-800" placeholder="State" />
              <input name="shopAddress.postalCode" defaultValue={editBuyer.shopAddress?.postalCode} className="w-full p-2 rounded bg-gray-800" placeholder="Postal Code" />
              <input name="shopAddress.country" defaultValue={editBuyer.shopAddress?.country} className="w-full p-2 rounded bg-gray-800" placeholder="Country" />
              <input name="bankDetails.bankName" defaultValue={editBuyer.bankDetails?.bankName} className="w-full p-2 rounded bg-gray-800" placeholder="Bank Name" />
              <input name="bankDetails.accountNumber" defaultValue={editBuyer.bankDetails?.accountNumber} className="w-full p-2 rounded bg-gray-800" placeholder="Account Number" />
              <input name="bankDetails.ifscCode" defaultValue={editBuyer.bankDetails?.ifscCode} className="w-full p-2 rounded bg-gray-800" placeholder="IFSC Code" />
              <input name="bankDetails.upiId" defaultValue={editBuyer.bankDetails?.upiId} className="w-full p-2 rounded bg-gray-800" placeholder="UPI ID" />

              <div className="flex space-x-2">
                <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                <button type="button" onClick={() => setEditBuyer(null)} className="bg-red-600 px-4 py-2 rounded text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buyer Orders Modal */}
      {buyerOrders.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setBuyerOrders([])}
        >
          <div
            className="bg-gray-900 text-gray-100 w-2/3 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">Buyer Orders</h2>
              <button
                onClick={() => setBuyerOrders([])}
                className="text-red-400 hover:text-red-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {buyerOrders.map((order) => (
                <div
                  key={order._id}
                  className="border-b border-gray-700 pb-2 mb-2"
                >
                  <p><b>Order ID:</b> {order._id}</p>
                  <p><b>Status:</b> {order.status}</p>
                  <p><b>Total:</b> {order.totalAmount}</p>
                  <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
