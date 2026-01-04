/** @format */

import { getMenu } from "@/libs/shopify";
import { transformShopifyImageUrl } from "@/utils/image";
import CategoryIcon from "../ui/icon/CategoryIcon";

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
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {categories.map((category) => (
            <CategoryIcon
              key={category.name}
              name={category.name}
              href={category.href}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

