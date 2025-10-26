"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { GenerationLoadingModal } from "./GenerationLoadingModal";

interface VideoGenerationSectionProps {
  onVideoGenerated?: (videoUrl: string) => void;
}

export function VideoGenerationSection({ onVideoGenerated }: VideoGenerationSectionProps) {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<"uploading" | "generating" | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceImage(file);
      const preview = URL.createObjectURL(file);
      setSourceImagePreview(preview);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast({
        title: "Görsel Gerekli",
        description: "Lütfen bir görsel yükleyin.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated || !isEmailVerified) {
      toast({
        title: "Giriş Gerekli",
        description: "Video oluşturmak için giriş yapmalısınız.",
        variant: "destructive",
      });
      return;
    }

    if ((user?.credits || 0) < 6) {
      toast({
        title: "Yetersiz Kredi",
        description: "Video oluşturmak için 6 kredi gerekli.",
        variant: "destructive",
      });
      return;
    }

    setLoadingStage("uploading");
    setGeneratedVideoUrl(null);
    setGeneratedVideoId(null);

    try {
      // Upload image first
      const formData = new FormData();
      formData.append("file", sourceImage);
      formData.append("filename", `video-source-${Date.now()}-${sourceImage.name}`);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Görsel yüklenemedi");
      }

      const { url: imageUrl, publicId } = await uploadResponse.json();

      // Switch to generating stage
      setLoadingStage("generating");

      // Generate video (prompt and duration are handled by API)
      const videoResponse = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceImageUrl: imageUrl,
          sourceImagePublicId: publicId,
          resolution: "1080p",
          // prompt: not needed, uses default from API
          // duration: not needed, fixed at 5 seconds in API
        }),
      });

      if (!videoResponse.ok) {
        const error = await videoResponse.json();
        console.error("Video API error response:", error);
        console.error("Status:", videoResponse.status);
        throw new Error(error.message || "Video oluşturulamadı");
      }

      const videoData = await videoResponse.json();
      console.log("[VideoGenerationSection] Video data received:", videoData);

      if (!videoData || !videoData.video_url) {
        console.error("[VideoGenerationSection] Invalid video data:", videoData);
        throw new Error("Video URL alınamadı");
      }

      setGeneratedVideoUrl(videoData.video_url);
      setGeneratedVideoId(videoData.id);
      onVideoGenerated?.(videoData.video_url);

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

  const handleDownload = async () => {
    if (!generatedVideoUrl) return;

    try {
      const response = await fetch(generatedVideoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magicwrap-video-${generatedVideoId || Date.now()}.mp4`;
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

  const handleSaveToGallery = async () => {
    if (!generatedVideoId) {
      toast({
        title: "Hata",
        description: "Video ID bulunamadı",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Video already saved in database, just redirect to profile
      toast({
        title: "Galeriye kaydedildi! ✅",
        description: "Videonuzu profil sayfanızdan görebilirsiniz",
      });
      
      // Redirect to profile after a short delay
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Loading Modal */}
      <GenerationLoadingModal
        isOpen={loadingStage !== null}
        stage={loadingStage || "uploading"}
        type="video"
      />

      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Video className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">YENİ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Görselini Videoya Dönüştür
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oluşturduğun görselleri ultra gerçekçi videoya dönüştür. Daha etkileyici sonuçlar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Görsel Yükle</CardTitle>
                <CardDescription>
                  Video oluşturmak istediğin görseli seç. Görsel otomatik olarak 5 saniyelik videoya dönüştürülecek.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="block cursor-pointer">
                  {sourceImagePreview ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={sourceImagePreview}
                        alt="Source"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setSourceImage(null);
                          setSourceImagePreview(null);
                        }}
                      >
                        Değiştir
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors p-6">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm font-medium text-center">
                        Görsel yüklemek için tıkla
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG (maks. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!sourceImage || loadingStage !== null}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Video className="mr-2 h-5 w-5" />
                Video Oluştur (6 Kredi)
              </Button>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Kalan kredin:</span>
                <span className="font-semibold">{user?.credits || 0}</span>
              </div>
              
              <div className="bg-muted/50 border border-border rounded-lg p-3 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ℹ️ Standart üretim süresi 5 sn. dir. Kamera hareketleri ile tam izlenim kazandırmak amaçlanmaktadır.
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Video Sonucu</CardTitle>
              <CardDescription>
                Oluşturulan video burada görünecek
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedVideoUrl ? (
                <div className="space-y-4">
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      İndir
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                      onClick={handleSaveToGallery}
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Kaydediliyor..." : "Galeriye Kaydet"}
                    </Button>
                  </div>
                </div>
              ) : loadingStage ? (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Loading modal aktif...</p>
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Video burada gösterilecek</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
}

