/** @format */

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import CollectionButton from "@/components/ui/CollectionButton";
import FilterableProductSection from "@/components/FilterableProductSection";
import HeroBanner from "@/components/HeroBanner";
import ShopByGrid, { ShopByItem } from "@/components/ShopByGrid";
import TrendingMenu from "@/components/TrendingMenu";

// Mock product data - replace with real data from Shopify
const trendingNowProducts = [
  {
    id: "1",
    title: "Hope You Like Dogs - Personalized Wood Sign",
    price: 29.95,
    rating: 4.8,
    reviewCount: 125,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Wood+Sign",
  },
  {
    id: "2",
    title: "Bestie - Vintage Version - Personalized Photo Comfort Tee",
    price: 29.95,
    rating: 4.9,
    reviewCount: 89,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bestie+Tee",
  },
  {
    id: "3",
    title: "It Takes A Long Time To Grow An Old Friend, Bestie Toile De Jouy",
    price: 29.95,
    rating: 5.0,
    reviewCount: 156,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Trinket+Dish",
  },
  {
    id: "4",
    title: "Funny Gifts For Smut Reading Lovers - Custom Acrylic Bookmark",
    price: 22.95,
    rating: 4.7,
    reviewCount: 203,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bookmark",
  },
  {
    id: "5",
    title: "Name In Runes Viking - Personalized Shirt",
    price: 24.95,
    rating: 4.6,
    reviewCount: 78,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Viking+Shirt",
  },
  {
    id: "6",
    title: "King & Queen Custom Couples Photo Drive Safe I Love You",
    price: 24.95,
    rating: 4.9,
    reviewCount: 234,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Keychain",
  },
  {
    id: "7",
    title: "Custom Bestie Photo Trinket Tray For Best Friend Friendship",
    price: 29.95,
    rating: 5.0,
    reviewCount: 167,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Trinket+Tray",
  },
  {
    id: "8",
    title: "Once A Brother, Always A Brother - Personalized Tumbler",
    price: 32.95,
    rating: 4.8,
    reviewCount: 92,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Tumbler",
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

const wearableBlankets = [
  // Wearable blanket products
  {
    id: "11",
    title: "The Best Player Custom Name - Personalized Wearable Blanket",
    price: 59.95,
    rating: 4.9,
    reviewCount: 234,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Gaming+Blanket",
    category: "Wearable blanket",
  },
  {
    id: "12",
    title: "I'm Gaming Do Not Disturb - Personalized Wearable Blanket",
    price: 59.95,
    rating: 4.8,
    reviewCount: 189,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Gaming+Blanket+2",
    category: "Wearable blanket",
  },
  {
    id: "13",
    title:
      "Birth Flower Book Lovers, Books Quotes - Personalized Wearable Blanket",
    price: 59.95,
    rating: 5.0,
    reviewCount: 312,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Reading+Blanket",
    category: "Wearable blanket",
  },
  {
    id: "14",
    title:
      "God Says I Am Name Letter In Bible Toile De Jouy Style - Personalized Wearable Blanket",
    price: 59.95,
    rating: 4.9,
    reviewCount: 156,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Faith+Blanket",
    category: "Wearable blanket",
  },
  // Blanket products
  {
    id: "15",
    title: "Cozy Winter Throw Blanket - Personalized",
    price: 49.95,
    rating: 4.7,
    reviewCount: 145,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Throw+Blanket",
    category: "Blanket",
  },
  {
    id: "16",
    title: "Family Photo Fleece Blanket",
    price: 54.95,
    rating: 4.9,
    reviewCount: 278,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Fleece+Blanket",
    category: "Blanket",
  },
  {
    id: "17",
    title: "Custom Name Knitted Blanket",
    price: 64.95,
    rating: 5.0,
    reviewCount: 189,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Knitted+Blanket",
    category: "Blanket",
  },
  {
    id: "18",
    title: "Personalized Sherpa Blanket",
    price: 59.95,
    rating: 4.8,
    reviewCount: 201,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Sherpa+Blanket",
    category: "Blanket",
  },
  // Shirt products
  {
    id: "19",
    title: "Custom Name T-Shirt - Personalized",
    price: 24.95,
    rating: 4.6,
    reviewCount: 456,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=T-Shirt",
    category: "Shirt",
  },
  {
    id: "20",
    title: "Photo Print T-Shirt",
    price: 29.95,
    rating: 4.8,
    reviewCount: 312,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Photo+T-Shirt",
    category: "Shirt",
  },
  {
    id: "21",
    title: "Vintage Style Custom Shirt",
    price: 27.95,
    rating: 4.7,
    reviewCount: 234,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Vintage+Shirt",
    category: "Shirt",
  },
  {
    id: "22",
    title: "Personalized Long Sleeve Shirt",
    price: 34.95,
    rating: 4.9,
    reviewCount: 189,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Long+Sleeve",
    category: "Shirt",
  },
  // Hoodie products
  {
    id: "23",
    title: "Custom Name Pullover Hoodie",
    price: 44.95,
    rating: 4.8,
    reviewCount: 267,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Pullover+Hoodie",
    category: "Hoodie",
  },
  {
    id: "24",
    title: "Photo Print Zip-Up Hoodie",
    price: 49.95,
    rating: 4.9,
    reviewCount: 198,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Zip+Hoodie",
    category: "Hoodie",
  },
  {
    id: "25",
    title: "Personalized Graphic Hoodie",
    price: 47.95,
    rating: 4.7,
    reviewCount: 156,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Graphic+Hoodie",
    category: "Hoodie",
  },
  {
    id: "26",
    title: "Custom Text Fleece Hoodie",
    price: 45.95,
    rating: 5.0,
    reviewCount: 223,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Fleece+Hoodie",
    category: "Hoodie",
  },
  // Sweatshirt products
  {
    id: "27",
    title: "Personalized Crewneck Sweatshirt",
    price: 39.95,
    rating: 4.8,
    reviewCount: 189,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Crewneck",
    category: "Sweatshirt",
  },
  {
    id: "28",
    title: "Custom Name Sweatshirt",
    price: 42.95,
    rating: 4.9,
    reviewCount: 245,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Sweatshirt",
    category: "Sweatshirt",
  },
  {
    id: "29",
    title: "Photo Print Sweatshirt",
    price: 44.95,
    rating: 4.7,
    reviewCount: 167,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Photo+Sweatshirt",
    category: "Sweatshirt",
  },
  {
    id: "30",
    title: "Personalized Graphic Sweatshirt",
    price: 41.95,
    rating: 4.8,
    reviewCount: 201,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Graphic+Sweatshirt",
    category: "Sweatshirt",
  },
  // Fleece scarf products
  {
    id: "31",
    title: "Custom Name Fleece Scarf",
    price: 19.95,
    rating: 4.9,
    reviewCount: 134,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Fleece+Scarf",
    category: "Fleece scarf",
  },
  {
    id: "32",
    title: "Personalized Photo Scarf",
    price: 24.95,
    rating: 4.8,
    reviewCount: 98,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Photo+Scarf",
    category: "Fleece scarf",
  },
  {
    id: "33",
    title: "Custom Text Fleece Scarf",
    price: 22.95,
    rating: 5.0,
    reviewCount: 156,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Text+Scarf",
    category: "Fleece scarf",
  },
  {
    id: "34",
    title: "Personalized Pattern Scarf",
    price: 21.95,
    rating: 4.7,
    reviewCount: 112,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Pattern+Scarf",
    category: "Fleece scarf",
  },
];

const wearableCategories = [
  { name: "Wearable blanket" },
  { name: "Blanket" },
  { name: "Shirt" },
  { name: "Hoodie" },
  { name: "Sweatshirt" },
  { name: "Fleece scarf" },
];

const leggingsProducts = [
  {
    id: "35",
    title: "This Ass Is Taken - Naughty Gifts For Wife - Personalized Leggings",
    price: 32.95,
    rating: 4.8,
    reviewCount: 234,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Leggings+1",
    category: "Leggings",
  },
  {
    id: "36",
    title:
      "This A$$ Belongs To - Naughty Gifts For Wife, Girlfriend - Personalized Leggings",
    price: 39.95,
    rating: 4.9,
    reviewCount: 189,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Leggings+2",
    category: "Leggings",
  },
  {
    id: "37",
    title:
      "He Always Has My Back - Naughty Gift For Wife, Girlfriend - Personalized Leggings",
    price: 32.95,
    rating: 4.7,
    reviewCount: 156,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Leggings+3",
    category: "Leggings",
  },
  {
    id: "38",
    title: "Custom Birth Flower With Name - Personalized Leggings",
    price: 32.95,
    rating: 5.0,
    reviewCount: 278,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Leggings+4",
    category: "Leggings",
  },
  // Jewelry dish products
  {
    id: "39",
    title: "Personalized Jewelry Dish - Custom Name",
    price: 19.95,
    rating: 4.8,
    reviewCount: 145,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Jewelry+Dish+1",
    category: "Jewelry dish",
  },
  {
    id: "40",
    title: "Custom Photo Jewelry Tray",
    price: 24.95,
    rating: 4.9,
    reviewCount: 198,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Jewelry+Dish+2",
    category: "Jewelry dish",
  },
  {
    id: "41",
    title: "Personalized Trinket Dish",
    price: 22.95,
    rating: 4.7,
    reviewCount: 167,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Jewelry+Dish+3",
    category: "Jewelry dish",
  },
  {
    id: "42",
    title: "Custom Name Ceramic Dish",
    price: 21.95,
    rating: 5.0,
    reviewCount: 223,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Jewelry+Dish+4",
    category: "Jewelry dish",
  },
  // Mug products
  {
    id: "43",
    title: "Personalized Photo Mug",
    price: 24.95,
    rating: 4.8,
    reviewCount: 456,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Mug+1",
    category: "Mug",
  },
  {
    id: "44",
    title: "Custom Name Coffee Mug",
    price: 22.95,
    rating: 4.9,
    reviewCount: 312,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Mug+2",
    category: "Mug",
  },
  {
    id: "45",
    title: "Personalized Quote Mug",
    price: 24.95,
    rating: 4.7,
    reviewCount: 234,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Mug+3",
    category: "Mug",
  },
  {
    id: "46",
    title: "Custom Couple Mug Set",
    price: 49.95,
    rating: 5.0,
    reviewCount: 189,
    image: "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Mug+4",
    category: "Mug",
  },
  // Bottle lamp products
  {
    id: "47",
    title: "Personalized Photo Bottle Lamp",
    price: 34.95,
    rating: 4.8,
    reviewCount: 145,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bottle+Lamp+1",
    category: "Bottle lamp",
  },
  {
    id: "48",
    title: "Custom Name LED Bottle Lamp",
    price: 39.95,
    rating: 4.9,
    reviewCount: 198,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bottle+Lamp+2",
    category: "Bottle lamp",
  },
  {
    id: "49",
    title: "Personalized 3D Bottle Lamp",
    price: 44.95,
    rating: 4.7,
    reviewCount: 167,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bottle+Lamp+3",
    category: "Bottle lamp",
  },
  {
    id: "50",
    title: "Custom Photo Bottle Light",
    price: 42.95,
    rating: 5.0,
    reviewCount: 223,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Bottle+Lamp+4",
    category: "Bottle lamp",
  },
  // Suncatcher products
  {
    id: "51",
    title: "Personalized Suncatcher Ornament",
    price: 24.95,
    rating: 4.8,
    reviewCount: 134,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Suncatcher+1",
    category: "Suncatcher",
  },
  {
    id: "52",
    title: "Custom Name Suncatcher",
    price: 22.95,
    rating: 4.9,
    reviewCount: 98,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Suncatcher+2",
    category: "Suncatcher",
  },
  {
    id: "53",
    title: "Personalized Photo Suncatcher",
    price: 26.95,
    rating: 4.7,
    reviewCount: 156,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Suncatcher+3",
    category: "Suncatcher",
  },
  {
    id: "54",
    title: "Custom Design Suncatcher",
    price: 24.95,
    rating: 5.0,
    reviewCount: 112,
    image:
      "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Suncatcher+4",
    category: "Suncatcher",
  },
];

const leggingsCategories = [
  { name: "Leggings" },
  { name: "Jewelry dish" },
  { name: "Mug" },
  { name: "Bottle lamp" },
  { name: "Suncatcher" },
];

const shopByRecipientItems: ShopByItem[] = [
  {
    name: "For Bestie",
    href: "/recipients/bestie",
    image: "https://via.placeholder.com/256x256/FF6B9D/FFFFFF?text=Bestie",
  },
  {
    name: "For Partner",
    href: "/recipients/partner",
    image: "https://via.placeholder.com/256x256/E91E63/FFFFFF?text=Partner",
  },
  {
    name: "For Sibling",
    href: "/recipients/sibling",
    image: "https://via.placeholder.com/256x256/9C27B0/FFFFFF?text=Sibling",
  },
  {
    name: "For Pet Lover",
    href: "/recipients/pet-lover",
    image: "https://via.placeholder.com/256x256/FF9800/FFFFFF?text=Pet",
  },
  {
    name: "For Family",
    href: "/recipients/family",
    image: "https://via.placeholder.com/256x256/2196F3/FFFFFF?text=Family",
  },
  {
    name: "For Mom",
    href: "/recipients/mom",
    image: "https://via.placeholder.com/256x256/EC407A/FFFFFF?text=Mom",
  },
  {
    name: "For Dad",
    href: "/recipients/dad",
    image: "https://via.placeholder.com/256x256/4A90E2/FFFFFF?text=Dad",
  },
  {
    name: "For Kid & Baby",
    href: "/recipients/kid-baby",
    image: "https://via.placeholder.com/256x256/FFC107/FFFFFF?text=Kid",
  },
];

const shopByProductItems: ShopByItem[] = [
  {
    name: "Car Accessories",
    href: "/products/car-accessories",
    image: "https://via.placeholder.com/400x400/607D8B/FFFFFF?text=Car",
  },
  {
    name: "Mug",
    href: "/products/mug",
    image: "https://via.placeholder.com/400x400/795548/FFFFFF?text=Mug",
  },
  {
    name: "Sweatpants",
    href: "/products/sweatpants",
    image: "https://via.placeholder.com/400x400/9E9E9E/FFFFFF?text=Pants",
  },
  {
    name: "Toiletry Bag",
    href: "/products/toiletry-bag",
    image: "https://via.placeholder.com/400x400/8D6E63/FFFFFF?text=Bag",
  },
  {
    name: "Jewelry Dish",
    href: "/products/jewelry-dish",
    image: "https://via.placeholder.com/400x400/E1BEE7/FFFFFF?text=Dish",
  },
  {
    name: "Blanket",
    href: "/products/blanket",
    image: "https://via.placeholder.com/400x400/FFE082/FFFFFF?text=Blanket",
  },
  {
    name: "Wearable Blanket",
    href: "/products/wearable-blanket",
    image: "https://via.placeholder.com/400x400/BBDEFB/FFFFFF?text=Wearable",
  },
  {
    name: "Doormat",
    href: "/products/doormat",
    image: "https://via.placeholder.com/400x400/BCAAA4/FFFFFF?text=Mat",
  },
  {
    name: "Pillow",
    href: "/products/pillow",
    image: "https://via.placeholder.com/400x400/C5E1A5/FFFFFF?text=Pillow",
  },
  {
    name: "Ugly Sweater",
    href: "/products/ugly-sweater",
    image: "https://via.placeholder.com/400x400/EF5350/FFFFFF?text=Sweater",
  },
  {
    name: "Puzzle",
    href: "/products/puzzle",
    image: "https://via.placeholder.com/400x400/AB47BC/FFFFFF?text=Puzzle",
  },
  {
    name: "Runner Rug",
    href: "/products/runner-rug",
    image: "https://via.placeholder.com/400x400/78909C/FFFFFF?text=Rug",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Icons Section */}
      <TrendingMenu />

      {/* Valentine's Gifts Hero Banner */}
      <HeroBanner
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {trendingNowProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center">
            <CollectionButton href="/products">SHOP ALL</CollectionButton>
          </div>
        </div>
      </section>

      {/* Winter Gifts Banner */}
      <HeroBanner
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
        products={wearableBlankets}
        categories={wearableCategories}
        collectionHref="/apparel"
      />

      {/* Gifts For Her Banner */}
      <HeroBanner
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
      <FilterableProductSection
        products={leggingsProducts}
        categories={leggingsCategories}
        collectionHref="/apparel/leggings"
      />

      {/* Shop By Recipient Section */}
      <ShopByGrid
        title="Shop By Recipient"
        items={shopByRecipientItems}
        shape="circle"
        columns={{ mobile: 2, tablet: 4, desktop: 4 }}
      />

      {/* Shop By Product Section */}
      <ShopByGrid
        title="Shop By Product"
        items={shopByProductItems}
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
