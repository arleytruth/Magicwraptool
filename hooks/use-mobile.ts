"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
    const query = `(max-width: ${breakpoint}px)`;
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") {
            return false;
        }
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Sync state in case match status changed before effect ran.
        setIsMobile(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, [query]);

    return isMobile;
}

