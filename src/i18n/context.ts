import { createContext } from "react";
import type { Locale } from "./translations";
import { translations } from "./translations";

export interface I18nContextValue {
  locale: Locale;
  t: (typeof translations.en);
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
