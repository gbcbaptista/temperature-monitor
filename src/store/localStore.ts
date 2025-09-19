import { LOCALES } from "@/language/locales";
import { create } from "zustand";

export type Locale = "US" | "BR";

interface LocaleState {
  selectedLocale: Locale;
  setSelectedLocale: (locale: Locale) => void;
  currentLocale: (typeof LOCALES)[Locale];
}

export const useLocaleStore = create<LocaleState>((set) => ({
  selectedLocale: "BR",
  currentLocale: LOCALES["BR"],
  setSelectedLocale: (locale) =>
    set({ selectedLocale: locale, currentLocale: LOCALES[locale] }),
}));
