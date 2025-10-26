"use client";

import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
} from "react";
import { useClerk } from "@clerk/nextjs";

type AuthMode = "login" | "signup";

interface AuthModalOptions {
    redirectTo?: string;
    title?: string;
    description?: string;
    initialMode?: AuthMode;
}

interface AuthModalContextValue {
    openAuthModal: (options?: AuthModalOptions) => void;
    closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
    undefined,
);

export function AuthModalProvider({ children }: PropsWithChildren) {
    const { openSignIn, openSignUp } = useClerk();

    const openAuthModal = useCallback(
        (options?: AuthModalOptions) => {
            const mode = options?.initialMode ?? "signup";
            const redirectUrl = options?.redirectTo ?? "/generate";

            if (mode === "login") {
                openSignIn({ redirectUrl });
                return;
            }

            openSignUp({ redirectUrl });
        },
        [openSignIn, openSignUp],
    );

    const closeAuthModal = useCallback(() => {
        // Clerk handles modal lifecycle internally.
    }, []);

    return (
        <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);

    if (!context) {
        throw new Error("useAuthModal must be used within AuthModalProvider");
    }

    return context;
}

