import { NextResponse } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const fallbackPackages = [
    {
        id: 1,
        name: "Başlangıç Paketi",
        slug: "starter",
        description: "Küçük projeler ve denemeler için ideal başlangıç paketi",
        credits: 25,
        priceTry: 399,
        originalPriceTry: 599,
        priceEur: 9.99,
        originalPriceEur: 14.99,
        currency: "TRY",
        featureHighlights: [
            "25 görsel oluşturma hakkı",
            "Tüm kategorilerde kullanım",
            "HD kalitede çıktı",
            "30 gün geçerlilik",
        ],
        isFeatured: false,
        badgeText: null,
        ctaLabel: "Hemen al",
        sortOrder: 1,
    },
    {
        id: 2,
        name: "Profesyonel Paket",
        slug: "pro",
        description: "Profesyonel kullanım için en popüler seçim",
        credits: 50,
        priceTry: 799,
        originalPriceTry: 1099,
        priceEur: 19.99,
        originalPriceEur: 29.99,
        currency: "TRY",
        featureHighlights: [
            "50 görsel oluşturma hakkı",
            "Tüm kategorilerde kullanım",
            "8K kalitede çıktı",
            "Öncelikli işleme",
            "60 gün geçerlilik",
        ],
        isFeatured: true,
        badgeText: "En Popüler",
        ctaLabel: "Profesyonel ol",
        sortOrder: 2,
    },
    {
        id: 3,
        name: "İşletme Paketi",
        slug: "business",
        description: "Yoğun kullanım ve işletmeler için en ekonomik çözüm",
        credits: 150,
        priceTry: 1599,
        originalPriceTry: 2199,
        priceEur: 39.99,
        originalPriceEur: 59.99,
        currency: "TRY",
        featureHighlights: [
            "150 görsel oluşturma hakkı",
            "Tüm kategorilerde kullanım",
            "8K kalitede çıktı",
            "En hızlı işleme",
            "Öncelikli destek",
            "90 gün geçerlilik",
        ],
        isFeatured: false,
        badgeText: "En İyi Değer",
        ctaLabel: "İşletme çözümü",
        sortOrder: 3,
    },
];

export async function GET() {
    try {
        const supabase = createSupabaseServiceRoleClient();
        const { data, error } = await supabase
            .from("credit_packages")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        console.log("[api/credit-packages] Supabase yanıtı:", {
            hasError: !!error,
            error: error?.message,
            errorDetails: error,
            dataLength: data?.length,
            firstItem: data?.[0],
        });

        if (error) {
            console.error("[api/credit-packages] ❌ SUPABASE HATASI - Fallback kullanılıyor");
            console.error("Error:", error);
            return NextResponse.json({
                success: true,
                packages: fallbackPackages,
                fallback: true,
                reason: "supabase_error",
            });
        }

        if (!data || data.length === 0) {
            console.warn("[api/credit-packages] ⚠️ VERİ YOK - Fallback kullanılıyor");
            return NextResponse.json({
                success: true,
                packages: fallbackPackages,
                fallback: true,
                reason: "no_data",
            });
        }

        console.log("[api/credit-packages] ✅ SUPABASE'DEN VERİ GELDİ:", data.length, "paket");

        // Map Supabase data to frontend format
        const packages = data.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            slug: pkg.slug,
            description: pkg.description,
            credits: pkg.credits,
            priceTry: pkg.price_try,
            originalPriceTry: pkg.original_price_try,
            priceEur: pkg.price_eur ? parseFloat(pkg.price_eur) : undefined,
            originalPriceEur: pkg.original_price_eur ? parseFloat(pkg.original_price_eur) : undefined,
            currency: pkg.currency,
            featureHighlights: pkg.feature_highlights || [],
            isFeatured: pkg.is_featured,
            badgeText: pkg.badge_text,
            ctaLabel: pkg.cta_label,
            sortOrder: pkg.sort_order,
        }));

        return NextResponse.json({ success: true, packages });
    } catch (error) {
        console.error("[api/credit-packages] error:", error);
        return NextResponse.json(
            {
                success: true,
                packages: fallbackPackages,
                fallback: true,
            },
            { status: 200 },
        );
    }
}

