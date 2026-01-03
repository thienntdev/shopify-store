/** @format */

import Image from "next/image";
import FilterableProductSection from "@/components/FilterableProductSection";
import HeroBanner from "@/components/HeroBanner";
import ShopByGrid, { ShopByItem } from "@/components/ShopByGrid";
import TrendingMenu from "@/components/TrendingMenu";
import TrendingNow from "@/components/TrendingNow";
import HappyCustomers from "@/components/HappyCustomers";

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
      {/* <HappyCustomers /> */}
    </div>
  );
}
