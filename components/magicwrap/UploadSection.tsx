"use client";

import Image from "next/image";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Lock, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CategorySelector } from "./CategorySelector";
import { ResultView } from "./ResultView";
import { GenerationLoadingModal } from "./GenerationLoadingModal";
import { useTranslation } from "react-i18next";
import type { WrapCategory } from "@/types/wrap";
import { useLegacyNavigation } from "@/hooks/use-legacy-navigation";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useToast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";

type UploadSectionProps = {
  variant?: "marketing" | "generate";
  onJobCreated?: (jobId: string) => void;
};

type UploadResponse = {
  url: string;
  publicId: string;
};

/**
 * Compresses image to ensure Fal.ai compatibility
 * Fal.ai requires images to be under 2MB and reasonable dimensions
 */
async function compressImageIfNeeded(file: File): Promise<File> {
  const fileSizeInMB = file.size / (1024 * 1024);

  console.log(`🖼️ Original image: ${fileSizeInMB.toFixed(2)}MB`);

  try {
    // Always compress to ensure optimal size and dimensions for Fal.ai
    const options = {
      maxSizeMB: 1.8, // Target 1.8MB to stay safely under Fal.ai's 2MB limit
      maxWidthOrHeight: 1920, // Max dimension - Fal.ai works best with reasonable sizes
      useWebWorker: true, // Use web worker for better performance
      fileType: 'image/jpeg', // Convert to JPEG for better compression
      initialQuality: 0.85, // High quality while maintaining good compression
    };

    const compressedFile = await imageCompression(file, options);
    const compressedSizeInMB = compressedFile.size / (1024 * 1024);
    
    console.log(`✅ Compression successful: ${fileSizeInMB.toFixed(2)}MB → ${compressedSizeInMB.toFixed(2)}MB`);
    
    // Double-check if still too large (shouldn't happen but just in case)
    if (compressedFile.size > 2 * 1024 * 1024) {
      console.warn('⚠️ Image still too large after compression, applying aggressive compression...');
      const aggressiveOptions = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.75,
      };
      const finalFile = await imageCompression(compressedFile, aggressiveOptions);
      const finalSizeInMB = finalFile.size / (1024 * 1024);
      console.log(`✅ Aggressive compression: ${compressedSizeInMB.toFixed(2)}MB → ${finalSizeInMB.toFixed(2)}MB`);
      return finalFile;
    }
    
    return compressedFile;
  } catch (error) {
    console.error("❌ Image compression failed:", error);
    throw new Error("Görsel sıkıştırılamadı. Lütfen daha küçük bir görsel deneyin.");
  }
}

export function UploadSection({ variant = "marketing", onJobCreated }: UploadSectionProps) {
  const [objectImage, setObjectImage] = useState<File | null>(null);
  const [materialImage, setMaterialImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WrapCategory>("vehicle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<{
    objectUrl: string;
    materialUrl: string;
  } | null>(null);
  const [isOptimizingObject, setIsOptimizingObject] = useState(false);
  const [isOptimizingMaterial, setIsOptimizingMaterial] = useState(false);
  const router = useRouter();
  const { openAuthModal } = useAuthModal();
  const { user, isAuthenticated, isEmailVerified, needsVerification, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLegacyNavigation();
  const { toast } = useToast();
  const isGenerateMode = variant === "generate";
  const remainingCredits = user?.credits ?? 0;
  const isVerifiedUser = isAuthenticated && isEmailVerified;
  const creditHeadline = isVerifiedUser
    ? `Elinde ${remainingCredits} kredi var`
    : needsVerification
      ? "E-postanı doğruladığında 3 ücretsiz kredi seni bekliyor"
      : "Kayıt olunca 3 ücretsiz kredi kazan";
  const authRedirectPath = "/generate";

  useEffect(() => {
    // Read category from URL params if available
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category') as WrapCategory | null;
      if (categoryParam && ['vehicle', 'furniture', 'wall', 'building', 'electronics', 'box', 'auto_tuning', 'general_item'].includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    }
  }, []);

  const requireAuth = useCallback(() => {
    openAuthModal({
      redirectTo: authRedirectPath,
      initialMode: isAuthenticated ? "login" : "signup",
      title: needsVerification ? "E-postanı doğrula" : "Ücretsiz hesabını oluştur",
      description: needsVerification
        ? "Hesabını aktifleştirmek için doğrulama e-postanı kontrol et. 3 ücretsiz kredin seni bekliyor."
        : "3 ücretsiz kredi ile hemen Magic Wrapper’ı dene. Sadece e-posta ile dakikalar içinde kayıt ol.",
    });
  }, [openAuthModal, authRedirectPath, isAuthenticated, needsVerification]);

  const handleDrop = useCallback(
    async (e: React.DragEvent, type: "object" | "material") => {
      e.preventDefault();
      if (!isVerifiedUser) {
        requireAuth();
        return;
      }
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        try {
          // Set optimizing state
          if (type === "object") setIsOptimizingObject(true);
          else setIsOptimizingMaterial(true);
          
          // Compress if needed (silently in background)
          const processedFile = await compressImageIfNeeded(file);
          
          if (type === "object") setObjectImage(processedFile);
          else setMaterialImage(processedFile);
          console.log(`${type} image uploaded:`, processedFile.name);
        } catch (error) {
          toast({
            title: "Hata",
            description: error instanceof Error ? error.message : "Görsel yüklenemedi",
            variant: "destructive",
          });
        } finally {
          // Clear optimizing state
          if (type === "object") setIsOptimizingObject(false);
          else setIsOptimizingMaterial(false);
        }
      }
    },
    [isVerifiedUser, requireAuth, toast]
  );

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "object" | "material"
  ) => {
    if (!isVerifiedUser) {
      requireAuth();
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Set optimizing state
        if (type === "object") setIsOptimizingObject(true);
        else setIsOptimizingMaterial(true);
        
        // Compress if needed (silently in background)
        const processedFile = await compressImageIfNeeded(file);
        
        if (type === "object") setObjectImage(processedFile);
        else setMaterialImage(processedFile);
        console.log(`${type} image selected:`, processedFile.name);
      } catch (error) {
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Görsel yüklenemedi",
          variant: "destructive",
        });
        // Reset file input
        e.target.value = '';
      } finally {
        // Clear optimizing state
        if (type === "object") setIsOptimizingObject(false);
        else setIsOptimizingMaterial(false);
      }
    }
  };

  const uploadImage = useCallback(
    async (file: File, type: "object" | "material"): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", `${type}-${Date.now()}-${file.name}`);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          t(
            "upload.errors.uploadFailed",
            "Görsel yüklenemedi. Lütfen tekrar dene.",
          ),
        );
      }

      return (await response.json()) as UploadResponse;
    },
    [t],
  );

  // Polling effect for job status
  useEffect(() => {
    if (!isPolling || !currentJob?.id) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/jobs/${currentJob.id}`);
        if (!response.ok) return;

        const data = await response.json();
        setCurrentJob(data);

        if (data.status === "completed") {
          setIsPolling(false);
          setIsSubmitting(false);
          setShowResult(true);
          await refreshUser();
          toast({
            title: "Başarılı! ✨",
            description: "Kaplamanız hazır",
          });
        } else if (data.status === "failed") {
          setIsPolling(false);
          setIsSubmitting(false);
          toast({
            title: "İşlem başarısız",
            description: data.error_message || "Bir hata oluştu",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling, currentJob?.id, toast, refreshUser]);

  const handlePrimaryAction = useCallback(async () => {
    if (!isVerifiedUser) {
      requireAuth();
      return;
    }

    if (!objectImage || !materialImage) {
      return;
    }

    if (!isGenerateMode) {
      sessionStorage.setItem(
        "objectImage",
        JSON.stringify({
          name: objectImage.name,
          dataUrl: URL.createObjectURL(objectImage),
        }),
      );
      sessionStorage.setItem(
        "materialImage",
        JSON.stringify({
          name: materialImage.name,
          dataUrl: URL.createObjectURL(materialImage),
        }),
      );
      sessionStorage.setItem("selectedCategory", selectedCategory);
      setLocation(`/generate?category=${selectedCategory}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const [objectUpload, materialUpload] = await Promise.all([
        uploadImage(objectImage, "object"),
        uploadImage(materialImage, "material"),
      ]);

      // Store uploaded URLs for ResultView
      setUploadedUrls({
        objectUrl: objectUpload.url,
        materialUrl: materialUpload.url,
      });

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objectImage: objectUpload.url,
          objectImagePublicId: objectUpload.publicId,
          materialImage: materialUpload.url,
          materialImagePublicId: materialUpload.publicId,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        let message = t(
          "upload.errors.jobFailed",
          "Kaplama işlemi başlatılamadı.",
        );
        try {
          const data = await response.json();
          if (data?.message) {
            message = data.message;
          }
        } catch {
          // ignore JSON parse failures
        }

        throw new Error(message);
      }

      const job = await response.json();
      setCurrentJob(job);
      onJobCreated?.(job.id);

      toast({
        title: t("upload.jobStartedTitle", "Kaplama oluşturuluyor"),
        description: t(
          "upload.jobStartedDescription",
          "Görseliniz hazırlanıyor, lütfen bekleyin...",
        ),
      });

      // Start polling
      setIsPolling(true);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      toast({
        title: t("upload.errors.genericTitle", "İşlem başarısız"),
        description:
          error instanceof Error
            ? error.message
            : t(
                "upload.errors.genericDescription",
                "Lütfen biraz sonra tekrar dene.",
              ),
        variant: "destructive",
      });
    }
  }, [
    isVerifiedUser,
    requireAuth,
    objectImage,
    materialImage,
    isGenerateMode,
    uploadImage,
    selectedCategory,
    setLocation,
    t,
    toast,
    onJobCreated,
  ]);

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setCurrentJob(null);
    setUploadedUrls(null);
    setObjectImage(null);
    setMaterialImage(null);
  }, []);

  const handleRegenerate = useCallback(() => {
    setShowResult(false);
    setCurrentJob(null);
    setUploadedUrls(null);
    // Keep images for regeneration
  }, []);

  // Show result view if generation is complete
  if (showResult && currentJob?.result_image_url && uploadedUrls) {
    return (
      <ResultView
        objectImageUrl={uploadedUrls.objectUrl}
        materialImageUrl={uploadedUrls.materialUrl}
        resultImageUrl={currentJob.result_image_url}
        jobId={currentJob.id}
        userCredits={user?.credits ?? 0}
        onClose={handleCloseResult}
        onRegenerate={handleRegenerate}
      />
    );
  }

  return (
    <>
      {/* Loading Modal Overlay */}
      <GenerationLoadingModal
        isOpen={isSubmitting && isGenerateMode}
        stage={isPolling ? "generating" : "uploading"}
      />

      <section id="upload" className={`${isGenerateMode ? "py-0" : "py-24"} bg-gradient-to-b from-background via-primary/5 to-background`}>
      <div className="container mx-auto px-4">
        {!isGenerateMode && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-medium mb-6" suppressHydrationWarning>
              <span className="text-primary">★★★★★</span>
              <span>{creditHeadline}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hazırsan hemen başlayalım</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              İki fotoğrafını yükle, 30 saniye içinde sonucu ekranda gör.
            </p>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Credit Badge for Generate Mode */}
          {isGenerateMode && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-medium" suppressHydrationWarning>
                <span className="text-primary">★★★★★</span>
                <span>{creditHeadline}</span>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className={`${isGenerateMode ? "mb-6" : "mb-8"}`}>
            <div className={`text-center ${isGenerateMode ? "mb-4" : "mb-6"}`}>
              <h3 className={`font-semibold mb-2 ${isGenerateMode ? "text-xl" : "text-2xl"}`}>
                {t('upload.categoryTitle', 'Kategori seçimini yap')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('upload.categoryDescription', 'Kaplamak istediğin nesne türünü seç')}
              </p>
            </div>
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              disabled={!isVerifiedUser}
              onRequireAuth={requireAuth}
            />
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${isGenerateMode ? "mb-6" : "mb-8"}`}>
            <DropZone
              title={t('upload.objectPhoto.title', 'Adım 1: Nesne fotoğrafın')}
              description={t('upload.objectPhoto.description', 'Arabanın, duvarının, mobilyanın ya da kaplamak istediğin herhangi bir şeyin fotoğrafını yükle')}
              helpText={t('upload.objectPhoto.helpText', 'Her fotoğraf olur; nesnenin net göründüğünden emin ol')}
              file={objectImage}
              onDrop={(e) => handleDrop(e, "object")}
              onFileSelect={(e) => handleFileSelect(e, "object")}
              onRemove={() => setObjectImage(null)}
              testId="dropzone-object"
              disabled={!isVerifiedUser}
              onRequireAuth={requireAuth}
              isOptimizing={isOptimizingObject}
            />
            <DropZone
              title={t('upload.materialPhoto.title', 'Adım 2: Tasarım fotoğrafın')}
              description={t('upload.materialPhoto.description', 'Uygulamak istediğin malzemenin ya da desenin fotoğrafını yükle')}
              helpText={t('upload.materialPhoto.helpText', 'Ahşap, vinil, karbon fiber, mermer… hangisini istersen')}
              file={materialImage}
              onDrop={(e) => handleDrop(e, "material")}
              onFileSelect={(e) => handleFileSelect(e, "material")}
              onRemove={() => setMaterialImage(null)}
              testId="dropzone-material"
              disabled={!isVerifiedUser}
              onRequireAuth={requireAuth}
              isOptimizing={isOptimizingMaterial}
            />
        </div>

          <div className={`text-center ${isGenerateMode ? "space-y-3" : "space-y-4"}`}>
              <Button
                size={isGenerateMode ? "default" : "lg"}
                disabled={!isVerifiedUser || !objectImage || !materialImage || isSubmitting}
                onClick={handlePrimaryAction}
                className={`${isGenerateMode ? "px-8 h-12 text-lg" : "px-12 h-16 text-xl"} font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                data-testid="button-process"
              >
                <Sparkles className={`mr-2 ${isGenerateMode ? "h-5 w-5" : "h-6 w-6"}`} />
                {t(
                  "upload.startCreating",
                  isGenerateMode
                    ? "Oluşturmaya başla"
                    : "Hemen oluşturmaya başla",
                )}
              </Button>

              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2" suppressHydrationWarning>
                {isVerifiedUser ? (
                  <>
                    Görsel başına 1 kredi • Elinde {remainingCredits} kredi var
                  </>
                ) : needsVerification ? (
                  <>
                    <Lock className="h-4 w-4" />
                    E-postanı doğruladığında 3 ücretsiz krediyle devam edebilirsin.
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Üç ücretsiz krediyle başlamak için ücretsiz hesabını oluştur.
                  </>
                )}
              </p>
            </div>
        </div>
      </div>
    </section>
    </>
  );
}

function DropZone({
  title,
  description,
  helpText,
  file,
  onDrop,
  onFileSelect,
  onRemove,
  testId,
  disabled = false,
  onRequireAuth,
  isOptimizing = false,
}: {
  title: string;
  description: string;
  helpText: string;
  file: File | null;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  testId: string;
  disabled?: boolean;
  onRequireAuth?: () => void;
  isOptimizing?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const previewUrl = useMemo(() => {
    if (!file) {
      return null;
    }
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card
      className={`transition-all relative ${
        isDragging ? "border-primary bg-primary/5" : ""
      } ${disabled ? "opacity-60" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (disabled) {
          return;
        }
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (disabled) {
          e.preventDefault();
          onRequireAuth?.();
          setIsDragging(false);
          return;
        }
        onDrop(e);
        setIsDragging(false);
      }}
      data-testid={testId}
    >
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isOptimizing ? (
          <div className="aspect-video rounded-lg bg-muted/50 flex flex-col items-center justify-center gap-3 border-2 border-dashed">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">Görsel optimize ediliyor...</p>
          </div>
        ) : file && previewUrl ? (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src={previewUrl}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3"
              onClick={onRemove}
              data-testid={`${testId}-remove`}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <label
            className={`block cursor-pointer ${
              disabled ? "cursor-not-allowed" : ""
            }`}
            onClick={(event) => {
              if (disabled) {
                event.preventDefault();
                onRequireAuth?.();
              }
            }}
          >
            <div className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 hover-elevate transition-all p-6">
              <Upload className="h-14 w-14 text-muted-foreground" />
              <p className="text-base font-medium text-center">{helpText}</p>
              <p className="text-sm text-muted-foreground">Buraya tıkla veya fotoğrafını sürükleyip bırak</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
              disabled={disabled}
              data-testid={`${testId}-input`}
            />
          </label>
        )}
      </CardContent>
      {disabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 text-center rounded-lg">
          <Lock className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium">Giriş yapıp e-postanı doğruladıktan sonra kullanılabilir</p>
          <Button
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              onRequireAuth?.();
            }}
          >
            Giriş Yap
          </Button>
        </div>
      )}
    </Card>
  );
}
