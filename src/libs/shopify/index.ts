import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { ensureStartsWith } from "../utils";
import { getMenuQuery } from "./queries/menu";
import { isShopifyError } from "./queries/type-guard";
import { Menu, ShopifyMenuOperation } from "./types";


const domain = process.env.SHOPIFY_STORE_DOMAIN ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://") : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
type ExtractVariables<T> = T extends { variables: object} ? T["variables"] : never;
export async function shopifyFetch<T>({
    cache = "force-cache",
    headers,
    query,
    tags,
    variables
    }: {
        cache?: RequestCache, 
        headers?: HeadersInit,
        query: string,
        tags?: string[],
        variables?: ExtractVariables<T>
    }) : Promise<{status: number, body: T}> {
    try {
        console.log("Endpoint: ", endpoint);
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": key || "",
                ...headers
            },
            body: JSON.stringify({
                ...(query && {query}),
                ...(variables && {variables})
            }),
            cache,
            ...(tags && {next: {tags}})
        });
        console.log("Response: ", res);
        const body = await res.json();
        if (body.errors) {
            throw body.errors[0];
        }
        return {status: res.status, body};
    } catch (error) {
        if (isShopifyError(error)) {
            throw {
                cause: error.cause?.toString() || "Unknown error",
                status: error.status || 500,
                message: error.message,
                query,
            }
        }
        throw {
            error,
            query,
        }
    }
}

export async function getMenu(handle: string) : Promise<Menu[]> {
    const res = await shopifyFetch<ShopifyMenuOperation>({
        query: getMenuQuery,
        tags: [TAGS.collections],
        variables: {
            handle
        }
    });
    
    return (
        res.body?.data?.menu?.items.map((item : {
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
            path: item.url.replace(domain, "").replace("/collections/", "/search").replace("/pages", ""),
            ...(item.resource?.image && {
                image: {
                    url: item.resource.image.url,
                    altText: item.resource.image.altText,
                    width: item.resource.image.width,
                    height: item.resource.image.height,
                }
            })
        })) || []
    )
}
