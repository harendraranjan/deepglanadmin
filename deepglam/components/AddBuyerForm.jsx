// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import axios from "axios";

// /* ===== Cloudinary Configuration ===== */
// const CLOUD_NAME = "dy17rcawq";
// const PRESET = "deepglam_unsigned";
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// async function uploadToCloudinaryUnsigned(file, folder = "deepglam/buyers") {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("upload_preset", PRESET);
//   data.append("folder", folder);

//   const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
//   return { url: json.secure_url, public_id: json.public_id };
// }

// // ✅ Validation Schema
// const schema = Yup.object().shape({
//   name: Yup.string().required("Full Name is required"),
//   mobile: Yup.string()
//     .required("Mobile Number is required")
//     .matches(/^\d{10}$/, "Enter valid 10-digit mobile"),
//   email: Yup.string().email("Invalid email").nullable(),
//   password: Yup.string().min(6, "Password must be at least 6 characters").required(),
//   employeeCode: Yup.string().required("Employee Code is required"),
//   gender: Yup.string().required("Gender is required"),
//   shopName: Yup.string().required("Shop Name is required"),
//   shopAddressLine1: Yup.string().required("Address Line 1 is required"),
//   city: Yup.string().required("City is required"),
//   state: Yup.string().required("State is required"),
//   postalCode: Yup.string().length(6, "Postal Code must be 6 digits").required(),
//   shopImage: Yup.mixed().required("Shop image is required"),
//   documentImage: Yup.mixed().required("Document image is required"),
// });

// export default function BuyerRegisterPage() {
//   const [uploading, setUploading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // Auto-fill city/state from postal code
//   const postalCode = watch("postalCode");
//   useEffect(() => {
//     if (postalCode?.trim().length === 6) {
//       fetch(`https://api.postalpincode.in/pincode/${postalCode}`)
//         .then((res) => res.json())
//         .then((data) => {
//           const po = data?.[0]?.PostOffice?.[0];
//           if (po) {
//             setValue("city", po.District || "");
//             setValue("state", po.State || "");
//           }
//         });
//     }
//   }, [postalCode, setValue]);

//   const onSubmit = async (data) => {
//     try {
//       setUploading(true);

//       // Upload images
//       const shopImg = await uploadToCloudinaryUnsigned(data.shopImage[0], "deepglam/shops");
//       const docImg = await uploadToCloudinaryUnsigned(data.documentImage[0], "deepglam/docs");

//       const payload = {
//         name: data.name,
//         phone: data.mobile,
//         email: data.email,
//         password: data.password,
//         employeeCode: data.employeeCode,
//         gender: data.gender,
//         shopName: data.shopName,
//         shopImage: shopImg,
//         shopAddressLine1: data.shopAddressLine1,
//         shopAddressLine2: data.shopAddressLine2,
//         city: data.city,
//         state: data.state,
//         postalCode: data.postalCode,
//         country: "India",
//         documents: [
//           {
//             type: data.documentType,
//             number: data.documentNumber,
//             file: docImg,
//           },
//         ],
//         bankDetails: {
//           bankName: data.bankName,
//           branchName: data.branchName,
//           accountHolderName: data.accountHolderName,
//           accountNumber: data.accountNumber,
//           ifscCode: data.ifscCode,
//           upiId: data.upiId,
//         },
//       };

//       await axios.post("http://localhost:5000/api/buyers", payload);

//       alert("✅ Buyer registered successfully!");
//     } catch (err) {
//       console.error("Error:", err);
//       alert(err?.response?.data?.message || "Registration failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Tailwind styling matching React Native design
//   const inputClass = "w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-orange-400";
//   const labelClass = "block font-semibold mb-1 text-gray-700";
//   const errorClass = "text-red-500 text-sm mt-1";

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">🛍️ Create Buyer Account</h1>
//       <p className="text-gray-600 text-center mb-6">Fill all required fields to register</p>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Employee Code */}
//         <div>
//           <label className={labelClass}>Employee Code *</label>
//           <input {...register("employeeCode")} placeholder="e.g., EMP001" className={inputClass} />
//           <p className={errorClass}>{errors.employeeCode?.message}</p>
//         </div>

//         {/* Full Name */}
//         <div>
//           <label className={labelClass}>Full Name *</label>
//           <input {...register("name")} placeholder="Enter full name" className={inputClass} />
//           <p className={errorClass}>{errors.name?.message}</p>
//         </div>

//         {/* Mobile */}
//         <div>
//           <label className={labelClass}>Mobile Number *</label>
//           <input {...register("mobile")} placeholder="10-digit mobile" className={inputClass} />
//           <p className={errorClass}>{errors.mobile?.message}</p>
//         </div>

//         {/* Email */}
//         <div>
//           <label className={labelClass}>Email (Optional)</label>
//           <input {...register("email")} placeholder="your@email.com" className={inputClass} />
//         </div>

//         {/* Password */}
//         <div>
//           <label className={labelClass}>Password *</label>
//           <input type="password" {...register("password")} placeholder="Minimum 6 characters" className={inputClass} />
//           <p className={errorClass}>{errors.password?.message}</p>
//         </div>

//         {/* Gender */}
//         <div>
//           <label className={labelClass}>Gender *</label>
//           <select {...register("gender")} className={inputClass}>
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           <p className={errorClass}>{errors.gender?.message}</p>
//         </div>

//         {/* Shop Info */}
//         <div>
//           <label className={labelClass}>Shop Name *</label>
//           <input {...register("shopName")} className={inputClass} />
//         </div>
//         <div>
//           <label className={labelClass}>Address Line 1 *</label>
//           <input {...register("shopAddressLine1")} className={inputClass} />
//         </div>
//         <div>
//           <label className={labelClass}>Address Line 2</label>
//           <input {...register("shopAddressLine2")} className={inputClass} />
//         </div>
//         <div>
//           <label className={labelClass}>Postal Code *</label>
//           <input {...register("postalCode")} className={inputClass} />
//           <p className={errorClass}>{errors.postalCode?.message}</p>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className={labelClass}>City *</label>
//             <input {...register("city")} className={inputClass} readOnly />
//           </div>
//           <div>
//             <label className={labelClass}>State *</label>
//             <input {...register("state")} className={inputClass} readOnly />
//           </div>
//         </div>

//         {/* File Uploads */}
//         <div>
//           <label className={labelClass}>Shop Image *</label>
//           <input type="file" {...register("shopImage")} className="w-full" />
//           <p className={errorClass}>{errors.shopImage?.message}</p>
//         </div>

//         <div>
//           <label className={labelClass}>Document Type</label>
//           <select {...register("documentType")} className={inputClass}>
//             <option value="">Select Document</option>
//             <option value="AADHAAR">Aadhaar</option>
//             <option value="PAN">PAN</option>
//             <option value="GST">GST</option>
//             <option value="OTHER">Other</option>
//           </select>
//         </div>
//         <div>
//           <label className={labelClass}>Document Number</label>
//           <input {...register("documentNumber")} className={inputClass} />
//         </div>
//         <div>
//           <label className={labelClass}>Document Image *</label>
//           <input type="file" {...register("documentImage")} className="w-full" />
//           <p className={errorClass}>{errors.documentImage?.message}</p>
//         </div>

//         {/* Bank Details */}
//         <div className="text-gray-500 italic text-sm text-center mb-4">Bank details are optional</div>
//         <div className="grid grid-cols-2 gap-4">
//           <input {...register("bankName")} placeholder="Bank Name" className={inputClass} />
//           <input {...register("branchName")} placeholder="Branch Name" className={inputClass} />
//           <input {...register("accountHolderName")} placeholder="Account Holder Name" className={inputClass} />
//           <input {...register("accountNumber")} placeholder="Account Number" className={inputClass} />
//           <input {...register("ifscCode")} placeholder="IFSC Code" className={inputClass} />
//           <input {...register("upiId")} placeholder="UPI ID" className={inputClass} />
//         </div>

//         <button
//           type="submit"
//           disabled={uploading}
//           className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
//         >
//           {uploading ? "Creating Account..." : "Create Account"}
//         </button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

/* ===== Cloudinary Configuration ===== */
const CLOUD_NAME = "dy17rcawq";
const PRESET = "deepglam_unsigned";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function uploadToCloudinaryUnsigned(file, folder = "deepglam/buyers") {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", PRESET);
  data.append("folder", folder);

  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
  return { url: json.secure_url, public_id: json.public_id };
}

// ✅ Validation Schema
const schema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  mobile: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Enter valid 10-digit mobile"),
  email: Yup.string().email("Invalid email").nullable(),
  password: Yup.string().min(6, "Password must be at least 6 characters").required(),
  employeeCode: Yup.string().required("Employee Code is required"),
  gender: Yup.string().required("Gender is required"),
  shopName: Yup.string().required("Shop Name is required"),
  shopAddressLine1: Yup.string().required("Address Line 1 is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().length(6, "Postal Code must be 6 digits").required(),
  shopImage: Yup.mixed().required("Shop image is required"),
  documentImage: Yup.mixed().required("Document image is required"),
});

export default function BuyerRegisterPage() {
  const [uploading, setUploading] = useState(false);
  const [pincodes, setPincodes] = useState([]);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const postalCode = watch("postalCode");

  // 🔹 Fetch all saved pincodes from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/master/pincodes")
      .then((res) => setPincodes(res.data || []))
      .catch((err) => console.error("Failed to fetch pincodes:", err));
  }, []);

  // 🔹 Auto-fill city/state when postalCode changes
  useEffect(() => {
    if (postalCode?.trim().length === 6) {
      axios.get(`http://localhost:5000/api/master/location/${postalCode}`)
        .then((res) => {
          const loc = res.data;
          if (loc) {
            setValue("city", loc.city || "");
            setValue("state", loc.state || "");
          }
        })
        .catch((err) => {
          console.error("Location not found:", err);
          setValue("city", "");
          setValue("state", "");
        });
    } else {
      setValue("city", "");
      setValue("state", "");
    }
  }, [postalCode, setValue]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Upload images
      const shopImg = await uploadToCloudinaryUnsigned(data.shopImage[0], "deepglam/shops");
      const docImg = await uploadToCloudinaryUnsigned(data.documentImage[0], "deepglam/docs");

      const payload = {
        name: data.name,
        phone: data.mobile,
        email: data.email,
        password: data.password,
        employeeCode: data.employeeCode,
        gender: data.gender,
        shopName: data.shopName,
        shopImage: shopImg,
        shopAddressLine1: data.shopAddressLine1,
        shopAddressLine2: data.shopAddressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: "India",
        documents: [
          {
            type: data.documentType,
            number: data.documentNumber,
            file: docImg,
          },
        ],
        bankDetails: {
          bankName: data.bankName,
          branchName: data.branchName,
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          upiId: data.upiId,
        },
      };

      await axios.post("http://localhost:5000/api/buyers", payload);

      alert("✅ Buyer registered successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-orange-400";
  const labelClass = "block font-semibold mb-1 text-gray-700";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">🛍️ Create Buyer Account</h1>
      <p className="text-gray-600 text-center mb-6">Fill all required fields to register</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee Code */}
        <div>
          <label className={labelClass}>Employee Code *</label>
          <input {...register("employeeCode")} placeholder="e.g., EMP001" className={inputClass} />
          <p className={errorClass}>{errors.employeeCode?.message}</p>
        </div>

        {/* Full Name */}
        <div>
          <label className={labelClass}>Full Name *</label>
          <input {...register("name")} placeholder="Enter full name" className={inputClass} />
          <p className={errorClass}>{errors.name?.message}</p>
        </div>

        {/* Mobile */}
        <div>
          <label className={labelClass}>Mobile Number *</label>
          <input {...register("mobile")} placeholder="10-digit mobile" className={inputClass} />
          <p className={errorClass}>{errors.mobile?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email (Optional)</label>
          <input {...register("email")} placeholder="your@email.com" className={inputClass} />
        </div>

        {/* Password */}
        <div>
          <label className={labelClass}>Password *</label>
          <input type="password" {...register("password")} placeholder="Minimum 6 characters" className={inputClass} />
          <p className={errorClass}>{errors.password?.message}</p>
        </div>

        {/* Gender */}
        <div>
          <label className={labelClass}>Gender *</label>
          <select {...register("gender")} className={inputClass}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <p className={errorClass}>{errors.gender?.message}</p>
        </div>

        {/* Shop Info */}
        <div>
          <label className={labelClass}>Shop Name *</label>
          <input {...register("shopName")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Address Line 1 *</label>
          <input {...register("shopAddressLine1")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Address Line 2</label>
          <input {...register("shopAddressLine2")} className={inputClass} />
        </div>

        {/* Pincode Dropdown */}
        <div>
          <label className={labelClass}>Postal Code *</label>
          <select {...register("postalCode")} className={inputClass}>
            <option value="">Select Pincode</option>
            {pincodes.map((pin) => (
              <option key={pin} value={pin}>{pin}</option>
            ))}
          </select>
          <p className={errorClass}>{errors.postalCode?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City *</label>
            <input {...register("city")} className={inputClass} readOnly />
          </div>
          <div>
            <label className={labelClass}>State *</label>
            <input {...register("state")} className={inputClass} readOnly />
          </div>
        </div>

        {/* File Uploads */}
        <div>
          <label className={labelClass}>Shop Image *</label>
          <input type="file" {...register("shopImage")} className="w-full" />
          <p className={errorClass}>{errors.shopImage?.message}</p>
        </div>

        <div>
          <label className={labelClass}>Document Type</label>
          <select {...register("documentType")} className={inputClass}>
            <option value="">Select Document</option>
            <option value="AADHAAR">Aadhaar</option>
            <option value="PAN">PAN</option>
            <option value="GST">GST</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Document Number</label>
          <input {...register("documentNumber")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Document Image *</label>
          <input type="file" {...register("documentImage")} className="w-full" />
          <p className={errorClass}>{errors.documentImage?.message}</p>
        </div>

        {/* Bank Details */}
        <div className="text-gray-500 italic text-sm text-center mb-4">Bank details are optional</div>
        <div className="grid grid-cols-2 gap-4">
          <input {...register("bankName")} placeholder="Bank Name" className={inputClass} />
          <input {...register("branchName")} placeholder="Branch Name" className={inputClass} />
          <input {...register("accountHolderName")} placeholder="Account Holder Name" className={inputClass} />
          <input {...register("accountNumber")} placeholder="Account Number" className={inputClass} />
          <input {...register("ifscCode")} placeholder="IFSC Code" className={inputClass} />
          <input {...register("upiId")} placeholder="UPI ID" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {uploading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
