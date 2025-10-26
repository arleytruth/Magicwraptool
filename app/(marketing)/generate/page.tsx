import { UploadSection } from "@/components/magicwrap/UploadSection";
import { VideoGenerationSection } from "@/components/magicwrap/VideoGenerationSection";

export const dynamic = "force-dynamic";

export default function GeneratePage() {
    return (
        <main className="min-h-screen bg-background pb-12 pt-6">
            <div className="container mx-auto px-4">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Kaplamanı Oluşturmaya Hazır Mısın?
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                        Nesne ve tasarım görsellerini yükle, ardından Generate ile işini tamamla.
                    </p>
                </div>
            </div>
            <UploadSection variant="generate" />
            
            {/* Video Generation Section */}
            <div id="video-generation">
                <VideoGenerationSection />
            </div>
        </main>
    );
}

