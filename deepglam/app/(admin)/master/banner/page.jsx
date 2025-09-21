// "use client";
// import { useEffect, useState } from "react";
// import { getBanners, createBanner, deleteBanner } from "@/services/masterService";

// export default function BannerPage() {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ title: "", imageUrl: "", link: "" });
//   const [submitting, setSubmitting] = useState(false);

//   const fetchBanners = async () => {
//     setLoading(true);
//     const res = await getBanners();
//     if (res.ok) setBanners(res.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     const res = await createBanner(form);
//     if (res.ok) {
//       alert("Banner added!");
//       setForm({ title: "", imageUrl: "", link: "" });
//       fetchBanners();
//     } else {
//       alert(res.error);
//     }
//     setSubmitting(false);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this banner?")) return;
//     const res = await deleteBanner(id);
//     if (res.ok) {
//       alert("Deleted!");
//       fetchBanners();
//     } else {
//       alert(res.error);
//     }
//   };

//   if (loading) return <p className="p-6">Loading banners...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Banner Management</h1>

//       {/* Add Banner */}
//       <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="imageUrl"
//           placeholder="Image URL"
//           value={form.imageUrl}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="link"
//           placeholder="Link (optional)"
//           value={form.link}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           disabled={submitting}
//           className="col-span-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
//         >
//           {submitting ? "Adding..." : "Add Banner"}
//         </button>
//       </form>

//       {/* Banner List */}
//       <table className="w-full border border-gray-200 text-sm rounded-3xl">
//         <thead className="bg-gray-700 text-left rounded-3xl">
//           <tr>
//             <th className="p-2">Title</th>
//             <th className="p-2">Image</th>
//             <th className="p-2">Link</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {banners.map((b) => (
//             <tr key={b._id} className="border-t">
//               <td className="p-2">{b.title}</td>
//               <td className="p-2">
//                 <img src={b.imageUrl} alt={b.title} className="h-12 rounded" />
//               </td>
//               <td className="p-2">{b.link || "-"}</td>
//               <td className="p-2">
//                 <button
//                   onClick={() => handleDelete(b._id)}
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

import { useState } from "react";
import { upsertLocation, getLocation } from "@/services/masterService";

export default function LocationPage() {
  const [form, setForm] = useState({ pincode: "", city: "", state: "" });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLocation(null);

    const res = await upsertLocation(form);
    setLoading(false);

    if (res.ok) setLocation(res.data);
    else setError(res.error);
  };

  const handleSearch = async () => {
    if (!form.pincode) return setError("Enter pincode first");
    setLoading(true);
    setError("");
    setLocation(null);

    const res = await getLocation(form.pincode);
    setLoading(false);

    if (res.ok) setLocation(res.data);
    else setError(res.error);
  };

  // Inline styles
  const containerStyle = {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fefefe",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    backgroundColor: "#f9f9ff",
    transition: "border 0.3s",
    color: "#333", // input text color
  };

  const inputFocusStyle = {
    borderColor: "#6c63ff",
    outline: "none",
    boxShadow: "0 0 5px rgba(108, 99, 255, 0.5)"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "background-color 0.3s, transform 0.2s"
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c63ff",
    color: "#fff"
  };

  const searchButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff6584",
    color: "#fff"
  };

  const resultStyle = {
    padding: "18px",
    borderRadius: "10px",
    backgroundColor: "#f0f4ff",
    border: "1px solid #cce0ff",
    marginTop: "15px"
  };

  const errorStyle = {
    color: "#ff4d4f",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "bold"
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
        🌍 Location Management
      </h1>

      <form onSubmit={handleSave}>
        <input
          style={inputStyle}
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          required
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          className="custom-input"
        />
        <input
          style={inputStyle}
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          className="custom-input"
        />
        <input
          style={inputStyle}
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          required
          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          className="custom-input"
        />
        <button
          type="submit"
          style={saveButtonStyle}
          disabled={loading}
          onMouseOver={e => e.target.style.backgroundColor = "#574bff"}
          onMouseOut={e => e.target.style.backgroundColor = "#6c63ff"}
          onMouseDown={e => e.target.style.transform = "scale(0.97)"}
          onMouseUp={e => e.target.style.transform = "scale(1)"}
        >
          {loading ? "Saving..." : "Save / Update"}
        </button>
      </form>

      <button
        style={searchButtonStyle}
        onClick={handleSearch}
        disabled={loading}
        onMouseOver={e => e.target.style.backgroundColor = "#ff4a6e"}
        onMouseOut={e => e.target.style.backgroundColor = "#ff6584"}
        onMouseDown={e => e.target.style.transform = "scale(0.97)"}
        onMouseUp={e => e.target.style.transform = "scale(1)"}
      >
        {loading ? "Searching..." : "Get Location by Pincode"}
      </button>

      {error && <div style={errorStyle}>{error}</div>}

      {location && (
        <div style={resultStyle}>
          <h3 style={{ marginBottom: "8px", color: "#333" }}>Location Details:</h3>
          <p><strong>Country:</strong> {location.country || "India"}</p>
          <p><strong>State:</strong> {location.state}</p>
          <p><strong>City:</strong> {location.city}</p>
          <p><strong>Pincode:</strong> {location.pincode}</p>
        </div>
      )}

      {/* Dark placeholder color CSS */}
      <style jsx>{`
        .custom-input::placeholder {
          color: #555;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
