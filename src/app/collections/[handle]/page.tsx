/** @format */

import { Metadata } from "next";
import {
  getCollectionByHandle,
  getCollectionProductsWithPagination,
} from "@/libs/shopify";
import { getFilteredCollectionProducts, CollectionFilters } from "@/components/collections/actions";
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
function extractFilterOptions(products: any[], shopifyFilters?: any[]) {
  const occasions: Map<string, number> = new Map();
  const recipients: Map<string, number> = new Map();
  let minPrice = Infinity;
  let maxPrice = 0;

  // Try to get price range from Shopify's native filters first (more accurate)
  if (shopifyFilters) {
    const priceFilter = shopifyFilters.find(f => f.type === 'PRICE_RANGE' || f.id === 'filter.v.price');
    if (priceFilter && priceFilter.values && priceFilter.values.length > 0) {
      try {
        const input = JSON.parse(priceFilter.values[0].input);
        if (input.price) {
          if (input.price.min !== undefined) minPrice = input.price.min;
          if (input.price.max !== undefined) maxPrice = input.price.max;
        }
      } catch (e) {
        console.error("Error parsing price filter:", e);
      }
    }
  }

  // If Shopify filters didn't provide range, or we need to fallback/refine
  if (minPrice === Infinity || maxPrice === 0) {
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

      // Extract tags (already commented out in previous step, but keep logic for structure)
      const tags = product.tags || [];
      tags.forEach((tag: string) => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes("halloween") || lowerTag.includes("valentine") || lowerTag.includes("christmas") || lowerTag.includes("birthday") || lowerTag.includes("anniversary")) {
          occasions.set(tag, (occasions.get(tag) || 0) + 1);
        }
        if (lowerTag.includes("pet") || lowerTag.includes("family") || lowerTag.includes("wife") || lowerTag.includes("husband") || lowerTag.includes("friend")) {
          recipients.set(tag, (recipients.get(tag) || 0) + 1);
        }
      });
    });
  }

  // Convert to FilterOption arrays
  const occasionOptions: FilterOption[] = Array.from(occasions.entries())
    .map(([value, count]) => ({
      value: value.toLowerCase().replace(/\s+/g, "-"),
      label: value,
      count,
    })).slice(0, 10);

  const recipientOptions: FilterOption[] = Array.from(recipients.entries())
    .map(([value, count]) => ({
      value: value.toLowerCase().replace(/\s+/g, "-"),
      label: value,
      count,
    })).slice(0, 10);

  return {
    occasions: occasionOptions,
    recipients: recipientOptions,
    priceRange: {
      min: minPrice === Infinity ? 0 : Math.floor(minPrice),
      max: maxPrice === 0 ? 1000 : Math.ceil(maxPrice),
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
  const filterOptions = extractFilterOptions(initialResult.products, initialResult.filters);

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

  // Build filters from search params
  const filters: CollectionFilters = {
    occasions: occasion ? [occasion] : [],
    recipients: recipient ? [recipient] : [],
    minPrice: minPrice !== filterOptions.priceRange.min ? minPrice : undefined,
    maxPrice: maxPrice !== filterOptions.priceRange.max ? maxPrice : undefined,
  };

  // Use the same function as client-side to get initial data
  const result = await getFilteredCollectionProducts(handle, {
    sortBy,
    page,
    pageSize: 16,
    filters,
  });

  return (
    <CollectionsClient
      initialProducts={result.products}
      totalCount={result.totalCount}
      collectionHandle={handle}
      occasions={filterOptions.occasions}
      recipients={filterOptions.recipients}
      priceRange={filterOptions.priceRange}
    />
  );
}
