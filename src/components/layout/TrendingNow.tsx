/** @format */

// src/components/TrendingNow.tsx
/** @format */

import ProductCard from "../product/ProductCard";
import CollectionButton from "../ui/nav/CollectionButton";
import { getCollectionProducts } from "@/libs/shopify";

interface TrendingNowSectionProps {
  title?: string;
  collectionHandle?: string;
  limit?: number;
  shopAllHref?: string;
  shopAllText?: string;
}

export default async function TrendingNow({
  title = "Trending Now",
  collectionHandle = "best-sellers",
  limit = 8,
}: TrendingNowSectionProps) {
  const shopAllHref = `/collections/${collectionHandle}`;
  const shopAllText = "SHOP ALL";

  // Fetch products từ collection
  const products = await getCollectionProducts({
    collection: collectionHandle,
    sortKey: "BEST_SELLING",
    reverse: false,
    first: limit,
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showBadge={true} />
          ))}
        </div>
        <div className="text-center">
          <CollectionButton href={shopAllHref}>{shopAllText}</CollectionButton>
        </div>
      </div>
    </section>
  );
}
