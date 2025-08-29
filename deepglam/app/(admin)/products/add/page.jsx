"use client";
import { useState, useEffect } from "react";
import { createProduct } from "@/services/productService";
import { getBrands } from "@/services/masterService";
import { getSellers } from "@/services/sellerService";

/* App-jaisi enums (mobile ke saath aligned) */
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
    brand: "",
    sellerId: "",
    description: "",
  });

  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const [brandRes, sellerRes] = await Promise.all([getBrands(), getSellers()]);
      if (brandRes.ok) setBrands(brandRes.data);
      if (sellerRes.ok) setSellers(sellerRes.data);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await createProduct(form);
    if (res.ok) {
      alert("✅ Product created successfully");
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
      });
    } else {
      alert(res.error || "Failed to create product");
    }
    setLoading(false);
  };

  const cap = (s) => s?.charAt(0).toUpperCase() + s?.slice(1);

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

        {/* MAIN CATEGORY → dropdown (app-jaisa) */}
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

        {/* SUB CATEGORY → dropdown (men/women/kids) */}
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

        {/* PRODUCT TYPE → dropdown */}
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

        {/* MRP (keep as-is per “wahi style”) */}
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

        {/* GST TYPE → dropdown (inclusive/exclusive) */}
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

        {/* Select Brand (as-is) */}
        <input
  type="text"
  name="brand"
  placeholder="Enter Brand Name"
  value={form.brand}
  onChange={handleChange}
  className="border p-2 rounded"
/>


        {/* Select Seller (as-is) */}
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

        {/* Description (as-is) */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          rows={3}
        />

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
