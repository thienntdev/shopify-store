/** @format */

import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Mock product data - replace with real data from Shopify
const trendingProducts = [
  {
    id: "1",
    title: "Poster - My Favorite Place In All The World Is Next To You",
    price: 29.99,
    originalPrice: 49.99,
    rating: 5.0,
    reviewCount: 75,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 42,
  },
  {
    id: "2",
    title: "Car Ornament - Together Forever",
    price: 19.99,
    originalPrice: 29.99,
    rating: 5.0,
    reviewCount: 43,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 33,
  },
  {
    id: "3",
    title: "Mugs - Personalized Quote",
    price: 24.99,
    originalPrice: 44.99,
    rating: 5.0,
    reviewCount: 700,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 44,
  },
  {
    id: "4",
    title: "Mugs - Couple of the Year",
    price: 24.99,
    originalPrice: 44.99,
    rating: 5.0,
    reviewCount: 700,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 44,
  },
  {
    id: "5",
    title: "Suncatcher Ornament",
    price: 24.99,
    originalPrice: 44.99,
    rating: 5.0,
    reviewCount: 129,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 44,
  },
];

const photoGifts = [
  {
    id: "6",
    title: "Stone With Stand - All of me LOVES ALL OF You",
    price: 34.99,
    originalPrice: 56.99,
    rating: 5.0,
    reviewCount: 133,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 38,
  },
  {
    id: "7",
    title: "Poster - My Favorite Place In All The World Is Next To You",
    price: 29.99,
    originalPrice: 51.99,
    rating: 5.0,
    reviewCount: 1485,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 42,
  },
  {
    id: "8",
    title: "Boxer Briefs - Personalized",
    price: 27.99,
    originalPrice: 38.99,
    rating: 5.0,
    reviewCount: 51,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 27,
  },
  {
    id: "9",
    title: "Car Visor Clip - I love you",
    price: 24.99,
    originalPrice: 44.99,
    rating: 5.0,
    reviewCount: 38,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 44,
  },
  {
    id: "10",
    title: "LED Flower Lamp",
    price: 36.99,
    originalPrice: 57.99,
    rating: 4.9,
    reviewCount: 7,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product+Image",
    discount: 36,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-pink-50 to-red-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                LOVE IN YOUR EYES
                <br />
                Be my{" "}
                <span className="text-red-500">
                  V<span className="text-red-500">❤️</span>lentine
                </span>
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Create personalized gifts that express your love and create
                cherished memories.
              </p>
              <Link
                href="/valentine"
                className="inline-block bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-red-200 to-orange-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💝</div>
                  <p className="text-gray-700 text-lg">Personalized Gifts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              2026 Valentine Trending
            </h2>
            <Link
              href="/valentine"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
            >
              BROWSE MORE{" "}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gifts Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Photo Gifts For Cherished Moments
            </h2>
            <Link
              href="/photo-gifts"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
            >
              BROWSE MORE{" "}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {photoGifts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Us For Valentine Gifts?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-gray-600">
                We ensure gifts arrive promptly for celebrations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Satisfaction Guarantee
              </h3>
              <p className="text-gray-600">
                Not satisfied? Easy replacements or refunds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Superior Quality</h3>
              <p className="text-gray-600">
                Made with premium materials for lasting beauty.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Holiday Support</h3>
              <p className="text-gray-600">
                Friendly help anytime during the holidays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
