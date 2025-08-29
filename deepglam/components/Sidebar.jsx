"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    if (pathname.startsWith("/master")) setOpenGroup("master");
    else if (pathname.startsWith("/products")) setOpenGroup("product");
    else if (pathname.startsWith("/orders")) setOpenGroup("order");
    else if (pathname.startsWith("/users")) setOpenGroup("user");
  }, [pathname]);

  const toggleGroup = (group) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-orange-600 tracking-tight">
          DeepGlam
        </h2>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex flex-col text-sm flex-1 overflow-y-auto py-4">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex items-center px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
            isActive("/dashboard")
              ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
          Dashboard
        </Link>

        {/* Master Management */}
        <div className="mb-2">
          <button
            onClick={() => toggleGroup("master")}
            className={`flex justify-between items-center w-full px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              openGroup === "master" || pathname.startsWith("/master")
                ? "bg-gray-50 text-gray-900"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
              <span>Master Management</span>
            </div>
            <span className={`transform transition-transform duration-200 ${
              openGroup === "master" ? "rotate-45" : ""
            }`}>
              +
            </span>
          </button>
          {openGroup === "master" && (
            <div className="ml-12 mr-3 space-y-1 mb-3 animate-fadeIn">
              {[
                { href: "/master/banner", label: "Banners" },
                { href: "/master/categories", label: "Categories" },
                { href: "/master/subcategories", label: "Sub Categories" },
                { href: "/master/sizes", label: "Sizes" },
                { href: "/master/colors", label: "Colors" },
                { href: "/master/coupons", label: "Coupons" },
                { href: "/master/hsn", label: "HSN Codes" },
                { href: "/master/profit", label: "Profit %" },
                { href: "/master/location", label: "Locations" },
                { href: "/master/country", label: "Country" },
                { href: "/master/state", label: "State" },
                { href: "/master/city", label: "City" },
                { href: "/master/brand", label: "Brand" },
                { href: "/master/blog", label: "Blog" },
                { href: "/master/document-type", label: "Document Types" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Product Management */}
        <div className="mb-2">
          <button
            onClick={() => toggleGroup("product")}
            className={`flex justify-between items-center w-full px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              openGroup === "product" || pathname.startsWith("/products")
                ? "bg-gray-50 text-gray-900"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
              <span>Product Management</span>
            </div>
            <span className={`transform transition-transform duration-200 ${
              openGroup === "product" ? "rotate-45" : ""
            }`}>
              +
            </span>
          </button>
          {openGroup === "product" && (
            <div className="ml-12 mr-3 space-y-1 mb-3 animate-fadeIn">
              {[
                { href: "/products/add-type", label: "Add Product Type" },
                { href: "/products/add", label: "Add Product" },
               // { href: "/products/list", label: "Product List" },
                { href: "/products/stock", label: "Product Stock" },
                //{ href: "/products/pending", label: "Pending Products" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Order Management */}
        <div className="mb-2">
          <button
            onClick={() => toggleGroup("order")}
            className={`flex justify-between items-center w-full px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              openGroup === "order" || pathname.startsWith("/orders")
                ? "bg-gray-50 text-gray-900"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
              <span>Order Management</span>
            </div>
            <span className={`transform transition-transform duration-200 ${
              openGroup === "order" ? "rotate-45" : ""
            }`}>
              +
            </span>
          </button>
          {openGroup === "order" && (
            <div className="ml-12 mr-3 space-y-1 mb-3 animate-fadeIn">
              {[
                { href: "/orders/list", label: "All Orders" },
                //{ href: "/orders/billing", label: "Delivered Orders" },
                //{ href: "/orders/canceled", label: "Canceled Orders" },
                { href: "/orders/returns", label: "Return Orders" },
                { href: "/orders/reject-report", label: "Cancel Order" },
                { href: "/orders/reports", label: "Delivered Order" },
                 { href: "/orders/Placed", label: " Placed Order " },
                  { href: "/orders/Bill", label: " Bill Order " },
                  
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Management */}
        <div className="mb-2">
          <button
            onClick={() => toggleGroup("user")}
            className={`flex justify-between items-center w-full px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              openGroup === "user" || pathname.startsWith("/users")
                ? "bg-gray-50 text-gray-900"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
              <span>User Management</span>
            </div>
            <span className={`transform transition-transform duration-200 ${
              openGroup === "user" ? "rotate-45" : ""
            }`}>
              +
            </span>
          </button>
          {openGroup === "user" && (
            <div className="ml-12 mr-3 space-y-1 mb-3 animate-fadeIn">
              {[
                { href: "/users/buyers", label: "Buyers" },
                { href: "/users/sellers", label: "Sellers" },
                { href: "/users/staff", label: "Staff" },
                { href: "/users/staff/attendance", label: "Staff Attendance" },
                { href: "/users/create", label: "Create User" },
                { href: "/users/permissions", label: "Permissions" },
                { href: "/users/vendor-report", label: "Vendor Report" },
                { href: "/users/buyer-report", label: "Buyer Report" },
                { href: "/users/contact-report", label: "Contact Report" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Single Items */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <Link
            href="/payroll"
            className={`flex items-center px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              isActive("/payroll")
                ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
            Payroll
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              isActive("/analytics")
                ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
            Analytics
          </Link>
          <Link
            href="/settings"
            className={`flex items-center px-6 py-3 mx-3 mb-1 rounded-lg font-medium transition-all duration-200 ${
              isActive("/settings")
                ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></span>
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}