/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "../constants";
import { ensureStartsWith } from "../utils";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getProductsQuery } from "./queries/product";
import { isShopifyError } from "./queries/type-guard";
import {
  Connection,
  Image,
  Menu,
  Product,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyMenuOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductsOperation,
} from "./types";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Validate environment variables
if (!domain || !key) {
  console.warn(
    "⚠️  Shopify environment variables are not set. Some features may not work."
  );
}
type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key || "",
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });
    const body = await res.json();
    if (body.errors) {
      throw body.errors[0];
    }
    return { status: res.status, body };
  } catch (error) {
    if (isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "Unknown error",
        status: error.status || 500,
        message: error.message,
        query,
      };
    }
    throw {
      error,
      query,
    };
  }
}

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

function reshapeImages(images: Connection<Image>, productTitle: string) {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
}

function reshapeProduct(
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
}

function reshapeProducts(products: ShopifyProduct[]) {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  // Return empty array if environment variables are not set (during build)
  if (!domain || !key) {
    console.warn(
      `⚠️  Shopify environment variables not set. Skipping menu fetch for "${handle}".`
    );
    return [];
  }

  try {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      cache: "force-cache",
      query: getMenuQuery,
      tags: [TAGS.collections],
      variables: {
        handle,
      },
    });

    return (
      res.body?.data?.menu?.items.map(
        (item: {
          title: string;
          url: string;
          resource?: {
            id: string;
            image?: {
              url: string;
              altText?: string;
              width?: number;
              height?: number;
            };
          };
        }) => ({
          title: item.title,
          path: item.url
            .replace(domain, "")
            .replace("/collections/", "/search")
            .replace("/pages", ""),
          ...(item.resource?.image && {
            image: {
              url: item.resource.image.url,
              altText: item.resource.image.altText,
              width: item.resource.image.width,
              height: item.resource.image.height,
            },
          }),
        })
      ) || []
    );
  } catch (error) {
    console.error(`❌ Error fetching menu "${handle}":`, error);
    // Return empty array instead of throwing to allow build to continue
    return [];
  }
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  first,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  first?: number;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      first: first || undefined,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollectionByHandle(
  handle: string
): Promise<ShopifyCollection | null> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  const collection = res.body?.data?.collection;

  if (!collection) {
    return null;
  }

  return {
    title: collection.title,
    description: collection.description || "",
    ...(collection.image && {
      image: {
        url: collection.image.url,
        altText: collection.image.altText || "",
        width: collection.image.width || 0,
        height: collection.image.height || 0,
      },
    }),
    ...(collection.seo && {
      seo: {
        title: collection.seo.title || "",
        description: collection.seo.description || "",
      },
    }),
  } as ShopifyCollection;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.

  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "default");
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "default");
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
