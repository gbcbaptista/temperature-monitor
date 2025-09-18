import { create } from "zustand";

export type Locale = "US" | "BR";

interface LocaleState {
  selectedLocale: Locale;
  setSelectedLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  selectedLocale: "BR", // Idioma padrão
  setSelectedLocale: (locale) => set({ selectedLocale: locale }),
}));
