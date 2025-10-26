"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Mail, Send, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", message: "" });

  const validateForm = () => {
    const newErrors = { email: "", message: "" };
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = "E-posta adresi zorunludur";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
      isValid = false;
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = "Mesaj zorunludur";
      isValid = false;
    } else if (message.trim().length < 10) {
      newErrors.message = "Mesajınız en az 10 karakter olmalıdır";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (you can replace this with actual API call later)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
    setErrors({ email: "", message: "" });
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-2 border-green-500/20">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Mesajınız Gönderildi!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                24 saat içinde size geri dönüş yapacağız.
              </p>
              <Button
                size="lg"
                onClick={handleReset}
                variant="outline"
              >
                Yeni Mesaj Gönder
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Destek</h1>
          <p className="text-xl text-muted-foreground">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              İletişim Formu
            </CardTitle>
            <CardDescription>
              Sorularınızı ve sorunlarınızı bize iletin, en kısa sürede size geri dönüş yapalım.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  E-posta Adresiniz <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">
                  Mesajınız <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Lütfen sorununuzu veya önerinizi detaylı bir şekilde açıklayın..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setErrors({ ...errors, message: "" });
                  }}
                  className={errors.message ? "border-destructive" : ""}
                  rows={8}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  En az 10 karakter giriniz
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Gönder
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>
                  Destek talebinize en geç <strong className="text-foreground">24 saat</strong> içinde yanıt vermeye çalışıyoruz.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>
                  Teknik sorunlar için lütfen sorunu detaylı bir şekilde açıklayın.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-semibold">•</span>
                <span>
                  Fatura veya ödeme ile ilgili sorularınız için hesap bilgilerinizi belirtmeyi unutmayın.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

