/** @format */

import { NextRequest, NextResponse } from "next/server";
import { getCollectionProductsWithPagination } from "@/libs/shopify";
import { Product } from "@/libs/shopify/types";

// Cache configuration
const CACHE_TTL = 300; // 5 minutes

interface QueryParams {
  categories?: string;
  brands?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  tags?: string;
  sortBy?: string;
  page?: string;
  pageSize?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const rating = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating")!)
      : undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const sortBy = (searchParams.get("sortBy") as any) || "BEST_SELLING";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "16", 10);

    // For now, we'll use the collection handle from URL or default
    // In production, you'd determine collection from filters
    const collectionHandle = searchParams.get("collection") || "all";

    // Fetch products (fetch more to account for filtering)
    const fetchSize = pageSize * 10; // Fetch 10x to handle filtering
    const { products, pageInfo } = await getCollectionProductsWithPagination({
      collection: collectionHandle,
      sortKey: sortBy,
      first: fetchSize,
    });

    // Apply filters
    let filteredProducts = products;

    // Filter by price
    if (minPrice !== undefined || maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => {
        const productMinPrice = parseFloat(
          product.priceRange?.minVariantPrice?.amount || "0"
        );
        const productMaxPrice = parseFloat(
          product.priceRange?.maxVariantPrice?.amount || "0"
        );

        if (minPrice !== undefined && productMaxPrice < minPrice) {
          return false;
        }
        if (maxPrice !== undefined && productMinPrice > maxPrice) {
          return false;
        }
        return true;
      });
    }

    // Filter by tags
    if (tags.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const productTags = product.tags || [];
        return tags.some((tag) =>
          productTags.some((pt) =>
            pt.toLowerCase().includes(tag.toLowerCase())
          )
        );
      });
    }

    // Filter by categories (using tags for now)
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const productTags = product.tags || [];
        return categories.some((cat) =>
          productTags.some((pt) =>
            pt.toLowerCase().includes(cat.toLowerCase())
          )
        );
      });
    }

    // Calculate pagination
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Transform to lightweight list format
    const listProducts = paginatedProducts.map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: parseFloat(product.priceRange?.minVariantPrice?.amount || "0"),
      compareAtPrice: parseFloat(
        product.priceRange?.maxVariantPrice?.amount || "0"
      ),
      image: product.featuredImage?.url || product.images?.[0]?.url || "",
      inStock: product.availableForSale,
      rating: 4.5, // TODO: Get from reviews
      reviewCount: 0, // TODO: Get from reviews
      tags: product.tags || [],
      category: "", // TODO: Extract from tags or collection
      brand: "", // TODO: Extract from product
    }));

    // Calculate available filter options from all filtered products
    const availableCategories = new Map<string, number>();
    const availableBrands = new Map<string, number>();
    let priceMin = Infinity;
    let priceMax = 0;

    filteredProducts.forEach((product) => {
      const price = parseFloat(
        product.priceRange?.minVariantPrice?.amount || "0"
      );
      priceMin = Math.min(priceMin, price);
      priceMax = Math.max(priceMax, price);

      // Extract categories and brands from tags
      product.tags?.forEach((tag) => {
        const lowerTag = tag.toLowerCase();
        if (
          lowerTag.includes("category") ||
          lowerTag.includes("occasion") ||
          lowerTag.includes("recipient")
        ) {
          availableCategories.set(tag, (availableCategories.get(tag) || 0) + 1);
        }
        if (lowerTag.includes("brand")) {
          availableBrands.set(tag, (availableBrands.get(tag) || 0) + 1);
        }
      });
    });

    const response = NextResponse.json({
      products: listProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize,
      },
      filters: {
        availableCategories: Array.from(availableCategories.entries()).map(
          ([name, count]) => ({ id: name, name, count })
        ),
        availableBrands: Array.from(availableBrands.entries()).map(
          ([name, count]) => ({ id: name, name, count })
        ),
        priceRange: {
          min: Math.floor(priceMin),
          max: Math.ceil(priceMax),
        },
      },
    });

    // Set cache headers
    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60`
    );

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
