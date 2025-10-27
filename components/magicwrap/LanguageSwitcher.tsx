"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";

const languages = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "tr", label: "Türkçe", nativeName: "Türkçe" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          data-testid="button-language-toggle" 
          className="gap-2 h-9 px-3 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium text-sm uppercase tracking-wide">
            {currentLanguage?.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        {languages.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              data-testid={`language-option-${lang.code}`}
              className={`
                flex items-center justify-between px-3 py-2.5 cursor-pointer
                rounded-md transition-colors
                ${isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground min-w-[2rem]">
                  {lang.code}
                </span>
                <span className="text-sm">{lang.nativeName}</span>
              </div>
              {isActive && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
