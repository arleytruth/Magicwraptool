"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";

const resources = {
    en: { translation: en },
    tr: { translation: tr },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
};

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: "en", // Ana dil: İngilizce
        fallbackLng: "en", // Yedek dil: İngilizce
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });
}

export default i18n;
