/** @format */

import Link from "next/link";
import NewsLetter from "./NewsLetter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <NewsLetter />

      {/* Main Footer */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Address */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 relative">
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-tl-lg rounded-tr-lg"></div>
                    <div className="absolute top-1 left-1 w-6 h-6 border-2 border-orange-500 rounded-full"></div>
                    <div className="absolute top-1 right-1 w-6 h-6 border-2 border-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">PAWFECT</span>
                  <span className="text-lg font-bold">HOUSE</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <svg
                  className="w-5 h-5 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p>3680 N 5th St #100, North Las Vegas, NV 89032, US</p>
              </div>
            </div>

            {/* Informations */}
            <div>
              <h3 className="font-semibold mb-4 uppercase">Informations</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/about-us"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affiliate"
                    className="hover:text-white transition-colors"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wholesale"
                    className="hover:text-white transition-colors"
                  >
                    Wholesale Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reseller"
                    className="hover:text-white transition-colors"
                  >
                    Reseller Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="font-semibold mb-4 uppercase">Policies</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/policies/christmas-delivery"
                    className="hover:text-white transition-colors"
                  >
                    Christmas Delivery Cut-off Dates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/refund"
                    className="hover:text-white transition-colors"
                  >
                    Replacement & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/shipping"
                    className="hover:text-white transition-colors"
                  >
                    Shipping and Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/payment"
                    className="hover:text-white transition-colors"
                  >
                    Payment Methods
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Center */}
            <div>
              <h3 className="font-semibold mb-4 uppercase">Help Center</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/size-charts"
                    className="hover:text-white transition-colors"
                  >
                    Size Charts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-order"
                    className="hover:text-white transition-colors"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dmca"
                    className="hover:text-white transition-colors"
                  >
                    DMCA Report
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods and Social Media */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Payment Methods */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-gray-400 text-sm mr-2">
                  Payment Methods:
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                  <span className="px-2 py-1 bg-white text-blue-600 rounded">
                    AM EX
                  </span>
                  <span className="px-2 py-1 bg-white text-black rounded">
                    Pay
                  </span>
                  <span className="px-2 py-1 bg-white text-blue-600 rounded">
                    G Pay
                  </span>
                  <span className="px-2 py-1 bg-white text-red-600 rounded">
                    Mastercard
                  </span>
                  <span className="px-2 py-1 bg-white text-blue-600 rounded">
                    PayPal
                  </span>
                  <span className="px-2 py-1 bg-white text-black rounded">
                    shop
                  </span>
                  <span className="px-2 py-1 bg-white text-blue-600 rounded">
                    UnionPay
                  </span>
                  <span className="px-2 py-1 bg-white text-blue-600 rounded">
                    Visa
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="text-white font-bold">f</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>© 2025 PawfectHouse™.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
