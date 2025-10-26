"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RotateCcw, Save, Sparkles, X, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { GenerationLoadingModal } from "./GenerationLoadingModal";

interface ResultViewProps {
  objectImageUrl: string;
  materialImageUrl: string;
  resultImageUrl: string;
  jobId: string;
  userCredits: number;
  onClose: () => void;
  onRegenerate: () => void;
}

export function ResultView({
  objectImageUrl,
  materialImageUrl,
  resultImageUrl,
  jobId,
  userCredits,
  onClose,
  onRegenerate,
}: ResultViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [loadingStage, setLoadingStage] = useState<"uploading" | "generating" | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDownload = async () => {
    try {
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magicwrap-${jobId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "İndirildi! ✅",
        description: "Görsel cihazınıza kaydedildi",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "İndirme başarısız",
        description: "Lütfen tekrar deneyin",
        variant: "destructive",
      });
    }
  };

  const handleSaveToGallery = async () => {
    setIsSaving(true);
    try {
      // Job is already saved in database, just redirect to profile
      toast({
        title: "Galeriye kaydedildi! ✅",
        description: "Görselinizi profil sayfanızdan görebilirsiniz",
      });
      router.push("/profile");
    } catch (error) {
      console.error("Save to gallery error:", error);
      toast({
        title: "Kaydetme başarısız",
        description: "Lütfen tekrar deneyin",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToVideo = async () => {
    if (userCredits < 6) {
      toast({
        title: "Yetersiz Kredi",
        description: "Video oluşturmak için 6 kredi gerekli.",
        variant: "destructive",
      });
      return;
    }

    // Image is already uploaded, go straight to generating
    setLoadingStage("generating");
    setGeneratedVideoUrl(null);
    setGeneratedVideoId(null);

    try {
      const videoResponse = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceImageUrl: resultImageUrl,
          jobId: jobId,
          resolution: "1080p",
          // prompt and duration are handled by the API (default prompt + fixed 5s duration)
        }),
      });

      if (!videoResponse.ok) {
        const error = await videoResponse.json();
        throw new Error(error.message || "Video oluşturulamadı");
      }

      const videoData = await videoResponse.json();
      console.log("[ResultView] Video data received:", videoData);

      if (!videoData || !videoData.video_url) {
        console.error("[ResultView] Invalid video data:", videoData);
        throw new Error("Video URL alınamadı");
      }

      setGeneratedVideoUrl(videoData.video_url);
      setGeneratedVideoId(videoData.id);

      toast({
        title: "✅ Video Oluşturuldu!",
        description: "Videonuz başarıyla oluşturuldu.",
      });

    } catch (error) {
      console.error("Video generation error:", error);
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Video oluşturulamadı",
        variant: "destructive",
      });
    } finally {
      setLoadingStage(null);
    }
  };

  const handleDownloadVideo = async () => {
    if (!generatedVideoUrl) return;

    try {
      const response = await fetch(generatedVideoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magicwrap-video-${generatedVideoId || jobId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "İndirildi! ✅",
        description: "Video cihazınıza kaydedildi",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "İndirme başarısız",
        description: "Lütfen tekrar deneyin",
        variant: "destructive",
      });
    }
  };

  const handleSaveVideoToGallery = async () => {
    if (!generatedVideoId) {
      toast({
        title: "Hata",
        description: "Video ID bulunamadı",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Galeriye kaydedildi! ✅",
        description: "Videonuzu profil sayfanızdan görebilirsiniz",
      });
      
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Save to gallery error:", error);
      toast({
        title: "Kaydetme başarısız",
        description: "Lütfen tekrar deneyin",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Loading Modal for Video Generation */}
      <GenerationLoadingModal
        isOpen={loadingStage !== null}
        stage={loadingStage || "generating"}
        type="video"
      />

      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Kaplaman Hazır!
            </h2>
            <p className="text-muted-foreground mt-1">
              Kalan kredi: {userCredits}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Before */}
          <Card className="overflow-hidden border-2">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1">Önce</h3>
                <p className="text-sm text-muted-foreground">
                  Orijinal nesne
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={objectImageUrl}
                  alt="Original object"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </CardContent>
          </Card>

          {/* After */}
          <Card className="overflow-hidden border-2 border-primary">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                  Sonra
                  <span className="text-sm font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    YENİ
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kaplama uygulandı
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={resultImageUrl}
                  alt="Result with wrap applied"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Large Result Preview */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Sonuç (Tam Boyut)
            </h3>
            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden bg-muted shadow-2xl">
              <Image
                src={resultImageUrl}
                alt="Full size result"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        {generatedVideoUrl && (
          <Card className="mb-8 overflow-hidden border-2 border-primary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Video Sonucu
              </h3>
              <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-black shadow-2xl">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleDownloadVideo}
                >
                  <Download className="mr-2 h-4 w-4" />
                  İndir
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-primary to-purple-600"
                  onClick={handleSaveVideoToGallery}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Galeriye Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          <Button
            size="lg"
            onClick={handleDownload}
            className="w-full sm:w-auto gap-2"
          >
            <Download className="h-5 w-5" />
            İndir
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleConvertToVideo}
            disabled={loadingStage !== null}
            className="w-full sm:w-auto gap-2 border-2 border-primary hover:bg-primary hover:text-primary-foreground relative"
          >
            <Video className="h-5 w-5" />
            Videoya Dönüştür (6 Kredi)
            {!generatedVideoUrl && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                YENİ
              </span>
            )}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="w-full sm:w-auto gap-2"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Kaydediliyor..." : "Galeriye Kaydet"}
          </Button>
          
          <Button
            size="lg"
            variant="secondary"
            onClick={onRegenerate}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Yeni Kaplama Oluştur
          </Button>
        </div>

        {/* Material Reference (smaller) */}
        <div className="mt-8 max-w-sm mx-auto">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Kullanılan Malzeme
              </p>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={materialImageUrl}
                  alt="Material used"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

