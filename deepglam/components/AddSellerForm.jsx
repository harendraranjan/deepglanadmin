// "use client";

// import { useState } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/sellers";

// export default function AddSellerForm({ onClose, onSuccess }) {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     password: "",
//     employeeCode: "",
//     gender: "",
//     shopName: "",
//     shopAddressLine1: "",
//     shopAddressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "",
//     documentType: "",
//     documentNumber: "",
//     bankName: "",
//     branchName: "",
//     accountHolderName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(API_URL, form);
//       alert("Seller created successfully");
//       onSuccess();
//     } catch (err) {
//       alert("Failed to create seller");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 text-white">
//       <input
//         name="name"
//         placeholder="Name"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="email"
//         placeholder="Email"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="phone"
//         placeholder="Phone"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="employeeCode"
//         placeholder="Employee Code"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="gender"
//         placeholder="Gender"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="shopName"
//         placeholder="Shop Name"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="shopAddressLine1"
//         placeholder="Shop Address Line 1"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="shopAddressLine2"
//         placeholder="Shop Address Line 2"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="city"
//         placeholder="City"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="state"
//         placeholder="State"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="postalCode"
//         placeholder="Postal Code"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="country"
//         placeholder="Country"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="documentType"
//         placeholder="Document Type"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="documentNumber"
//         placeholder="Document Number"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="bankName"
//         placeholder="Bank Name"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="branchName"
//         placeholder="Branch Name"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="accountHolderName"
//         placeholder="Account Holder Name"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="accountNumber"
//         placeholder="Account Number"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="ifscCode"
//         placeholder="IFSC Code"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <input
//         name="upiId"
//         placeholder="UPI ID"
//         onChange={handleChange}
//         className="w-full p-2 rounded bg-gray-700"
//       />

//       <div className="flex gap-2">
//         <button
//           type="submit"
//           className="bg-green-600 px-4 py-2 rounded text-white"
//         >
//           Save
//         </button>

//         <button
//           type="button"
//           onClick={onClose}
//           className="bg-red-600 px-4 py-2 rounded text-white"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/sellers";
const PINCODE_API = "http://localhost:5000/api/master/pincodes";
const LOCATION_API = "http://localhost:5000/api/master/location";

export default function AddSellerForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    employeeCode: "",
    gender: "",
    shopName: "",
    shopAddressLine1: "",
    shopAddressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    documentType: "",
    documentNumber: "",
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const [pincodes, setPincodes] = useState([]);

  // 🔹 Fetch all saved pincodes from backend
  useEffect(() => {
    axios.get(PINCODE_API)
      .then((res) => setPincodes(res.data || []))
      .catch((err) => console.error("Failed to fetch pincodes:", err));
  }, []);

  // 🔹 Auto-fill city/state when postalCode changes
  useEffect(() => {
    if (form.postalCode?.trim().length === 6) {
      axios.get(`${LOCATION_API}/${form.postalCode}`)
        .then((res) => {
          const loc = res.data;
          if (loc) {
            setForm((prev) => ({
              ...prev,
              city: loc.city || "",
              state: loc.state || "",
            }));
          }
        })
        .catch((err) => {
          console.error("Location not found:", err);
          setForm((prev) => ({ ...prev, city: "", state: "" }));
        });
    } else {
      setForm((prev) => ({ ...prev, city: "", state: "" }));
    }
  }, [form.postalCode]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      alert("✅ Seller created successfully");
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create seller");
    }
  };

  const inputClass = "w-full p-2 rounded bg-gray-700 text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <input name="name" placeholder="Name" onChange={handleChange} className={inputClass} />
      <input name="email" placeholder="Email" onChange={handleChange} className={inputClass} />
      <input name="phone" placeholder="Phone" onChange={handleChange} className={inputClass} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className={inputClass} />
      <input name="employeeCode" placeholder="Employee Code" onChange={handleChange} className={inputClass} />
      <input name="gender" placeholder="Gender" onChange={handleChange} className={inputClass} />
      <input name="shopName" placeholder="Shop Name" onChange={handleChange} className={inputClass} />
      <input name="shopAddressLine1" placeholder="Shop Address Line 1" onChange={handleChange} className={inputClass} />
      <input name="shopAddressLine2" placeholder="Shop Address Line 2" onChange={handleChange} className={inputClass} />

      {/* 🔹 Pincode Dropdown */}
      <select
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="">Select Pincode</option>
        {pincodes.map((pin) => (
          <option key={pin} value={pin}>{pin}</option>
        ))}
      </select>

      {/* 🔹 Auto-filled City/State */}
      <input name="city" placeholder="City" value={form.city} readOnly className={inputClass} />
      <input name="state" placeholder="State" value={form.state} readOnly className={inputClass} />

      <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className={inputClass} />
      <input name="documentType" placeholder="Document Type" onChange={handleChange} className={inputClass} />
      <input name="documentNumber" placeholder="Document Number" onChange={handleChange} className={inputClass} />
      <input name="bankName" placeholder="Bank Name" onChange={handleChange} className={inputClass} />
      <input name="branchName" placeholder="Branch Name" onChange={handleChange} className={inputClass} />
      <input name="accountHolderName" placeholder="Account Holder Name" onChange={handleChange} className={inputClass} />
      <input name="accountNumber" placeholder="Account Number" onChange={handleChange} className={inputClass} />
      <input name="ifscCode" placeholder="IFSC Code" onChange={handleChange} className={inputClass} />
      <input name="upiId" placeholder="UPI ID" onChange={handleChange} className={inputClass} />

      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
        <button type="button" onClick={onClose} className="bg-red-600 px-4 py-2 rounded text-white">Cancel</button>
      </div>
    </form>
  );
}
