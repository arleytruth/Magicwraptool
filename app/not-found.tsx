'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Başlık */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-foreground">
            Sayfa Bulunamadı
          </h2>
        </div>

        {/* Açıklama */}
        <p className="text-lg text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
        </div>

        {/* Yardımcı Linkler */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Yardıma mı ihtiyacınız var?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/support" 
              className="text-primary hover:underline font-medium"
            >
              Destek
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/documentation" 
              className="text-primary hover:underline font-medium"
            >
              Dokümantasyon
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/contact" 
              className="text-primary hover:underline font-medium"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

