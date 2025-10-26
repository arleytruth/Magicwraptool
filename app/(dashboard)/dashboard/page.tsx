"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Download, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/supabase";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    try {
        return new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

const Dashboard = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = searchParams.get("job");
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [job, setJob] = useState<JobRow | null>(null);
    const [isLoading, setIsLoading] = useState(!!jobId);
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
            return;
        }

        if (!jobId) return;

        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/${jobId}`);
                if (!response.ok) {
                    throw new Error("Job bulunamadı");
                }
                const data = await response.json();
                setJob(data);

                // Poll if job is still processing
                if (data.status === "pending" || data.status === "processing") {
                    setIsPolling(true);
                } else {
                    setIsPolling(false);
                }
            } catch (error) {
                console.error("Job fetch error:", error);
                toast({
                    title: "Hata",
                    description: "İş bilgileri yüklenemedi",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        void fetchJob();
    }, [jobId, isAuthenticated, router, toast]);

    // Polling effect
    useEffect(() => {
        if (!isPolling || !jobId) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/jobs/${jobId}`);
                if (!response.ok) return;

                const data = await response.json();
                setJob(data);

                if (data.status === "completed") {
                    setIsPolling(false);
                    toast({
                        title: "Başarılı!",
                        description: "Görseliniz hazır",
                    });
                } else if (data.status === "failed") {
                    setIsPolling(false);
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
    }, [isPolling, jobId, toast]);

    const handleDownload = async () => {
        if (!job?.result_image_url) return;

        try {
            const response = await fetch(job.result_image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `magicwrap-${job.id}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "İndirildi",
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

    if (isLoading) {
        return (
            <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!jobId || !job) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                        <CardDescription>
                            Görsel oluşturma işlemlerinizi buradan takip edebilirsiniz
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Sparkles className="h-12 w-12 text-muted-foreground" />
                            <p className="text-center text-muted-foreground">
                                Henüz aktif bir işlem yok
                            </p>
                            <Button asChild>
                                <Link href="/generate">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Yeni Görsel Oluştur
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = {
        pending: {
            icon: Clock,
            label: "Sırada",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        processing: {
            icon: Loader2,
            label: "İşleniyor",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        completed: {
            icon: CheckCircle2,
            label: "Tamamlandı",
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        failed: {
            icon: XCircle,
            label: "Başarısız",
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    };

    const config = statusConfig[job.status];
    const StatusIcon = config.icon;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Görsel Oluşturma</h1>
                    <p className="text-muted-foreground">
                        İşlem ID: {job.id.slice(0, 8)}...
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/generate">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Yeni Oluştur
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>İşlem Durumu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`flex items-center gap-3 rounded-lg p-4 ${config.bg}`}>
                            <StatusIcon className={`h-6 w-6 ${config.color} ${job.status === "processing" ? "animate-spin" : ""}`} />
                            <div className="flex-1">
                                <p className="font-semibold">{config.label}</p>
                                {job.status === "processing" && (
                                    <p className="text-sm text-muted-foreground">
                                        Görseliniz oluşturuluyor, lütfen bekleyin...
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kategori</span>
                                <Badge variant="outline" className="capitalize">
                                    {job.category}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Oluşturma zamanı</span>
                                <span>{formatDateTime(job.created_at)}</span>
                            </div>
                            {job.completed_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tamamlanma zamanı</span>
                                    <span>{formatDateTime(job.completed_at)}</span>
                                </div>
                            )}
                        </div>

                        {job.error_message && (
                            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                                {job.error_message}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kaynak Görseller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Nesne</p>
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={job.object_image_url}
                                        alt="Nesne görseli"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Malzeme</p>
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={job.material_image_url}
                                        alt="Malzeme görseli"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {job.status === "completed" && job.result_image_url && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Sonuç Görseli</CardTitle>
                                <CardDescription>
                                    AI tarafından oluşturulan kaplama görseli
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleDownload} variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    İndir
                                </Button>
                                <Button asChild>
                                    <Link href="/generate">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Tekrar Oluştur
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={job.result_image_url}
                                alt="Sonuç görseli"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                    <Link href="/profile">
                        Tüm İşlemleri Görüntüle
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Dashboard;
