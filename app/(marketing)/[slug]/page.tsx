import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type {
    PortableTextComponentProps,
    PortableTextComponents,
    PortableTextMarkComponentProps,
} from "@portabletext/react";

import { Button } from "@/components/ui/button";
import { getAllPages, getPageBySlug } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

type Props = {
    params: Promise<{ slug: string }>;
};

const heroBackgroundVariants: Record<string, string> = {
    muted: "bg-muted/30 border border-border/80",
    light: "bg-background border border-border/80",
    dark: "bg-foreground text-background border border-foreground/20",
};

const ctaBackgroundVariants: Record<string, string> = {
    subtle: "bg-muted/30 border border-border/60",
    accent: "bg-primary/10 border border-primary/30",
    dark: "bg-foreground text-background border border-foreground/20",
};

// Statik sayfa oluşturma için slug listesi
export async function generateStaticParams() {
    const pages = await getAllPages();

    return pages.map((page: any) => ({
        slug: page.slug.current,
    }));
}

function buildOgImage(page: any) {
    if (!page?.seo?.ogImage) {
        return undefined;
    }

    try {
        return urlFor(page.seo.ogImage).width(1200).height(630).fit("crop").url();
    } catch {
        return undefined;
    }
}

// Metadata oluştur
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        return {
            title: "Sayfa Bulunamadı",
        };
    }

    const metaTitle =
        page.seo?.metaTitle?.trim() || (page.title as string) || "Magic Wrapper";
    const metaDescription =
        page.seo?.metaDescription?.trim() ||
        page.metaDescription?.trim() ||
        page.title;
    const ogImageUrl = buildOgImage(page);

    return {
        title: metaTitle,
        description: metaDescription,
        openGraph: ogImageUrl
            ? {
                  title: metaTitle,
                  description: metaDescription,
                  images: [
                      {
                          url: ogImageUrl,
                          alt:
                              page.seo?.ogImage?.alt ??
                              `${metaTitle} sosyal paylaşım görseli`,
                      },
                  ],
              }
            : undefined,
        robots: page.seo?.noIndex
            ? {
                  index: false,
                  follow: false,
              }
            : undefined,
    };
}

// Sayfa her istekte yeniden oluşturulsun
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const heroMediaUrl =
        page.hero?.media && page.hero.media.asset
            ? (() => {
                  try {
                      return urlFor(page.hero.media).width(1600).quality(85).url();
                  } catch {
                      return null;
                  }
              })()
            : null;

    const portableComponents: PortableTextComponents = {
        block: {
            h1: ({ children }: PortableTextComponentProps<any>) => (
                <h2 className="mt-12 mb-6 text-3xl font-bold tracking-tight text-foreground">
                    {children ?? null}
                </h2>
            ),
            h2: ({ children }: PortableTextComponentProps<any>) => (
                <h3 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-foreground">
                    {children ?? null}
                </h3>
            ),
            h3: ({ children }: PortableTextComponentProps<any>) => (
                <h4 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground">
                    {children ?? null}
                </h4>
            ),
            normal: ({ children }: PortableTextComponentProps<any>) => (
                <p className="mb-4 leading-relaxed text-muted-foreground">
                    {children ?? null}
                </p>
            ),
            blockquote: ({ children }: PortableTextComponentProps<any>) => (
                <blockquote className="my-6 border-l-4 border-primary/50 pl-5 italic text-muted-foreground">
                    {children ?? null}
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }: PortableTextComponentProps<any>) => (
                <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
                    {children ?? null}
                </ul>
            ),
            number: ({ children }: PortableTextComponentProps<any>) => (
                <ol className="mb-6 list-decimal space-y-2 pl-6 text-muted-foreground">
                    {children ?? null}
                </ol>
            ),
        },
        marks: {
            strong: ({ children }: PortableTextMarkComponentProps<any>) => (
                <strong className="font-semibold text-foreground">
                    {children ?? null}
                </strong>
            ),
            em: ({ children }: PortableTextMarkComponentProps<any>) => (
                <em className="italic text-foreground">{children ?? null}</em>
            ),
            link: ({
                value,
                children,
            }: PortableTextMarkComponentProps<any>) => {
                const href = value?.href ?? "#";
                const isExternal = href.startsWith("http");
                const target = value?.openInNewTab || isExternal ? "_blank" : undefined;
                return (
                    <a
                        href={href}
                        target={target}
                        rel={target === "_blank" ? "noopener noreferrer" : undefined}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {children ?? null}
                    </a>
                );
            },
        },
        types: {
            image: ({ value }: { value: any }) => {
                const imageUrl =
                    value?.asset?._ref || value?.asset?._id
                        ? (() => {
                              try {
                                  return urlFor(value).width(1200).quality(80).url();
                              } catch {
                                  return null;
                              }
                          })()
                        : null;

                if (!imageUrl) {
                    return null;
                }

                return (
                    <figure className="my-10 overflow-hidden rounded-3xl border border-border/70 bg-muted/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={value?.alt ?? ""}
                            className="h-full w-full object-cover"
                        />
                        {value?.caption ? (
                            <figcaption className="px-5 py-4 text-sm text-muted-foreground">
                                {value.caption}
                            </figcaption>
                        ) : null}
                    </figure>
                );
            },
            ctaSection: ({ value }: { value: any }) => (
                <section
                    className={cn(
                        "my-12 rounded-3xl p-8 shadow-sm transition-colors",
                        ctaBackgroundVariants[value?.background ?? "subtle"] ??
                            ctaBackgroundVariants.subtle,
                        value?.alignment === "left"
                            ? "text-left"
                            : value?.alignment === "right"
                              ? "text-right"
                              : "text-center",
                    )}
                >
                    <div className="mx-auto flex max-w-3xl flex-col gap-4">
                        {value?.badge ? (
                            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                                {value.badge}
                            </span>
                        ) : null}
                        {value?.heading ? (
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                                {value.heading}
                            </h2>
                        ) : null}
                        {value?.body ? (
                            <p className="text-base text-muted-foreground">{value.body}</p>
                        ) : null}
                        <div
                            className={cn(
                                "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
                                value?.alignment === "left"
                                    ? "sm:justify-start"
                                    : value?.alignment === "right"
                                      ? "sm:justify-end"
                                      : "sm:justify-center",
                            )}
                        >
                            {value?.primaryCta?.label && value?.primaryCta?.href ? (
                                <Button size="lg" asChild>
                                    <Link href={value.primaryCta.href}>
                                        {value.primaryCta.label}
                                    </Link>
                                </Button>
                            ) : null}
                            {value?.secondaryCta?.label && value?.secondaryCta?.href ? (
                                <Button variant="outline" size="lg" asChild>
                                    <Link href={value.secondaryCta.href}>
                                        {value.secondaryCta.label}
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </section>
            ),
            mediaBlock: ({ value }: { value: any }) => {
                const imageUrl =
                    value?.image && value.image.asset
                        ? (() => {
                              try {
                                  return urlFor(value.image).width(1200).quality(80).url();
                              } catch {
                                  return null;
                              }
                          })()
                        : null;

                return (
                    <section className="my-12 overflow-hidden rounded-3xl border border-border/70 bg-background">
                        <div
                            className={cn(
                                "flex flex-col gap-8 lg:items-center",
                                value?.layout === "imageLeft"
                                    ? "lg:flex-row"
                                    : "lg:flex-row-reverse",
                            )}
                        >
                            {imageUrl ? (
                                <div className="relative w-full overflow-hidden lg:w-1/2">
                                    <Image
                                        src={imageUrl}
                                        alt={value?.image?.alt ?? value?.title ?? ""}
                                        width={1200}
                                        height={900}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : null}
                            <div className="flex w-full flex-col gap-4 px-6 py-8 lg:w-1/2 lg:px-12">
                                {value?.title ? (
                                    <h3 className="text-2xl font-semibold text-foreground">
                                        {value.title}
                                    </h3>
                                ) : null}
                                {value?.body ? (
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        {value.body}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </section>
                );
            },
            linkList: ({ value }: { value: any }) => (
                <section className="my-12 rounded-3xl border border-border/70 bg-muted/20 p-6 sm:p-8">
                    {value?.title ? (
                        <h3 className="text-xl font-semibold text-foreground">
                            {value.title}
                        </h3>
                    ) : null}

                    <div
                        className={cn(
                            "mt-4 gap-4",
                            value?.layout === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                : "flex flex-col",
                        )}
                    >
                        {Array.isArray(value?.items)
                            ? value.items.map((item: any, index: number) => {
                                  if (!item?.href) return null;
                                  const isExternal = item.href.startsWith("http");
                                  return (
                                      <a
                                          key={`${item.href}-${index}`}
                                          href={item.href}
                                          target={
                                              item?.openInNewTab || isExternal
                                                  ? "_blank"
                                                  : undefined
                                          }
                                          rel="noopener noreferrer"
                                          className={cn(
                                              "group rounded-2xl border border-transparent bg-background p-5 transition hover:border-primary/40 hover:bg-primary/5",
                                              value?.layout === "grid" ? "h-full" : "",
                                          )}
                                      >
                                          <div className="text-sm font-semibold text-primary transition group-hover:underline">
                                              {item.label}
                                          </div>
                                          {item?.description ? (
                                              <p className="mt-2 text-sm text-muted-foreground">
                                                  {item.description}
                                              </p>
                                          ) : null}
                                      </a>
                                  );
                              })
                            : null}
                    </div>
                </section>
            ),
        },
    };

    return (
        <div className="bg-background">
            {page.hero?.enabled !== false ? (
                <section
                    className={cn(
                        "relative isolate overflow-hidden py-20",
                        heroBackgroundVariants[page.hero?.backgroundStyle ?? "muted"],
                    )}
                >
                    <div className="container mx-auto flex flex-col items-center gap-10 px-4 text-center lg:flex-row lg:text-left">
                        <div className="mx-auto flex max-w-3xl flex-col gap-4 lg:mx-0 lg:w-1/2">
                            {page.hero?.eyebrow ? (
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                                    {page.hero.eyebrow}
                                </span>
                            ) : null}
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                {page.hero?.heading ?? page.title}
                            </h1>
                            {page.hero?.subheading ? (
                                <p className="text-base leading-relaxed text-muted-foreground">
                                    {page.hero.subheading}
                                </p>
                            ) : null}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                {page.hero?.primaryCta?.label &&
                                page.hero?.primaryCta?.href ? (
                                    <Button size="lg" asChild>
                                        <Link href={page.hero.primaryCta.href}>
                                            {page.hero.primaryCta.label}
                                        </Link>
                                    </Button>
                                ) : null}
                                {page.hero?.secondaryCta?.label &&
                                page.hero?.secondaryCta?.href ? (
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href={page.hero.secondaryCta.href}>
                                            {page.hero.secondaryCta.label}
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                        {heroMediaUrl ? (
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 lg:w-1/2">
                                <Image
                                    src={heroMediaUrl}
                                    alt={page.hero?.media?.alt ?? page.title}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            <div className="container mx-auto px-4 py-16">
                <article className="mx-auto max-w-4xl space-y-10">
                    {page.content ? (
                        <PortableText value={page.content} components={portableComponents} />
                    ) : null}
                </article>

                {page.form?.enabled ? (
                    <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border/70 bg-muted/20 p-6 sm:p-8">
                        {page.form?.title ? (
                            <h3 className="text-2xl font-semibold text-foreground">
                                {page.form.title}
                            </h3>
                        ) : null}
                        {page.form?.description ? (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {page.form.description}
                            </p>
                        ) : null}

                        <form
                            method="post"
                            action={page.form?.endpoint ?? "#"}
                            className="mt-6 space-y-5"
                        >
                            {Array.isArray(page.form?.fields)
                                ? page.form.fields.map((field: any) => {
                                      const baseProps = {
                                          id: field.name,
                                          name: field.name,
                                          required: field.required ?? true,
                                          placeholder: field.placeholder ?? "",
                                          className:
                                              "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                                      };

                                      if (field.type === "textarea") {
                                          return (
                                              <div key={field.name} className="space-y-2">
                                                  <label
                                                      htmlFor={field.name}
                                                      className="text-sm font-medium text-foreground"
                                                  >
                                                      {field.label}
                                                  </label>
                                                  <textarea
                                                      {...baseProps}
                                                      rows={4}
                                                      placeholder={field.placeholder ?? ""}
                                                  />
                                              </div>
                                          );
                                      }

                                      if (field.type === "select") {
                                          return (
                                              <div key={field.name} className="space-y-2">
                                                  <label
                                                      htmlFor={field.name}
                                                      className="text-sm font-medium text-foreground"
                                                  >
                                                      {field.label}
                                                  </label>
                                                  <select
                                                      {...baseProps}
                                                      defaultValue=""
                                                      className={cn(
                                                          baseProps.className,
                                                          "appearance-none",
                                                      )}
                                                  >
                                                      <option value="" disabled hidden>
                                                          {field.placeholder ?? "Seçim yapın"}
                                                      </option>
                                                      {Array.isArray(field.options)
                                                          ? field.options.map(
                                                                (option: string, index: number) => (
                                                                    <option key={index} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ),
                                                            )
                                                          : null}
                                                  </select>
                                              </div>
                                          );
                                      }

                                      return (
                                          <div key={field.name} className="space-y-2">
                                              <label
                                                  htmlFor={field.name}
                                                  className="text-sm font-medium text-foreground"
                                              >
                                                  {field.label}
                                              </label>
                                              <input
                                                  type={field.type ?? "text"}
                                                  {...baseProps}
                                              />
                                          </div>
                                      );
                                  })
                                : null}

                            <Button type="submit" size="lg" className="w-full sm:w-auto">
                                {page.form?.submitLabel ?? "Gönder"}
                            </Button>

                            {page.form?.successMessage ? (
                                <p className="text-xs text-muted-foreground">
                                    {page.form.successMessage}
                                </p>
                            ) : null}
                        </form>
                    </section>
                ) : null}
            </div>
        </div>
    );
}
