"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const isLight = resolvedTheme === "light";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-5 w-5 opacity-50" />
                <span className="sr-only">Temayı değiştir</span>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            data-testid="button-theme-toggle"
        >
            {isLight ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Temayı değiştir</span>
        </Button>
    );
}
