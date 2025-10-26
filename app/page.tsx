import { Suspense } from "react";
import { HeroSection } from "@/components/magicwrap/HeroSection";
import { FeatureGrid } from "@/components/magicwrap/FeatureGrid";
import { HowItWorks } from "@/components/magicwrap/HowItWorks";
import { BeforeAfterShowcase } from "@/components/magicwrap/BeforeAfterShowcase";
import { WhoIsThisFor } from "@/components/magicwrap/WhoIsThisFor";
import { EasyAndPowerful } from "@/components/magicwrap/EasyAndPowerful";
import { UploadSection } from "@/components/magicwrap/UploadSection";
import { PricingSection } from "@/components/magicwrap/PricingSection";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <Suspense fallback={<div className="min-h-screen" />}>
                    <FeatureGrid />
                    <HowItWorks />
                    <BeforeAfterShowcase />
                    <WhoIsThisFor />
                    <EasyAndPowerful />
                    <UploadSection />
                    <PricingSection />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

