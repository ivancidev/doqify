"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Locale, TranslationKey } from "./translations";

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedLocale = localStorage.getItem("doqify_locale") as Locale;
    if (savedLocale === "en" || savedLocale === "es") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(savedLocale);
    } else {
      setLocaleState("en");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("doqify_locale", newLocale);
  };

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    const localeTranslations = translations[locale];
    let text: string = localeTranslations[key] || translations.en[key] || String(key);

    if (variables) {
      Object.entries(variables).forEach(([name, value]) => {
        text = text.replace(new RegExp(`\\{\\s*${name}\\s*\\}`, "g"), String(value));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
export type { Locale, TranslationKey };
