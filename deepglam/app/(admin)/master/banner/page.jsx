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
