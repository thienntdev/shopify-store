/** @format */

import Image from "next/image";
import FilterableProductSection from "@/components/FilterableProductSection";
import HeroBanner from "@/components/HeroBanner";
import ShopByGrid, { ShopByItem } from "@/components/ShopByGrid";
import TrendingMenu from "@/components/TrendingMenu";
import TrendingNow from "@/components/TrendingNow";

const wearableCategories = [
  { handle: "wearable-blanket" },
  { handle: "blanket" },
  { handle: "shirt" },
  { handle: "hoodie" },
  { handle: "sweatshirt" },
  { handle: "fleece-scarf" },
];

const leggingsCategories = [
  { handle: "leggings" },
  { handle: "jewelry-dish" },
  { handle: "mug" },
  { handle: "bottle-lamp" },
  { handle: "suncatcher" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Icons Section */}
      <TrendingMenu />

      {/* Valentine's Gifts Hero Banner */}
      <HeroBanner
        collectionHandle="valentines-gifts"
        title="Valentine's Gifts"
        subtitle="For the love that has learned, grown, and stayed"
        image="https://via.placeholder.com/800x600/FF6B9D/FFFFFF?text=Valentine's+Gifts"
        imageAlt="Valentine's Gifts"
        buttonText="SHOP NOW"
        buttonHref="/valentine"
        backgroundColor="bg-linear-to-r from-orange-50 via-red-50 to-pink-50"
        titleColor="text-red-600"
        subtitleColor="text-gray-700"
      />

      {/* Trending Now Section */}
      <TrendingNow title="Trending Now"/>

      {/* Winter Gifts Banner */}
      <HeroBanner
        collectionHandle="winter-gifts"
        title="Winter Gifts"
        subtitle="Soft Little Comforts for Chilly Days"
        image="https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Winter+Gifts"
        imageAlt="Winter Gifts"
        buttonText="SHOP ALL"
        buttonHref="/winter-gifts"
        backgroundColor="bg-linear-to-r from-blue-50 via-cyan-50 to-white"
        titleColor="text-red-600"
        subtitleColor="text-blue-800"
        reverse={false}
      />

      {/* Wearable Blankets Section */}
      <FilterableProductSection
        categories={wearableCategories}
      />

      {/* Gifts For Her Banner */}
      <HeroBanner
        collectionHandle="gifts-for-her"
        title="Gifts For Her"
        subtitle="Because She's Worth It"
        image="https://via.placeholder.com/800x600/EC407A/FFFFFF?text=Gifts+For+Her"
        imageAlt="Gifts For Her"
        buttonText="SHOP ALL"
        buttonHref="/recipients/for-her"
        backgroundColor="bg-amber-50"
        titleColor="text-red-600"
        subtitleColor="text-blue-800"
        reverse={true}
      />

      {/* Leggings Section */}
      {/* Wearable Blankets Section */}
      <FilterableProductSection
        categories={leggingsCategories}
      />

      {/* Shop By Recipient Section */}
      <ShopByGrid
        title="Shop By Recipient"
        menuHandle="shop-by-recipient"
        shape="circle"
        columns={{ mobile: 2, tablet: 4, desktop: 4 }}
      />

      {/* Shop By Product Section */}
      <ShopByGrid
        title="Shop By Product"
        menuHandle="shop-by-recipient"
        shape="square"
        columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      />

      {/* Happy Customers Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <ul className="list-none p-0 m-0 grid grid-cols-1 lg:grid-cols-8 gap-6 auto-rows-auto">
            {/* Text Content - spans 4 columns on large screens, row 1 */}
            <li className="lg:col-span-4 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
                Happy Customers
              </h2>
              <p className="text-base md:text-lg text-gray-900 mb-6">
                Unwrap Happiness with Every Gift. Join the Macorner Family of
                Delighted Shoppers!
              </p>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors w-fit">
                Show More
              </button>
            </li>
            {/* Top Row Images - row 1, 2 images, each spans 2 columns */}
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+1"
                alt="Happy Customer 1"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+2"
                alt="Happy Customer 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
            {/* Bottom Row: 4 Images - row 2, each spans 2 columns */}
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+3"
                alt="Happy Customer 3"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+4"
                alt="Happy Customer 4"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+5"
                alt="Happy Customer 5"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
            <li className="lg:col-span-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Customer+6"
                alt="Happy Customer 6"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                unoptimized
              />
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
