/** @format */

import Link from "next/link";
import NewsLetter from "./NewsLetter";
import FooterSection from "./FooterSection";
import FooterNestedSection from "./FooterNestedSection";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <NewsLetter />

      {/* Main Footer */}
      <div className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-0">
            {/* Paw Zeno - First */}
            <FooterSection
              title="Paw Zeno"
              links={[
                { label: "About Us", href: "/about-us" },
                { label: "Privacy Policy", href: "/policies/privacy" },
              ]}
              isMobile={true}
            />

            {/* Gift Finder - Just a title section */}
            <Link
              href="/gift-finder"
              className="border-b border-slate-800 block"
            >
              <h3 className="py-4 text-white font-semibold uppercase hover:text-gray-300 transition-colors">
                Gift Finder
              </h3>
            </Link>

            {/* Shop By Product */}
            <FooterNestedSection
              title="Shop By Product"
              collections={[
                { label: "Drinkware", href: "/collections/drinkware" },
                { label: "Home Décor", href: "/collections/home-decor" },
                { label: "Leather Gifts", href: "/collections/leather-gifts" },
                {
                  label: "Clothing & Accessories",
                  href: "/collections/clothing-accessories",
                },
                { label: "Bedding", href: "/collections/bedding" },
                { label: "Photo Gifts", href: "/collections/photo-gifts" },
                { label: "Gift Cards", href: "/collections/gift-cards" },
              ]}
              isMobile={true}
            />

            {/* Shop By Occasion */}
            <FooterNestedSection
              title="Shop By Occasion"
              collections={[
                { label: "Christmas", href: "/occasions/christmas" },
                { label: "New Year", href: "/occasions/new-year" },
                { label: "Valentine's Day", href: "/occasions/valentines" },
                { label: "Easter", href: "/occasions/easter" },
                { label: "Birthday", href: "/occasions/birthday" },
                { label: "Anniversary", href: "/occasions/anniversary" },
                { label: "Wedding", href: "/occasions/wedding" },
              ]}
              isMobile={true}
            />

            {/* Shop By Recipient */}
            <FooterNestedSection
              title="Shop By Recipient"
              collections={[
                { label: "For Her", href: "/recipients/for-her" },
                { label: "For Him", href: "/recipients/for-him" },
                { label: "For Kids", href: "/recipients/for-kids" },
                { label: "For Pet Lovers", href: "/recipients/pet-lovers" },
              ]}
              isMobile={true}
            />

            {/* Shop By Hobby */}
            <FooterNestedSection
              title="Shop By Hobby"
              collections={[
                { label: "Sports", href: "/collections/sports" },
                { label: "Music", href: "/collections/music" },
                { label: "Reading", href: "/collections/reading" },
                { label: "Cooking", href: "/collections/cooking" },
                { label: "Travel", href: "/collections/travel" },
              ]}
              isMobile={true}
            />
            <FooterSection
              title="Help and Support"
              links={[
                { label: "Return Policy", href: "/policies/return" },
                { label: "Help Center", href: "/help" },
                { label: "Size Chart", href: "/size-charts" },
                {
                  label: "Shipping And Delivery",
                  href: "/policies/shipping",
                },
                {
                  label: "Cancellation & Modification Policy",
                  href: "/policies/cancellation",
                },
                {
                  label: "Refund & Replacement Policy",
                  href: "/policies/refund",
                },
                {
                  label: "Disclaimer Regarding Fake Websites",
                  href: "/policies/disclaimer",
                },
              ]}
              isMobile={true}
              noBorder={true}
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-4 gap-8">
            {/* Column 1: Gift Finder + Shop By sections */}
            <div>
              <Link href="/gift-finder" className="block mb-4">
                <h3 className="font-semibold text-white uppercase hover:text-gray-300 transition-colors">
                  Gift Finder
                </h3>
              </Link>
              <div className="border-b border-slate-800 mb-4"></div>
              <FooterNestedSection
                title="Shop By Product"
                collections={[
                  { label: "Drinkware", href: "/collections/drinkware" },
                  { label: "Home Décor", href: "/collections/home-decor" },
                  {
                    label: "Leather Gifts",
                    href: "/collections/leather-gifts",
                  },
                  {
                    label: "Clothing & Accessories",
                    href: "/collections/clothing-accessories",
                  },
                  { label: "Bedding", href: "/collections/bedding" },
                  { label: "Photo Gifts", href: "/collections/photo-gifts" },
                  { label: "Gift Cards", href: "/collections/gift-cards" },
                ]}
              />
              <div className="mt-6">
                <FooterNestedSection
                  title="Shop By Occasion"
                  collections={[
                    { label: "Christmas", href: "/occasions/christmas" },
                    { label: "New Year", href: "/occasions/new-year" },
                    {
                      label: "Valentine's Day",
                      href: "/occasions/valentines",
                    },
                    { label: "Easter", href: "/occasions/easter" },
                    { label: "Birthday", href: "/occasions/birthday" },
                    { label: "Anniversary", href: "/occasions/anniversary" },
                    { label: "Wedding", href: "/occasions/wedding" },
                  ]}
                />
              </div>
              <div className="mt-6">
                <FooterNestedSection
                  title="Shop By Recipient"
                  collections={[
                    { label: "For Her", href: "/recipients/for-her" },
                    { label: "For Him", href: "/recipients/for-him" },
                    { label: "For Kids", href: "/recipients/for-kids" },
                    {
                      label: "For Pet Lovers",
                      href: "/recipients/pet-lovers",
                    },
                  ]}
                />
              </div>
              <div className="mt-6">
                <FooterNestedSection
                  title="Shop By Hobby"
                  collections={[
                    { label: "Sports", href: "/collections/sports" },
                    { label: "Music", href: "/collections/music" },
                    { label: "Reading", href: "/collections/reading" },
                    { label: "Cooking", href: "/collections/cooking" },
                    { label: "Travel", href: "/collections/travel" },
                  ]}
                  noBorder={true}
                />
              </div>
            </div>

            {/* Column 2: Macorner */}
            <div>
              <FooterSection
                title="Paw Zeno"
                links={[
                  { label: "About Us", href: "/about-us" },
                  {
                    label: "Privacy Policy",
                    href: "/policies/privacy",
                  },
                ]}
              />
            </div>

            {/* Column 3: Help and Support */}
            <div>
              <FooterSection
                title="Help and Support"
                links={[
                  { label: "Return Policy", href: "/policies/return" },
                  { label: "Help Center", href: "/help" },
                  { label: "Size Chart", href: "/size-charts" },
                  {
                    label: "Shipping And Delivery",
                    href: "/policies/shipping",
                  },
                  {
                    label: "Cancellation & Modification Policy",
                    href: "/policies/cancellation",
                  },
                  {
                    label: "Refund & Replacement Policy",
                    href: "/policies/refund",
                  },
                  {
                    label: "Disclaimer Regarding Fake Websites",
                    href: "/policies/disclaimer",
                  },
                ]}
              />
            </div>

            {/* Column 4: GET IN TOUCH */}
            <div>
              <h3 className="font-semibold mb-4 text-white uppercase">
                GET IN TOUCH
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Support Time: 9 AM to 5 PM, Mon-Sat
              </p>
              <Link
                href="/support"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-6"
              >
                Open A Support Ticket
              </Link>
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <span className="text-white font-bold text-sm">f</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  </svg>
                </a>
                <a
                  href="https://amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <span className="text-white font-bold text-xs">a</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.926-1.878.101-.341.607-2.083.607-2.083s.152-.303.152-.751c0-.705-.427-1.231-1.001-1.231-.756 0-1.104.567-1.104 1.24 0 .456.305 1.128.463 1.562.13.502.261 1.003.378 1.505.108.402.22.803.32 1.203-.421.19-.87.29-1.339.29-2.58 0-4.49-1.822-4.49-4.06 0-1.115.6-2.19 1.73-2.89.16-.11.365-.02.421.18.04.14.14.5.18.64.06.23.02.31-.13.51-.41.49-.62 1.12-.62 1.89 0 2.48 1.48 3.06 2.73 3.06.8 0 1.57-.31 2.14-.86.27-.33.47-.73.62-1.18.25-.75.38-1.58.38-2.43 0-2.2-1.6-4.22-4.6-4.22-3.14 0-5.1 2.35-5.1 4.9 0 .91.35 1.88.99 2.21.11.06.17.03.2-.09l.18-.73c.02-.1.01-.14-.06-.22-.33-.4-.54-.92-.54-1.66 0-2.16 1.61-4.05 4.65-4.05 2.51 0 3.9 1.53 3.9 3.57 0 2.8-1.75 5.16-4.35 5.16-.85 0-1.66-.44-1.93-1.01l-.53-2.01c-.16-.61-.59-.85-1.11-.62-.66.28-.88.86-.66 1.55.28.87 1.08 1.47 1.95 1.47.78 0 1.53-.3 2.09-.85.73-.7 1.12-1.63 1.12-2.62 0-1.07-.57-2.1-1.76-2.1-.98 0-1.58.75-1.58 1.75 0 .61.23 1.02.23 1.02s-.79 3.35-.93 3.97c-.18.69-.03 1.72-.01 1.9.01.11.15.14.21.07.24-.28 1.33-1.65 1.75-3.18.12-.44.07-.81-.04-1.19-.18-.61-1.05-4.24-1.05-4.24s-.27-.66.05-1.01c.31-.34.84-.45 1.11-.34.27.11 1.82 1.08 2.47 1.61.65.54 1.11.81 1.51.81.4 0 .6-.31.6-.57 0-.28-.15-.69-.24-.95-.18-.52-.78-1.78-1.08-2.44-.29-.66-.21-.99.15-1.5.36-.51 1.01-.75 1.52-.75.75 0 1.35.28 1.8.82.45.54.68 1.28.68 2.15 0 .87-.29 1.69-.82 2.35-.53.66-1.19 1.19-1.93 1.59-.74.4-1.54.6-2.35.6z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile GET IN TOUCH Section */}
          <div className="md:hidden mt-6 text-center">
            <h3 className="font-semibold mb-4 text-white uppercase">
              GET IN TOUCH
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Support Time: 9 AM to 5 PM, Mon-Sat
            </p>
            <Link
              href="/support"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-6"
            >
              Open A Support Ticket
            </Link>
            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-white font-bold text-sm">f</span>
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                </svg>
              </a>
              <a
                href="https://amazon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-white font-bold text-xs">a</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.926-1.878.101-.341.607-2.083.607-2.083s.152-.303.152-.751c0-.705-.427-1.231-1.001-1.231-.756 0-1.104.567-1.104 1.24 0 .456.305 1.128.463 1.562.13.502.261 1.003.378 1.505.108.402.22.803.32 1.203-.421.19-.87.29-1.339.29-2.58 0-4.49-1.822-4.49-4.06 0-1.115.6-2.19 1.73-2.89.16-.11.365-.02.421.18.04.14.14.5.18.64.06.23.02.31-.13.51-.41.49-.62 1.12-.62 1.89 0 2.48 1.48 3.06 2.73 3.06.8 0 1.57-.31 2.14-.86.27-.33.47-.73.62-1.18.25-.75.38-1.58.38-2.43 0-2.2-1.6-4.22-4.6-4.22-3.14 0-5.1 2.35-5.1 4.9 0 .91.35 1.88.99 2.21.11.06.17.03.2-.09l.18-.73c.02-.1.01-.14-.06-.22-.33-.4-.54-.92-.54-1.66 0-2.16 1.61-4.05 4.65-4.05 2.51 0 3.9 1.53 3.9 3.57 0 2.8-1.75 5.16-4.35 5.16-.85 0-1.66-.44-1.93-1.01l-.53-2.01c-.16-.61-.59-.85-1.11-.62-.66.28-.88.86-.66 1.55.28.87 1.08 1.47 1.95 1.47.78 0 1.53-.3 2.09-.85.73-.7 1.12-1.63 1.12-2.62 0-1.07-.57-2.1-1.76-2.1-.98 0-1.58.75-1.58 1.75 0 .61.23 1.02.23 1.02s-.79 3.35-.93 3.97c-.18.69-.03 1.72-.01 1.9.01.11.15.14.21.07.24-.28 1.33-1.65 1.75-3.18.12-.44.07-.81-.04-1.19-.18-.61-1.05-4.24-1.05-4.24s-.27-.66.05-1.01c.31-.34.84-.45 1.11-.34.27.11 1.82 1.08 2.47 1.61.65.54 1.11.81 1.51.81.4 0 .6-.31.6-.57 0-.28-.15-.69-.24-.95-.18-.52-.78-1.78-1.08-2.44-.29-.66-.21-.99.15-1.5.36-.51 1.01-.75 1.52-.75.75 0 1.35.28 1.8.82.45.54.68 1.28.68 2.15 0 .87-.29 1.69-.82 2.35-.53.66-1.19 1.19-1.93 1.59-.74.4-1.54.6-2.35.6z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Payment Methods and Legal Info */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {/* Payment Method Logos - Using text representations */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Amazon Pay
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-blue-600">
                AMEX
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Apple Pay
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Bancontact
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-orange-600">
                Discover
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Google Pay
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Maestro
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-red-600">
                Mastercard
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-blue-600">
                PayPal
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Shop Pay
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-gray-700">
                Venmo
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded text-xs font-semibold text-blue-600">
                Visa
              </div>
            </div>

            {/* Legal Info and DMCA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-orange-500 text-white px-4 py-2 rounded font-semibold text-sm">
                Protected by DMCA
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Link
                  href="/policies/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms Of Services
                </Link>
                <span>•</span>
                <Link
                  href="/policies/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <span>MA Commerce Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
