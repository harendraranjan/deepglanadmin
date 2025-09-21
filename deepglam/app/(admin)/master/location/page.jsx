// "use client";
// import { useEffect, useState } from "react";
// import {
//   getLocations,
//   createLocation,
//   deleteLocation,
// } from "@/services/masterService";

// export default function LocationPage() {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ pincode: "", city: "", state: "" });
//   const [submitting, setSubmitting] = useState(false);

//   const fetchLocations = async () => {
//     setLoading(true);
//     const res = await getLocations();
//     if (res.ok) setLocations(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!form.pincode.trim() || !form.city.trim() || !form.state.trim())
//       return alert("Enter complete location details");

//     setSubmitting(true);
//     const res = await createLocation(form);
//     if (res.ok) {
//       alert("Location added");
//       setForm({ pincode: "", city: "", state: "" });
//       fetchLocations();
//     } else {
//       alert(res.error);
//     }
//     setSubmitting(false);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this location?")) return;
//     const res = await deleteLocation(id);
//     if (res.ok) {
//       alert("Location deleted");
//       fetchLocations();
//     } else {
//       alert(res.error);
//     }
//   };

//   if (loading) return <p className="p-6">Loading locations...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Locations Management</h1>

//       {/* Add Location Form */}
//       <form
//         onSubmit={handleCreate}
//         className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
//       >
//         <input
//           type="text"
//           name="pincode"
//           placeholder="Pincode"
//           value={form.pincode}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={form.city}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="state"
//           placeholder="State"
//           value={form.state}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           disabled={submitting}
//           className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
//         >
//           {submitting ? "Adding..." : "Add"}
//         </button>
//       </form>

//       {/* Locations List */}
//       <table className="w-full border border-gray-200 text-sm">
//         <thead className="bg-gray-100 text-left">
//           <tr>
//             <th className="p-2">Pincode</th>
//             <th className="p-2">City</th>
//             <th className="p-2">State</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {locations.map((loc) => (
//             <tr key={loc._id} className="border-t">
//               <td className="p-2">{loc.pincode}</td>
//               <td className="p-2">{loc.city}</td>
//               <td className="p-2">{loc.state}</td>
//               <td className="p-2">
//                 <button
//                   onClick={() => handleDelete(loc._id)}
//                   className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { upsertLocation, getLocation } from "@/services/masterService";
import axios from "axios";

export default function LocationPage() {
  const [pincodeGet, setPincodeGet] = useState("");
  const [locationGet, setLocationGet] = useState(null);
  const [loadingGet, setLoadingGet] = useState(false);
  const [errorGet, setErrorGet] = useState("");

  const [formCreate, setFormCreate] = useState({ pincode: "", city: "", state: "" });
  const [locationCreate, setLocationCreate] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [messageCreate, setMessageCreate] = useState("");

  const [allPincodes, setAllPincodes] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);

  // ────────── Fetch single location by pincode ──────────
  const handleGetLocation = async () => {
    if (!pincodeGet) return setErrorGet("Enter pincode first");
    setLoadingGet(true);
    setErrorGet("");
    setLocationGet(null);

    const res = await getLocation(pincodeGet);
    setLoadingGet(false);

    if (res.ok) setLocationGet(res.data);
    else setErrorGet("Location not found");
  };

  // ────────── Create / Update location ──────────
  const handleCreateLocation = async () => {
    const { pincode, city, state } = formCreate;
    if (!pincode || !city || !state) {
      setMessageCreate("All fields are required");
      return;
    }

    setLoadingCreate(true);
    setMessageCreate("");
    setLocationCreate(null);

    const res = await upsertLocation(formCreate);
    setLoadingCreate(false);

    if (res.ok) {
      setLocationCreate(res.data);
      setMessageCreate("Location saved successfully!");
      setFormCreate({ pincode: "", city: "", state: "" });
      fetchAllPincodes(); // refresh after create
    } else {
      setMessageCreate("Error: " + res.error);
    }
  };

  // ────────── Fetch all pincodes from backend ──────────
  const fetchAllPincodes = async () => {
    setLoadingAll(true);
    try {
      const res = await axios.get("http://localhost:5000/api/master/pincodes");
      setAllPincodes(res.data);
    } catch (err) {
      console.error("Failed to fetch pincodes", err);
    }
    setLoadingAll(false);
  };

  useEffect(() => {
    fetchAllPincodes();
  }, []);

  // ────────── Styles ──────────
  const containerStyle = { maxWidth: "800px", margin: "50px auto", padding: "25px", fontFamily: "Arial, sans-serif" };
  const mainHeadingStyle = { textAlign: "center", fontSize: "32px", fontWeight: "bold", marginBottom: "40px", color: "#fff" };
  const cardStyle = { padding: "20px", borderRadius: "12px", backgroundColor: "#1a1a1a", border: "1px solid #333", marginBottom: "30px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", color: "#fff" };
  const inputStyle = { width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #555", borderRadius: "6px", fontSize: "16px", backgroundColor: "#333", color: "#fff" };
  const buttonStyle = { width: "100%", padding: "12px", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", marginBottom: "12px", transition: "background-color 0.3s, transform 0.2s" };
  const getButtonStyle = { ...buttonStyle, backgroundColor: "#6c63ff", color: "#fff" };
  const createButtonStyle = { ...buttonStyle, backgroundColor: "#28a745", color: "#fff" };
  const resultStyle = { padding: "15px", borderRadius: "8px", backgroundColor: "#333", border: "1px solid #555", marginTop: "10px", fontWeight: "500", color: "#fff" };
  const errorStyle = { color: "#ff4d4f", marginTop: "10px", textAlign: "center", fontWeight: "bold" };
  const messageStyle = { color: "#28a745", marginTop: "10px", textAlign: "center", fontWeight: "bold" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
  const thStyle = { border: "1px solid #555", padding: "8px", backgroundColor: "#333", color: "#fff" };
  const tdStyle = { border: "1px solid #555", padding: "8px", color: "#fff" };

  return (
    <div style={containerStyle}>
      <h1 style={mainHeadingStyle}>🌍 Location Management</h1>

      {/* Card 1: All Pincodes Table */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "15px", color: "#fff" }}>📋 All Pincodes</h2>
        {loadingAll ? (
          <p>Loading...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Pincode</th>
              </tr>
            </thead>
            <tbody>
              {allPincodes.map((pin, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{pin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card 2: Get Location */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "15px", color: "#fff" }}>📍 Get Location by Pincode</h2>
        <input style={inputStyle} placeholder="Enter Pincode" value={pincodeGet} onChange={(e) => setPincodeGet(e.target.value)} />
        <button style={getButtonStyle} onClick={handleGetLocation} disabled={loadingGet}>{loadingGet ? "Fetching..." : "Get Location"}</button>
        {errorGet && <div style={errorStyle}>{errorGet}</div>}
        {locationGet && (
          <div style={resultStyle}>
            <p><strong>Country:</strong> {locationGet.country || "India"}</p>
            <p><strong>State:</strong> {locationGet.state}</p>
            <p><strong>City:</strong> {locationGet.city}</p>
            <p><strong>Pincode:</strong> {locationGet.pincode}</p>
          </div>
        )}
      </div>

      {/* Card 3: Create / Update */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "15px", color: "#fff" }}>✏️ Create / Update Location</h2>
        <input style={inputStyle} placeholder="Pincode" value={formCreate.pincode} onChange={(e) => setFormCreate({ ...formCreate, pincode: e.target.value })} />
        <input style={inputStyle} placeholder="City" value={formCreate.city} onChange={(e) => setFormCreate({ ...formCreate, city: e.target.value })} />
        <input style={inputStyle} placeholder="State" value={formCreate.state} onChange={(e) => setFormCreate({ ...formCreate, state: e.target.value })} />
        <button style={createButtonStyle} onClick={handleCreateLocation} disabled={loadingCreate}>{loadingCreate ? "Saving..." : "Save / Update"}</button>
        {messageCreate && <div style={messageStyle}>{messageCreate}</div>}
        {locationCreate && (
          <div style={resultStyle}>
            <p><strong>Country:</strong> {locationCreate.country || "India"}</p>
            <p><strong>State:</strong> {locationCreate.state}</p>
            <p><strong>City:</strong> {locationCreate.city}</p>
            <p><strong>Pincode:</strong> {locationCreate.pincode}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        input::placeholder { color: #aaa; opacity: 1; }
      `}</style>
    </div>
  );
}
