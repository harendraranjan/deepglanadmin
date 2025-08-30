"use client";
import { useEffect, useMemo, useState } from "react";
import { createProduct } from "@/services/productService";
// brand is manual now, so we don't fetch master brands
import { getSellers } from "@/services/sellerService";

/* ===== App-like enums (same as mobile) ===== */
const MAIN_CATEGORIES = ["Clothing"];
const SUB_CATEGORIES = ["men", "women", "kids"];
const PRODUCT_TYPES = [
  "formal",
  "casual",
  "traditional",
  "partywear",
  "festive",
  "ethnic",
  "western",
];
const GST_TYPES = ["inclusive", "exclusive"];

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME || "dy17rcawq";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_PRESET || "deepglam_unsigned";
const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function uploadUnsigned(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "deepglam/products");
  const r = await fetch(CLOUD_URL, { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || j?.message || "Upload failed");
  return j.secure_url;
}

export default function AddProductPage() {
  const [form, setForm] = useState({
    productname: "",
    mainCategory: MAIN_CATEGORIES[0] || "",
    subCategory: "",
    productType: "",
    MOQ: 1,
    purchasePrice: "",
    margin: "",
    mrp: "",
    discountPercentage: "",
    discountAmount: "", // Added this field like mobile version
    gstPercentage: "",
    gstType: "exclusive",
    stock: "",
    brand: "",        
    sellerId: "",
    description: "",
    sizes: "",
    colors: "",
    hsnCode: "",
  });

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Images - Fixed structure
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainPreview, setMainPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    (async () => {
      const sellerRes = await getSellers();
      if (sellerRes?.ok) setSellers(sellerRes.data || []);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPickMain = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Revoke previous URL to prevent memory leak
    if (mainPreview) URL.revokeObjectURL(mainPreview);
    
    setMainImageFile(f);
    setMainPreview(URL.createObjectURL(f));
  };

  // FIXED: Multiple image selection
  const onPickGallery = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    // Revoke previous URLs to prevent memory leak
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));

    // Merge with existing files, limit to 10 total
    const allFiles = [...galleryFiles, ...newFiles];
    const limitedFiles = allFiles.slice(0, 10);
    
    // Create new preview URLs
    const newPreviews = limitedFiles.map((f) => URL.createObjectURL(f));
    
    setGalleryFiles(limitedFiles);
    setGalleryPreviews(newPreviews);
    
    // Reset the input to allow selecting the same files again if needed
    e.target.value = '';
  };

  const removeGalleryAt = (idx) => {
    // Revoke the URL being removed
    if (galleryPreviews[idx]) {
      URL.revokeObjectURL(galleryPreviews[idx]);
    }
    
    const newFiles = [...galleryFiles];
    const newPreviews = [...galleryPreviews];
    
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mainPreview) URL.revokeObjectURL(mainPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // Fixed price calculation to match mobile version exactly
  const pricePreview = useMemo(() => {
    const price = Number(form.purchasePrice || 0);
    const marginPct = Number(form.margin || 0);
    const basePrice = price + (marginPct / 100) * price;
    
    const discPct = Number(form.discountPercentage || 0);
    const discAmtPref = form.discountAmount ? Number(form.discountAmount) : 0;
    const priceAfterDiscount = basePrice - (discPct ? (basePrice * discPct) / 100 : discAmtPref);
    
    const gstPct = Number(form.gstPercentage || 0);
    const gstAmt = form.gstType === 'inclusive'
      ? priceAfterDiscount - (priceAfterDiscount / (1 + gstPct / 100))
      : (priceAfterDiscount * gstPct) / 100;
    const finalPrice = form.gstType === 'inclusive'
      ? priceAfterDiscount
      : priceAfterDiscount + gstAmt;

    const moqNum = Number(form.MOQ || 0);
    const baseTotal = basePrice * moqNum;
    const afterDiscTotal = priceAfterDiscount * moqNum;
    const gstAmtTotal = gstAmt * moqNum;
    const finalTotal = finalPrice * moqNum;

    return {
      base: basePrice,
      afterDisc: priceAfterDiscount,
      gst: gstAmt,
      final: finalPrice,
      baseTotal,
      afterDiscTotal,
      gstAmtTotal,
      finalTotal,
      moq: moqNum,
    };
  }, [form.purchasePrice, form.margin, form.discountPercentage, form.discountAmount, form.gstPercentage, form.gstType, form.MOQ]);

  const resetForm = () => {
    // Clean up URLs before reset
    if (mainPreview) URL.revokeObjectURL(mainPreview);
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));

    setForm({
      productname: "",
      mainCategory: MAIN_CATEGORIES[0] || "",
      subCategory: "",
      productType: "",
      MOQ: 1,
      purchasePrice: "",
      margin: "",
      mrp: "",
      discountPercentage: "",
      discountAmount: "",
      gstPercentage: "",
      gstType: "exclusive",
      stock: "",
      brand: "",
      sellerId: "",
      description: "",
      sizes: "",
      colors: "",
      hsnCode: "",
    });
    setMainImageFile(null);
    setMainPreview("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productname || !form.mainCategory || !form.subCategory || !form.productType) {
      alert("Please fill Product Name, Main & Sub Category, and Product Type.");
      return;
    }
    if (!form.purchasePrice) {
      alert("Purchase Price is required.");
      return;
    }
    if (!mainImageFile) {
      alert("Please pick a Main Image (Images section).");
      return;
    }

    setLoading(true);
    try {
      // Upload main image to Cloudinary
      const mainUrl = await uploadUnsigned(mainImageFile);
      
      // Upload gallery images to Cloudinary
      const galleryUrls = [];
      for (const file of galleryFiles) {
        const url = await uploadUnsigned(file);
        galleryUrls.push(url);
      }

      // Build payload exactly like mobile version
      const sizesArr = (form.sizes || "").split(",").map(s => s.trim()).filter(Boolean);
      const colorsArr = (form.colors || "").split(",").map(s => s.trim()).filter(Boolean);

      const body = {
        mainCategory: form.mainCategory,
        subCategory: form.subCategory,           // "men" | "women" | "kids"
        productType: form.productType,           // enums above
        productname: form.productname,
        hsnCode: form.hsnCode || "",
        MOQ: Number(form.MOQ || 0),
        purchasePrice: Number(form.purchasePrice || 0),
        margin: Number(form.margin || 0),
        discountPercentage: Number(form.discountPercentage || 0),
        discountAmount: Number(form.discountAmount || 0), // Added like mobile
        gstPercentage: Number(form.gstPercentage || 0),
        gstType: form.gstType,                   // "inclusive" | "exclusive"
        stock: Number(form.stock || 0),
        brand: form.brand,                       // manual entry ✅
        sellerId: form.sellerId || undefined,    // optional
        sizes: sizesArr,
        colors: colorsArr,
        description: form.description,
        mainImage: { url: mainUrl },             // backend expects object with url
        images: galleryUrls.map(u => ({ url: u })), // array of {url} objects
      };

      const res = await createProduct(body);
      if (!res?.ok) throw new Error(res?.error || "Create failed");

      alert("✅ Product created successfully");
      resetForm();
    } catch (err) {
      console.error("Product creation error:", err);
      alert(err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product (Admin)</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded shadow"
      >
        {/* Product Name */}
        <input
          type="text"
          name="productname"
          placeholder="Product Name"
          value={form.productname}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Main Category (dropdown) */}
        <select
          name="mainCategory"
          value={form.mainCategory}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Main Category</option>
          {MAIN_CATEGORIES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Sub Category (dropdown) */}
        <select
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Sub Category</option>
          {SUB_CATEGORIES.map((v) => (
            <option key={v} value={v}>{cap(v)}</option>
          ))}
        </select>

        {/* Product Type (dropdown) */}
        <select
          name="productType"
          value={form.productType}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Product Type</option>
          {PRODUCT_TYPES.map((v) => (
            <option key={v} value={v}>{cap(v)}</option>
          ))}
        </select>

        {/* MOQ */}
        <input
          type="number"
          name="MOQ"
          placeholder="MOQ"
          value={form.MOQ}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Purchase Price */}
        <input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Margin (%) */}
        <input
          type="number"
          name="margin"
          placeholder="Margin (%)"
          value={form.margin}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* MRP */}
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={form.mrp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Discount % */}
        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Discount Amount - Added like mobile version */}
        <input
          type="number"
          name="discountAmount"
          placeholder="Discount Amount (optional)"
          value={form.discountAmount}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* GST % */}
        <input
          type="number"
          name="gstPercentage"
          placeholder="GST %"
          value={form.gstPercentage}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* GST Type (dropdown) */}
        <select
          name="gstType"
          value={form.gstType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">GST Type</option>
          {GST_TYPES.map((v) => (
            <option key={v} value={v}>{cap(v)}</option>
          ))}
        </select>

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Brand (manual entry) */}
        <input
          type="text"
          name="brand"
          placeholder="Enter Brand Name"
          value={form.brand}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Seller (from service) */}
        <select
          name="sellerId"
          value={form.sellerId}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Assign Seller</option>
          {sellers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.brandName || s.email}
            </option>
          ))}
        </select>

        {/* HSN Code */}
        <input
          type="text"
          name="hsnCode"
          placeholder="HSN Code"
          value={form.hsnCode}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Optional free text: sizes / colors */}
        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated)"
          value={form.sizes}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
        />
        <input
          type="text"
          name="colors"
          placeholder="Colors (comma separated)"
          value={form.colors}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          rows={3}
        />

        {/* ===== Price Preview (matching mobile exactly) ===== */}
        <div className="col-span-full grid gap-2 bg-gray-50 border rounded p-4">
          <div className="font-semibold text-gray-700">Per Unit</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Chip label="Base" value={pricePreview.base} />
            <Chip label="After Disc." value={pricePreview.afterDisc} />
            <Chip label={form.gstType === "inclusive" ? "GST part" : "GST"} value={pricePreview.gst} />
            <Chip label="Final" value={pricePreview.final} strong />
          </div>
          <div className="font-semibold mt-3 text-gray-700">Total @ MOQ ({pricePreview.moq || 0} units)</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Chip label="Base×MOQ" value={pricePreview.baseTotal} />
            <Chip label="After Disc.×MOQ" value={pricePreview.afterDiscTotal} />
            <Chip label={form.gstType === "inclusive" ? "GST part×MOQ" : "GST×MOQ"} value={pricePreview.gstAmtTotal} />
            <Chip label="Final×MOQ" value={pricePreview.finalTotal} strong />
          </div>
        </div>

        {/* ===== IMAGES (Enhanced) ===== */}
        <details className="col-span-full bg-white border rounded-lg" open>
          <summary className="list-none cursor-pointer select-none px-4 py-3 border-b flex items-center justify-between hover:bg-gray-50">
            <span className="font-semibold">Images</span>
            <span className="text-sm text-gray-500">
              {galleryFiles.length > 0 ? `${galleryFiles.length}/10 selected` : "Click to add images"}
            </span>
          </summary>

          <div className="p-4 grid gap-6">
            {/* Main Image */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-700">Main Image *</label>
                <label className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Choose Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={onPickMain} 
                  />
                </label>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-gray-50">
                {mainPreview ? (
                  <div className="relative">
                    <img 
                      src={mainPreview} 
                      alt="main preview" 
                      className="rounded-lg max-h-48 object-cover shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(mainPreview);
                        setMainImageFile(null);
                        setMainPreview("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Upload main product image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images - FIXED */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-700">
                  Gallery Images ({galleryFiles.length}/10)
                </label>
                <label className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Add Images</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={onPickGallery}
                  />
                </label>
              </div>

              {galleryPreviews?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {galleryPreviews.map((src, i) => (
                    <div key={`gallery-${i}`} className="relative group">
                      <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                        <img 
                          src={src} 
                          alt={`gallery-${i}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryAt(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500 text-sm">Add up to 10 gallery images</p>
                  <p className="text-gray-400 text-xs mt-1">Select multiple files at once</p>
                </div>
              )}
            </div>
          </div>
        </details>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-[#f26522] hover:bg-[#e55a1f] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
}

/* Small chip for price preview */
function Chip({ label, value, strong }) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${
        strong 
          ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold" 
          : "bg-gray-50 border-gray-200 text-gray-800"
      }`}
    >
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-semibold">₹{Number(value || 0).toFixed(2)}</div>
    </div>
  );
}