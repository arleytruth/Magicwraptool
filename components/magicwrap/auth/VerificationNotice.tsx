"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VerificationNoticeProps {
  email: string;
  onResend: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isResending: boolean;
  isRefreshing: boolean;
  disableResend: boolean;
}

export function VerificationNotice({
  email,
  onResend,
  onRefresh,
  onSignOut,
  isResending,
  isRefreshing,
  disableResend,
}: VerificationNoticeProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-muted bg-muted/40 p-4 text-center">
        <h3 className="text-lg font-semibold">Doğrulama Bekleniyor</h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{email}</span> adresine bir doğrulama e-postası gönderdik.
          Lütfen gelen kutunuzu kontrol edin ve doğrulama bağlantısına tıklayın.
        </p>
      </div>
      <div className="grid gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onResend}
          disabled={isResending || disableResend}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              E-posta yeniden gönderiliyor...
            </>
          ) : (
            "Doğrulama e-postasını tekrar gönder"
          )}
        </Button>
        <Button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Durum kontrol ediliyor...
            </>
          ) : (
            "E-postamı doğruladım, tekrar kontrol et"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSignOut}
        >
          Farklı bir hesapla giriş yap
        </Button>
      </div>
    </div>
  );
}
