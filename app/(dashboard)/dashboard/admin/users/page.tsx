"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Loader2,
    RefreshCcw,
    Save,
    Undo2,
    Users,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/supabase";

type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

const ROLE_LABELS: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    user: "Üye",
};

const formatDate = (value: string | null) => {
    if (!value) {
        return "-";
    }
    try {
        return new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<SupabaseUser[]>([]);
    const [creditDrafts, setCreditDrafts] = useState<Record<string, number>>({});
    const [updating, setUpdating] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [verificationFilter, setVerificationFilter] = useState<string>("all");

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/admin/users", { cache: "no-store" });

            if (!response.ok) {
                throw new Error("Kullanıcı listesi alınamadı");
            }

            const data = (await response.json()) as {
                success: boolean;
                users: SupabaseUser[];
            };

            const ordered = data.users.sort((a, b) =>
                (b.created_at ?? "").localeCompare(a.created_at ?? ""),
            );

            setUsers(ordered);
            const drafts = ordered.reduce<Record<string, number>>((acc, user) => {
                acc[user.id] = user.credits;
                return acc;
            }, {});
            setCreditDrafts(drafts);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error ? err.message : "Kullanıcı listesi alınamadı",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalCredits = users.reduce((sum, user) => sum + (user.credits ?? 0), 0);
        const adminCount = users.filter((user) => user.role === "admin" || user.role === "owner").length;
        const verifiedCount = users.filter((user) => user.email_verified).length;

        return {
            totalUsers,
            totalCredits,
            adminCount,
            verifiedCount,
            averageCredits: totalUsers ? Math.round(totalCredits / totalUsers) : 0,
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = [
                user.email ?? "",
                user.first_name ?? "",
                user.last_name ?? "",
                user.username ?? "",
                user.clerk_user_id ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());

            const matchesRole =
                roleFilter === "all" || (user.role ?? "user") === roleFilter;

            const matchesVerification =
                verificationFilter === "all" ||
                (verificationFilter === "verified" && user.email_verified) ||
                (verificationFilter === "unverified" && !user.email_verified);

            return matchesSearch && matchesRole && matchesVerification;
        });
    }, [users, searchTerm, roleFilter, verificationFilter]);

    const handleUpdateCredits = async (user: SupabaseUser) => {
        const credits = creditDrafts[user.id];

        if (Number.isNaN(credits) || credits < 0) {
            toast({
                title: "Geçersiz değer",
                description: "Kredi 0 veya daha büyük bir sayı olmalıdır.",
                variant: "destructive",
            });
            return;
        }

        try {
            setUpdating((prev) => ({ ...prev, [user.id]: true }));
            const response = await fetch(`/api/admin/users/${user.id}/credits`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credits }),
            });

            if (!response.ok) {
                throw new Error("Krediler güncellenemedi");
            }

            const data = (await response.json()) as {
                success: boolean;
                user: SupabaseUser;
            };

            setUsers((prev) =>
                prev.map((item) => (item.id === user.id ? data.user : item)),
            );

            toast({
                title: "Kredi güncellendi",
                description: `${data.user.email ?? "Kullanıcı"} yeni kredisi: ${data.user.credits}`,
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "İşlem başarısız",
                description:
                    err instanceof Error
                        ? err.message
                        : "Kredi güncellenemedi. Lütfen tekrar deneyin.",
                variant: "destructive",
            });
        } finally {
            setUpdating((prev) => ({ ...prev, [user.id]: false }));
        }
    };

    const handleResetCredits = (user: SupabaseUser) => {
        setCreditDrafts((prev) => ({ ...prev, [user.id]: user.credits ?? 0 }));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-sm text-muted-foreground">
                        Supabase ile senkron kullanıcı kayıtlarını görüntüleyin, filtreleyin ve kredi bakiyelerini güncelleyin.
                    </p>
                </div>
                <Button variant="outline" onClick={() => void loadUsers()} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="mr-2 h-4 w-4" />
                    )}
                    Yenile
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers}
                    icon={<Users className="h-4 w-4" />}
                    helperText={`${stats.adminCount} admin`}
                />
                <StatsCard
                    title="Toplam Kredi"
                    value={stats.totalCredits}
                    icon={<Sparkles className="h-4 w-4" />}
                    helperText={`Kullanıcı başına ${stats.averageCredits} ortalama`}
                />
                <StatsCard
                    title="Doğrulanmış"
                    value={stats.verifiedCount}
                    icon={<ShieldCheck className="h-4 w-4" />}
                    helperText={`${Math.round(
                        stats.totalUsers
                            ? (stats.verifiedCount / Math.max(stats.totalUsers, 1)) * 100
                            : 0,
                    )}% doğrulandı`}
                />
                <StatsCard
                    title="Filtrelenen"
                    value={filteredUsers.length}
                    icon={<Loader2 className="h-4 w-4" />}
                    helperText="Listede görüntülenen kullanıcılar"
                />
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <Input
                            placeholder="Ad, e-posta veya Clerk ID ile ara"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="w-full max-w-xs"
                        />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Rol filtresi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm roller</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">Üyeler</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Doğrulama" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Hepsi</SelectItem>
                                <SelectItem value="verified">Doğrulanmış</SelectItem>
                                <SelectItem value="unverified">Doğrulanmamış</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {filteredUsers.length} kullanıcı listeleniyor.
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center gap-2 px-6 py-10 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Kullanıcılar yükleniyor...
                        </div>
                    ) : error ? (
                        <div className="px-6 py-10 text-sm text-destructive">{error}</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="px-6 py-10 text-sm text-muted-foreground">
                            Seçilen filtrelere göre kullanıcı bulunamadı.
                        </div>
                    ) : (
                        <ScrollArea className="max-h-[540px]">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-background shadow-sm">
                                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-6 py-3">Kullanıcı</th>
                                        <th className="px-6 py-3">İletişim</th>
                                        <th className="px-6 py-3">Durum</th>
                                        <th className="px-6 py-3 text-right">Kredi</th>
                                        <th className="px-6 py-3 text-right">Son giriş</th>
                                        <th className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const draftValue = creditDrafts[user.id] ?? user.credits ?? 0;
                                        const hasChanges = draftValue !== (user.credits ?? 0);
                                        return (
                                            <tr
                                                key={user.id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.profile_image_url ?? undefined} />
                                                            <AvatarFallback>
                                                                {((user.first_name ?? "").charAt(0) || "?") +
                                                                    (user.last_name ?? "").charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1">
                                                            <div className="font-medium leading-none">
                                                                {`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                                                                    user.username ||
                                                                    user.email ||
                                                                    "İsimsiz kullanıcı"}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {user.username ? `@${user.username}` : user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="space-y-1">
                                                        <div>{user.email ?? "-"}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Clerk ID: {user.clerk_user_id}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <Badge variant="outline" className="w-fit capitalize">
                                                            {ROLE_LABELS[user.role ?? "user"] ?? "Üye"}
                                                        </Badge>
                                                        <Badge
                                                            variant={user.email_verified ? "secondary" : "destructive"}
                                                            className="w-fit"
                                                        >
                                                            {user.email_verified
                                                                ? "E-posta doğrulandı"
                                                                : "Doğrulanmadı"}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={draftValue}
                                                        className="w-24 text-right"
                                                        onChange={(event) =>
                                                            setCreditDrafts((prev) => ({
                                                                ...prev,
                                                                [user.id]: Number(event.target.value),
                                                            }))
                                                        }
                                                    />
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        Mevcut: {user.credits ?? 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                                                    {formatDate(user.last_login_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            disabled={!hasChanges}
                                                            onClick={() => handleResetCredits(user)}
                                                        >
                                                            <Undo2 className="mr-2 h-4 w-4" />
                                                            Sıfırla
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            disabled={!!updating[user.id] || !hasChanges}
                                                            onClick={() => void handleUpdateCredits(user)}
                                                        >
                                                            {updating[user.id] ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Save className="mr-2 h-4 w-4" /> Kaydet
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

type StatsCardProps = {
    title: string;
    value: number;
    helperText?: string;
    icon?: React.ReactNode;
};

function StatsCard({ title, value, helperText, icon }: StatsCardProps) {
    return (
        <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tracking-tight">{value}</div>
                {helperText ? (
                    <p className="text-xs text-muted-foreground">{helperText}</p>
                ) : null}
            </CardContent>
        </Card>
    );
}
