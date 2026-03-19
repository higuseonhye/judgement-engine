import { useState, useCallback, type ReactNode } from "react";
import type { Locale } from "./translations";
import { translations } from "./translations";
import { I18nContext } from "./context";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
