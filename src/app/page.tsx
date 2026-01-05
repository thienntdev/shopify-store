/** @format */

import FilterableProductSection from "@/components/layout/FilterableProduct";
import HeroBanner from "@/components/layout/HeroBanner";
import ShopByGrid, { ShopByItem } from "@/components/layout/ShopByGrid";
import TrendingMenu from "@/components/layout/TrendingMenu";
import TrendingNow from "@/components/layout/TrendingNow";
import HappyCustomers from "@/components/HappyCustomers";

const wearableCategories = [
  { handle: "wearable-blanket", title: "Wearable Blanket" },
  { handle: "blanket", title: "Blanket" },
  { handle: "shirt", title: "Shirt" },
  { handle: "hoodie", title: "Hoodie" },
  { handle: "sweatshirt", title: "Sweatshirt" },
  { handle: "fleece-scarf", title: "Fleece Scarf" },
];

const leggingsCategories = [
  { handle: "leggings", title: "Leggings" },
  { handle: "jewelry-dish", title: "Jewelry Dish" },
  { handle: "mug", title: "Mug" },
  { handle: "bottle-lamp", title: "Bottle Lamp" },
  { handle: "suncatcher", title: "Suncatcher" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <TrendingMenu />

      <HeroBanner
        collectionHandle="valentines-gifts"
        buttonText="SHOP NOW"
        backgroundColor="bg-linear-to-r from-orange-50 via-red-50 to-pink-50"
        titleColor="text-red-600"
        subtitleColor="text-gray-700"
      />

      <TrendingNow collectionHandle="best-sellers" title="Trending Now" />

      <HeroBanner
        collectionHandle="winter-gifts"
        buttonText="SHOP ALL"
        backgroundColor="bg-linear-to-r from-blue-50 via-cyan-50 to-white"
        titleColor="text-red-600"
        subtitleColor="text-blue-800"
        reverse={true}
      />

      <FilterableProductSection categories={wearableCategories} />

      <HeroBanner
        collectionHandle="gifts-for-her"
        buttonText="SHOP ALL"
        backgroundColor="bg-amber-50"
        titleColor="text-red-600"
        subtitleColor="text-blue-800"
        reverse={true}
      />

      <FilterableProductSection categories={wearableCategories} />

      <ShopByGrid
        title="Shop By Recipient"
        menuHandle="shop-by-recipient"
        shape="circle"
        columns={{ mobile: 2, tablet: 4, desktop: 4 }}
      />

      <ShopByGrid
        title="Shop By Product"
        menuHandle="shop-by-recipient"
        shape="square"
        columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      />

      {/* <HappyCustomers /> */}
    </div>
  );
}
