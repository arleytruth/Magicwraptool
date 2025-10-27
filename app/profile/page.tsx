"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import {
    Bookmark,
    BookmarkCheck,
    CalendarClock,
    ChevronDown,
    CreditCard,
    Download,
    Eye,
    GalleryVertical,
    Loader2,
    Play,
    Receipt,
    Sparkles,
    Star,
    Video,
    X,
} from "lucide-react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { PricingSection } from "@/components/magicwrap/PricingSection";
import type { Database } from "@/types/supabase";

type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type VideoRow = {
    id: string;
    user_id: string;
    job_id: string | null;
    source_image_url: string;
    source_image_public_id: string | null;
    prompt: string;
    aspect_ratio: string | null;
    resolution: string | null;
    duration: string | null;
    seed: number | null;
    video_url: string | null;
    video_public_id: string | null;
    fal_request_id: string | null;
    status: string;
    credits_consumed: number;
    error_message: string | null;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
    failed_at: string | null;
    metadata: Record<string, unknown> | null;
};

type CreditPackage = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    credits: number;
    price_try: number;
    currency: string;
};

type ProfileResponse = {
    success: boolean;
    user: SupabaseUser;
};

type TransactionRow = {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    stripe_session_id: string | null;
    package_id: number | null;
    created_at: string;
    credit_packages: CreditPackage | null;
};

const formatDateTime = (value: string | null) => {
    if (!value) {
        return "-";
    }
    try {
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

const formatDate = (value: string | null) => {
    if (!value) {
        return "-";
    }
    try {
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

function StatsCard({
    title,
    value,
    helperText,
    icon,
}: {
    title: string;
    value: string;
    helperText?: string;
    icon?: React.ReactNode;
}) {
    return (
        <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tracking-tight">
                    {value}
                </div>
                {helperText ? (
                    <p className="text-xs text-muted-foreground">{helperText}</p>
                ) : null}
            </CardContent>
        </Card>
    );
}

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [pendingJobId, setPendingJobId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [visibleItems, setVisibleItems] = useState(4);
    const ITEMS_PER_PAGE = 4;

    const {
        data: profileResponse,
        isLoading: profileLoading,
    } = useQuery<ProfileResponse>({
        queryKey: ["/api/users/me"],
        queryFn: async () => {
            const response = await fetch("/api/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Failed to load user information");
            }

            return response.json();
        },
        enabled: isAuthenticated,
        staleTime: 60_000,
    });

    const {
        data: jobs,
        isLoading: jobsLoading,
    } = useQuery<JobRow[]>({
        queryKey: ["/api/jobs"],
        queryFn: async () => {
            const response = await fetch("/api/jobs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();
        },
        enabled: isAuthenticated,
        staleTime: 30_000,
    });

    const {
        data: videos,
        isLoading: videosLoading,
    } = useQuery<VideoRow[]>({
        queryKey: ["/api/videos"],
        queryFn: async () => {
            const response = await fetch("/api/videos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Failed to load videos");
            }

            return response.json();
        },
        enabled: isAuthenticated,
        staleTime: 30_000,
    });

    const {
        data: transactions,
        isLoading: transactionsLoading,
    } = useQuery<TransactionRow[]>({
        queryKey: ["/api/transactions"],
        queryFn: async () => {
            const response = await fetch("/api/transactions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                throw new Error("Unauthorized");
            }

            if (!response.ok) {
                throw new Error("Failed to load transactions");
            }

            return response.json();
        },
        enabled: isAuthenticated,
        staleTime: 60_000,
    });

    const toggleSave = useMutation({
        mutationFn: async (params: { jobId: string; saved: boolean }) => {
            const response = await fetch(`/api/jobs/${params.jobId}/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ saved: params.saved }),
            });

            if (!response.ok) {
                throw new Error("Save operation failed");
            }

            return response.json() as Promise<JobRow>;
        },
        onMutate: ({ jobId }) => {
            setPendingJobId(jobId);
        },
        onSuccess: (job, { saved }) => {
            toast({
                title: saved ? "Saved to gallery" : "Gallery updated",
                description: saved
                    ? "Added to your library."
                    : "Removed from your library.",
            });
        },
        onError: (error) => {
            toast({
                title: "Operation failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Image could not be updated. Please try again.",
                variant: "destructive",
            });
        },
        onSettled: () => {
            setPendingJobId(null);
            void queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
        },
    });

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle>Sign in required</CardTitle>
                        <CardDescription>
                            Please sign in to view your profile page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignInButton mode="modal">
                            <Button size="lg" className="w-full">
                                Sign In
                            </Button>
                        </SignInButton>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const supabaseUser = profileResponse?.user;
    const mergedCredits =
        supabaseUser?.credits ?? user?.credits ?? 0;
    const displayName =
        `${supabaseUser?.first_name ?? ""} ${supabaseUser?.last_name ?? ""}`.trim() ||
        user?.firstName ||
        user?.username ||
        supabaseUser?.email ||
        "Magicwrap Member";
    const initials =
        ((supabaseUser?.first_name ?? user?.firstName ?? "").charAt(0) ||
            supabaseUser?.email?.charAt(0) ||
            "M") +
        ((supabaseUser?.last_name ?? user?.lastName ?? "").charAt(0) || "");

    const completedJobs = (jobs ?? []).filter((job) => job.status === "completed");
    const completedVideos = (videos ?? []).filter((video) => video.status === "completed");
    const savedJobs = completedJobs.filter((job) => job.saved);
    const totalGalleryItems = completedJobs.length + completedVideos.length;
    const lastJob = (jobs ?? [])[0] ?? null;
    const mostUsedCategory = (() => {
        if (!completedJobs.length) {
            return null;
        }

        const counts = completedJobs.reduce<Record<string, number>>((acc, job) => {
            acc[job.category] = (acc[job.category] ?? 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    })();

    const isProfileBusy = isLoading || profileLoading;
    const isStatsBusy = jobsLoading || videosLoading;
    const isGalleryBusy = jobsLoading || videosLoading;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 space-y-12">
            <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
                <Card className="overflow-hidden">
                    <CardHeader className="items-center text-center pb-6">
                        <Avatar className="h-24 w-24 pointer-events-none">
                            <AvatarImage
                                src={
                                    supabaseUser?.profile_image_url ??
                                    user?.profileImageUrl ??
                                    undefined
                                }
                            />
                            <AvatarFallback className="text-lg font-semibold uppercase">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4 text-2xl font-semibold">
                            {displayName}
                        </CardTitle>
                        <Badge variant="secondary" className="capitalize">
                            {supabaseUser?.role ?? user?.role ?? "Member"}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Email</p>
                            <p>{supabaseUser?.email ?? user?.email ?? "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Username</p>
                            <p>{supabaseUser?.username ?? user?.username ?? "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Member since</p>
                            <p>{formatDate(supabaseUser?.created_at ?? null)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Last login</p>
                            <p>{formatDateTime(supabaseUser?.last_login_at ?? null)}</p>
                        </div>
                        <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <p className="text-sm font-semibold text-primary">
                                Current credit balance
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {mergedCredits.toLocaleString("en-US")} credits
                            </p>
                            <p className="text-xs">
                                You can increase your credits to create more images.
                            </p>
                        </div>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/generate">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Create new wrap
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Usage Summary</CardTitle>
                        <CardDescription>
                            Track your production performance and gallery status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isStatsBusy ? (
                            <div className="flex h-40 items-center justify-center text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading statistics...
                            </div>
                        ) : (
                            <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <StatsCard
                                    title="Total generations"
                                    value={String(jobs?.length ?? 0)}
                                    helperText="All-time job count"
                                    icon={<Sparkles className="h-4 w-4 text-primary" />}
                                />
                                <StatsCard
                                    title="Completed"
                                    value={String(completedJobs.length)}
                                    helperText="Successfully created images"
                                    icon={<GalleryVertical className="h-4 w-4 text-chart-2" />}
                                />
                                <StatsCard
                                    title="In Gallery"
                                    value={String(totalGalleryItems)}
                                    helperText="Images and videos"
                                    icon={<BookmarkCheck className="h-4 w-4 text-chart-3" />}
                                />
                                <StatsCard
                                    title="Last generation"
                                    value={
                                        lastJob?.created_at
                                            ? formatDateTime(lastJob.created_at)
                                            : "No generations yet"
                                    }
                                    helperText={
                                        mostUsedCategory
                                            ? `Most used category: ${mostUsedCategory}`
                                            : undefined
                                    }
                                    icon={<CalendarClock className="h-4 w-4 text-chart-4" />}
                                />
                            </div>

                            {/* Purchase History in Summary Section */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-primary" />
                                        Purchase History
                                    </h3>
                                    {transactions && transactions.length > 3 && (
                                        <span className="text-xs text-muted-foreground">
                                            Last 3 transactions
                                        </span>
                                    )}
                                </div>
                                {transactionsLoading ? (
                                    <div className="flex h-20 items-center justify-center text-muted-foreground text-sm">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : !transactions || transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center bg-muted/30 rounded-lg border border-dashed">
                                        <Receipt className="h-6 w-6 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            No purchases yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {transactions.slice(0, 3).map((transaction) => (
                                            <div 
                                                key={transaction.id} 
                                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-full bg-primary/10 p-2">
                                                        <CreditCard className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {transaction.credit_packages?.name || "Credit Package"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDateTime(transaction.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-primary">
                                                        +{transaction.amount}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(transaction.credit_packages?.price_try || 0).toLocaleString("tr-TR")} ₺
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">My Image Library</h2>
                        <p className="text-sm text-muted-foreground">
                            All your wrap results are listed here.
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/generate">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create new image
                        </Link>
                    </Button>
                </div>

                {isGalleryBusy ? (
                    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                        Loading gallery...
                    </div>
                ) : completedJobs.length === 0 && completedVideos.length === 0 ? (
                    <Card className="border-dashed bg-muted/30">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                            <Star className="h-10 w-10 text-primary" />
                            <div className="space-y-2">
                                <p className="text-lg font-semibold">
                                    No images created yet
                                </p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Go to the Generate page to create your first wrap image
                                    by uploading your object and material images.
                                </p>
                            </div>
                            <Button asChild size="lg">
                                <Link href="/generate">Get Started</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                    {/* Combined and sorted gallery items */}
                    {(() => {
                        // Combine jobs and videos with type info
                        const allItems = [
                            ...completedJobs.map(job => ({ 
                                type: 'image' as const, 
                                data: job, 
                                createdAt: new Date(job.created_at).getTime() 
                            })),
                            ...completedVideos.map(video => ({ 
                                type: 'video' as const, 
                                data: video, 
                                createdAt: new Date(video.created_at).getTime() 
                            }))
                        ].sort((a, b) => b.createdAt - a.createdAt); // Newest first
                        
                        const visibleGalleryItems = allItems.slice(0, visibleItems);
                        const hasMore = allItems.length > visibleItems;

                        return (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {visibleGalleryItems.map((item, index) => {
                                        if (item.type === 'image') {
                                            const job = item.data as JobRow;
                                            const isSaving = pendingJobId === job.id && toggleSave.isPending;
                                            const isSaved = job.saved;

                                            return (
                                                <Card key={`image-${job.id}`} className="overflow-hidden border-2 border-blue-500/20">
                                                    <div className="relative aspect-[4/3] w-full bg-muted">
                                                        {/* Image Badge Overlay */}
                                                        <div className="absolute top-3 left-3 z-10">
                                                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                                                                <Sparkles className="w-3 h-3 mr-1" />
                                                                Image
                                                            </Badge>
                                                        </div>
                                                        {job.result_image_url ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={job.result_image_url}
                                                                alt="Wrap result"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                                Result image not ready yet
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="space-y-3 p-5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <Badge variant="outline" className="capitalize">
                                                                {job.category}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDateTime(job.created_at)}
                                                            </span>
                                                        </div>
                                                        {job.result_image_url ? (
                                                            <div className="flex gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    className="flex-1"
                                                                    onClick={() => setPreviewImage(job.result_image_url)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={async () => {
                                                                        try {
                                                                            const imageUrl = job.result_image_url;
                                                                            if (!imageUrl) {
                                                                                throw new Error("Image URL not available");
                                                                            }
                                                                            const response = await fetch(imageUrl);
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
                                                                                title: "Downloaded",
                                                                                description: "Image saved to your device",
                                                                            });
                                                                        } catch (error) {
                                                                            console.error("Download error:", error);
                                                                            toast({
                                                                                title: "Download failed",
                                                                                description: "Please try again",
                                                                                variant: "destructive",
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant={isSaved ? "default" : "outline"}
                                                                    onClick={() =>
                                                                        toggleSave.mutate({
                                                                            jobId: job.id,
                                                                            saved: !job.saved,
                                                                        })
                                                                    }
                                                                    disabled={isSaving}
                                                                >
                                                                    {isSaving ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : isSaved ? (
                                                                        <BookmarkCheck className="h-4 w-4" />
                                                                    ) : (
                                                                        <Bookmark className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        ) : null}
                                                    </CardContent>
                                                </Card>
                                            );
                                        } else {
                                            const video = item.data as VideoRow;
                                            return (
                                                <Card key={`video-${video.id}`} className="overflow-hidden border-2 border-purple-500/20">
                                                    <div className="relative aspect-[4/3] w-full bg-muted">
                                                        {/* Video Badge Overlay */}
                                                        <div className="absolute top-3 left-3 z-10">
                                                            <Badge className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                                                                <Video className="w-3 h-3 mr-1" />
                                                                Video
                                                            </Badge>
                                                        </div>
                                                        {video.video_url ? (
                                                            <div className="relative h-full w-full">
                                                                <video
                                                                    src={video.video_url}
                                                                    className="h-full w-full object-cover"
                                                                    muted
                                                                    loop
                                                                    playsInline
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                    <div className="bg-white/90 rounded-full p-4">
                                                                        <Play className="h-12 w-12 text-purple-600" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                                Video not ready yet
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="space-y-3 p-5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <Badge variant="secondary" className="capitalize">
                                                                Video (5s)
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDateTime(video.created_at)}
                                                            </span>
                                                        </div>
                                                        {video.video_url ? (
                                                            <div className="flex gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                                                    onClick={() => setPreviewVideo(video.video_url)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={async () => {
                                                                        try {
                                                                            const videoUrl = video.video_url;
                                                                            if (!videoUrl) {
                                                                                throw new Error("Video URL not available");
                                                                            }
                                                                            const response = await fetch(videoUrl);
                                                                            const blob = await response.blob();
                                                                            const url = window.URL.createObjectURL(blob);
                                                                            const a = document.createElement("a");
                                                                            a.href = url;
                                                                            a.download = `magicwrap-video-${video.id}.mp4`;
                                                                            document.body.appendChild(a);
                                                                            a.click();
                                                                            window.URL.revokeObjectURL(url);
                                                                            document.body.removeChild(a);
                                                                            toast({
                                                                                title: "Downloaded",
                                                                                description: "Video saved to your device",
                                                                            });
                                                                        } catch (error) {
                                                                            console.error("Download error:", error);
                                                                            toast({
                                                                                title: "Download failed",
                                                                                description: "Please try again",
                                                                                variant: "destructive",
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : null}
                                                    </CardContent>
                                                </Card>
                                            );
                                        }
                                    })}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-8">
                                        <Button 
                                            size="lg"
                                            variant="outline"
                                            onClick={() => setVisibleItems(prev => prev + ITEMS_PER_PAGE)}
                                            className="gap-2 group"
                                        >
                                            <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                                            Load More ({allItems.length - visibleItems} remaining)
                                        </Button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                    </>
                )}
            </section>

            {/* Image Preview Modal */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="max-w-4xl p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full">
                        {previewImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={previewImage}
                                alt="Image preview"
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Video Preview Modal */}
            <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
                <DialogContent className="max-w-4xl p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="sr-only">Video Preview</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full">
                        {previewVideo && (
                            <video
                                src={previewVideo}
                                controls
                                autoPlay
                                loop
                                className="w-full h-auto max-h-[80vh]"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <section className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Credit Packages</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Check out affordable credit packages for frequent use.
                    </p>
                </div>
                <PricingSection />
            </section>
        </div>
    );
}
