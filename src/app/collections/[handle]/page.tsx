/** @format */

import { Metadata } from "next";
import {
  getCollectionByHandle,
  getCollectionProductsWithPagination,
} from "@/libs/shopify";
import CollectionsClient from "@/components/collections/CollectionsClient";
import { FilterOption } from "@/components/collections/FilterSidebar";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{
    sort?: string;
    view?: string;
    page?: string;
    occasion?: string;
    recipient?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: collection.title,
    description:
      collection.description || `Browse ${collection.title} collection`,
  };
}

// Helper function to extract filter options from products
function extractFilterOptions(products: any[]) {
  const occasions: Map<string, number> = new Map();
  const recipients: Map<string, number> = new Map();
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((product) => {
    // Extract price range
    const productMinPrice = parseFloat(
      product.priceRange?.minVariantPrice?.amount || "0"
    );
    const productMaxPrice = parseFloat(
      product.priceRange?.maxVariantPrice?.amount || "0"
    );
    minPrice = Math.min(minPrice, productMinPrice);
    maxPrice = Math.max(maxPrice, productMaxPrice);

    // Extract tags for occasions and recipients
    const tags = product.tags || [];
    tags.forEach((tag: string) => {
      const lowerTag = tag.toLowerCase();

      // Check for occasions (you can customize these patterns)
      if (
        lowerTag.includes("halloween") ||
        lowerTag.includes("valentine") ||
        lowerTag.includes("christmas") ||
        lowerTag.includes("birthday") ||
        lowerTag.includes("anniversary")
      ) {
        const key = tag;
        occasions.set(key, (occasions.get(key) || 0) + 1);
      }

      // Check for recipients (you can customize these patterns)
      if (
        lowerTag.includes("pet") ||
        lowerTag.includes("family") ||
        lowerTag.includes("wife") ||
        lowerTag.includes("husband") ||
        lowerTag.includes("friend")
      ) {
        const key = tag;
        recipients.set(key, (recipients.get(key) || 0) + 1);
      }
    });
  });

  // Convert to FilterOption arrays
  const occasionOptions: FilterOption[] = Array.from(occasions.entries())
    .map(([value, count]) => ({
      value: value.toLowerCase().replace(/\s+/g, "-"),
      label: value,
      count,
    }))
    .slice(0, 10); // Limit to top 10

  const recipientOptions: FilterOption[] = Array.from(recipients.entries())
    .map(([value, count]) => ({
      value: value.toLowerCase().replace(/\s+/g, "-"),
      label: value,
      count,
    }))
    .slice(0, 10); // Limit to top 10

  return {
    occasions: occasionOptions,
    recipients: recipientOptions,
    priceRange: {
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { handle } = await params;
  const search = await searchParams;

  // Get collection info
  const collection = await getCollectionByHandle(handle);
  if (!collection) {
    notFound();
  }

  // Get initial products to extract filter options and calculate total count
  // We'll fetch a larger sample to get accurate filter counts and total count
  const initialResult = await getCollectionProductsWithPagination({
    collection: handle,
    sortKey: "BEST_SELLING",
    first: 250, // Fetch more to get better filter options and approximate total count
  });

  // Extract filter options from products
  const filterOptions = extractFilterOptions(initialResult.products);

  // Calculate total count from all fetched products (approximate)
  let allProducts = initialResult.products;

  // Get filtered products based on search params
  const sortBy = (search.sort as any) || "BEST_SELLING";
  const page = parseInt(search.page || "1", 10);
  const occasion = search.occasion || "";
  const recipient = search.recipient || "";
  const minPrice = search.minPrice
    ? parseFloat(search.minPrice)
    : filterOptions.priceRange.min;
  const maxPrice = search.maxPrice
    ? parseFloat(search.maxPrice)
    : filterOptions.priceRange.max;

  // Build filters
  const filters = {
    occasions: occasion ? [occasion] : [],
    recipients: recipient ? [recipient] : [],
    minPrice: minPrice !== filterOptions.priceRange.min ? minPrice : undefined,
    maxPrice: maxPrice !== filterOptions.priceRange.max ? maxPrice : undefined,
  };

  // Apply filters to all products to get accurate total count
  let filteredAllProducts = allProducts;

  // Filter by price
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredAllProducts = filteredAllProducts.filter((product) => {
      const productMinPrice = parseFloat(
        product.priceRange?.minVariantPrice?.amount || "0"
      );
      const productMaxPrice = parseFloat(
        product.priceRange?.maxVariantPrice?.amount || "0"
      );

      if (
        filters.minPrice !== undefined &&
        productMaxPrice < filters.minPrice
      ) {
        return false;
      }
      if (
        filters.maxPrice !== undefined &&
        productMinPrice > filters.maxPrice
      ) {
        return false;
      }
      return true;
    });
  }

  // Filter by tags
  if (filters.occasions.length > 0 || filters.recipients.length > 0) {
    filteredAllProducts = filteredAllProducts.filter((product) => {
      const productTags = product.tags || [];

      if (filters.occasions.length > 0) {
        const hasOccasion = filters.occasions.some((tag) =>
          productTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasOccasion) return false;
      }

      if (filters.recipients.length > 0) {
        const hasRecipient = filters.recipients.some((tag) =>
          productTags.some((pt) => pt.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasRecipient) return false;
      }

      return true;
    });
  }

  // Calculate total count from filtered products
  const totalCount = filteredAllProducts.length;

  // Calculate pagination
  const pageSize = 16;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredAllProducts.slice(startIndex, endIndex);

  return (
    <CollectionsClient
      initialProducts={paginatedProducts}
      totalCount={totalCount}
      collectionHandle={handle}
      occasions={filterOptions.occasions}
      recipients={filterOptions.recipients}
      priceRange={filterOptions.priceRange}
    />
  );
}
