"use client";
import { useState, useEffect } from "react";
import { createProduct } from "@/services/productService";
import { getBrands } from "@/services/masterService";
import { getSellers } from "@/services/sellerService";

export default function AddProductPage() {
  const [form, setForm] = useState({
    productname: "",
    mainCategory: "",
    subCategory: "",
    MOQ: 1,
    purchasePrice: "",
    margin: "",
    mrp: "",
    discountPercentage: "",
    gstPercentage: "",
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
      const [brandRes, sellerRes] = await Promise.all([
        getBrands(),
        getSellers(),
      ]);
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
        mainCategory: "",
        subCategory: "",
        MOQ: 1,
        purchasePrice: "",
        margin: "",
        mrp: "",
        discountPercentage: "",
        gstPercentage: "",
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product (Admin)</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="productname"
          placeholder="Product Name"
          value={form.productname}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="mainCategory"
          placeholder="Main Category"
          value={form.mainCategory}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="subCategory"
          placeholder="Sub Category"
          value={form.subCategory}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="MOQ"
          placeholder="MOQ"
          value={form.MOQ}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="margin"
          placeholder="Margin (%)"
          value={form.margin}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={form.mrp}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="gstPercentage"
          placeholder="GST %"
          value={form.gstPercentage}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Select Brand */}
        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Select Seller */}
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

        {/* Description */}
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
          className="col-span-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
