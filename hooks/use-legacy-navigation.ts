"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavigateOptions = {
    replace?: boolean;
};

export function useLegacyNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const location = `${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const setLocation = (href: string, options?: NavigateOptions) => {
        if (options?.replace) {
            router.replace(href);
        } else {
            router.push(href);
        }
    };

    return [location, setLocation] as const;
}

