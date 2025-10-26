import type { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllPages } from "@/lib/sanity/queries";

type NavLink = {
    title: string;
    href: string;
};

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pages = await getAllPages();
    const navLinks: NavLink[] = Array.isArray(pages)
        ? pages
              .filter(
                  (page: any) =>
                      page?.showInNav &&
                      page?.slug?.current &&
                      page?.archived !== true,
              )
              .map((page: any) => ({
                  title: (page.navLabel as string) || (page.title as string),
                  href: `/${page.slug.current}`,
              }))
        : [];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header navLinks={navLinks} />
            <main className="flex-1">{children}</main>
            <Footer navLinks={navLinks} />
        </div>
    );
}
