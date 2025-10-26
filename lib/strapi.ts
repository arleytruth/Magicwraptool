import "server-only";

import { headers } from "next/headers";

import { publicEnv, serverEnv } from "@/lib/env";

interface FetchStrapiOptions<T> {
    fallback: T;
    revalidate?: number;
    query?: Record<string, string>;
    cacheTag?: string;
}

async function buildUrl(path: string, query?: Record<string, string>) {
    if (!serverEnv.STRAPI_BASE_URL) {
        return null;
    }

    const url = new URL(path, serverEnv.STRAPI_BASE_URL);
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.set(key, value);
        }
    }
    return url;
}

export async function fetchStrapi<T>(
    path: string,
    options: FetchStrapiOptions<T>,
): Promise<T> {
    const url = await buildUrl(path, options.query);
    if (!url) {
        return options.fallback;
    }

    try {
        const requestHeaders = new Headers();
        requestHeaders.set("Accept", "application/json");
        if (serverEnv.STRAPI_TOKEN) {
            requestHeaders.set("Authorization", `Bearer ${serverEnv.STRAPI_TOKEN}`);
        }
        requestHeaders.set("X-Site-Url", publicEnv.NEXT_PUBLIC_SITE_URL);

        const response = await fetch(url, {
            headers: requestHeaders,
            next: {
                revalidate: options.revalidate ?? 60,
                tags: options.cacheTag ? [options.cacheTag] : undefined,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Strapi request failed: ${response.status} ${response.statusText}`,
            );
        }

        return (await response.json()) as T;
    } catch (error) {
        console.warn(
            "[strapi] Request failed, returning fallback content.",
            error,
        );
        return options.fallback;
    }
}

export function getPreviewTokenFromHeaders() {
    const hdrs = headers();
    return hdrs.get("x-strapi-preview-token");
}

