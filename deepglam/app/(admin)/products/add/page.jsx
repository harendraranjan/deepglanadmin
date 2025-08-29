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

/* ===== Cloudinary (UNSIGNED) ===== */
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
    gstPercentage: "",
    gstType: "exclusive",
    stock: "",
    brand: "",        // manual entry
    sellerId: "",
    description: "",
    // optional free-texts if you want later
    sizes: "",
    colors: "",
    hsnCode: "",
  });

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Images
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
    setMainImageFile(f);
    setMainPreview(URL.createObjectURL(f));
  };

  const onPickGallery = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const merged = [...galleryFiles, ...files].slice(0, 10);
    setGalleryFiles(merged);
    setGalleryPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const removeGalleryAt = (idx) => {
    const nf = [...galleryFiles]; nf.splice(idx, 1); setGalleryFiles(nf);
    const np = [...galleryPreviews]; np.splice(idx, 1); setGalleryPreviews(np);
  };

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // (Optional) live math like app – not required, but handy
  const pricePreview = useMemo(() => {
    const price = Number(form.purchasePrice || 0);
    const marginPct = Number(form.margin || 0);
    const base = price + (marginPct / 100) * price;

    const discPct = Number(form.discountPercentage || 0);
    const afterDisc = discPct ? base - (base * discPct) / 100 : base;

    const gstPct = Number(form.gstPercentage || 0);
    const gst = form.gstType === "inclusive"
      ? afterDisc - afterDisc / (1 + gstPct / 100)
      : (afterDisc * gstPct) / 100;

    const final = form.gstType === "inclusive" ? afterDisc : afterDisc + gst;
    const moq = Number(form.MOQ || 0);
    return {
      base, afterDisc, gst, final,
      baseTotal: base * moq,
      afterDiscTotal: afterDisc * moq,
      gstAmtTotal: gst * moq,
      finalTotal: final * moq,
      moq,
    };
  }, [form.purchasePrice, form.margin, form.discountPercentage, form.gstPercentage, form.gstType, form.MOQ]);

  const resetForm = () => {
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
      // Upload images to Cloudinary unsigned
      const mainUrl = await uploadUnsigned(mainImageFile);
      const galleryUrls = [];
      for (const f of galleryFiles) {
        galleryUrls.push(await uploadUnsigned(f));
      }

      // Build payload (DeepGlam v2025-08 API)
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
        mrp: Number(form.mrp || 0),
        discountPercentage: Number(form.discountPercentage || 0),
        gstPercentage: Number(form.gstPercentage || 0),
        gstType: form.gstType,                   // "inclusive" | "exclusive"
        stock: Number(form.stock || 0),
        brand: form.brand,                       // manual entry ✅
        sellerId: form.sellerId || undefined,    // optional
        sizes: sizesArr,
        colors: colorsArr,
        description: form.description,
        mainImage: { url: mainUrl },             // backend expects object with url
        images: galleryUrls.map(u => ({ url: u })),
      };

      const res = await createProduct(body);
      if (!res?.ok) throw new Error(res?.error || "Create failed");

      alert("✅ Product created successfully");
      resetForm();
    } catch (err) {
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

        {/* Optional free text: sizes / colors / HSN */}
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
        <input
          type="text"
          name="hsnCode"
          placeholder="HSN Code"
          value={form.hsnCode}
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

        {/* ===== Price Preview (optional, lightweight) ===== */}
        <div className="col-span-full grid gap-2 bg-white border rounded p-3">
          <div className="font-semibold">Per Unit</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Chip label="Base" value={pricePreview.base} />
            <Chip label="After Disc." value={pricePreview.afterDisc} />
            <Chip label={form.gstType === "inclusive" ? "GST part" : "GST"} value={pricePreview.gst} />
            <Chip label="Final" value={pricePreview.final} strong />
          </div>
          <div className="font-semibold mt-2">Totals @ MOQ ({pricePreview.moq || 0} units)</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Chip label="Base×MOQ" value={pricePreview.baseTotal} />
            <Chip label="After Disc.×MOQ" value={pricePreview.afterDiscTotal} />
            <Chip label={form.gstType === "inclusive" ? "GST part×MOQ" : "GST×MOQ"} value={pricePreview.gstAmtTotal} />
            <Chip label="Final×MOQ" value={pricePreview.finalTotal} strong />
          </div>
        </div>

        {/* ===== IMAGES (Collapsible at bottom) ===== */}
        <details className="col-span-full bg-white border rounded-lg">
          <summary className="list-none cursor-pointer select-none px-4 py-3 border-b flex items-center justify-between">
            <span className="font-semibold">Images</span>
            <span className="text-sm text-gray-500">Click for add Image</span>
          </summary>

          <div className="p-4 grid gap-4">
            {/* Main Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Main Image</label>
                <label className="inline-flex items-center gap-2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded cursor-pointer">
                  <span>Pick</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onPickMain} />
                </label>
              </div>
              <div className="border rounded p-2 min-h-[140px] flex items-center justify-center bg-white">
                {mainPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mainPreview} alt="main" className="rounded w-full max-h-64 object-cover" />
                ) : (
                  <p className="text-gray-500 text-sm">Upload main image</p>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Gallery (max 10)</label>
                <label className="inline-flex items-center gap-2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded cursor-pointer">
                  <span>Add</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={onPickGallery} />
                </label>
              </div>

              {galleryPreviews?.length ? (
                <div className="flex gap-2 overflow-x-auto">
                  {galleryPreviews.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative w-24 h-24 border rounded overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`g-${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryAt(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded p-3 text-gray-500 text-sm">Add up to 10 images</div>
              )}
            </div>
          </div>
        </details>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-[#f26522] text-white py-2 rounded hover:opacity-90"
        >
          {loading ? "Saving..." : "Add Product"}
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
        strong ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold" : "bg-gray-50 border-gray-200 text-gray-800"
      }`}
      style={{ fontSize: 13 }}
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div>₹{Number(value || 0).toFixed(2)}</div>
    </div>
  );
}
