/** @format */

import { getMenu } from "@/libs/shopify";
import { transformShopifyImageUrl } from "@/utils/image";
import CategoryIcon from "../ui/nav/CategoryIcon";

export interface TrendingCategory {
  name: string;
  href: string;
  image: string;
}

export default async function TrendingMenu() {
  const trendingMenu = await getMenu("trending-menu");
  let categories: TrendingCategory[] = [];
  if (trendingMenu.length > 0) {
    categories = trendingMenu.map((category) => ({
      name: category.title,
      href: category.path,
      image: transformShopifyImageUrl(category.image?.url, 128) || "",
    }));
  }
  return (
    <section className="py-8 bg-white border-b border-gray-100 overflow-x-visible">
      <div className="container mx-auto px-4 lg:px-4">
        {/* Mobile: Horizontal scroll */}
        <div className="flex items-center gap-6 lg:gap-12 lg:justify-center overflow-x-auto scrollbar-hide pb-2 lg:overflow-x-visible lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((category) => (
            <div key={category.name} className="shrink-0">
              <CategoryIcon
                name={category.name}
                href={category.href}
                image={category.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
