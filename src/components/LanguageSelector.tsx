"use client";

import React from "react";
import { useLocaleStore, Locale } from "@/store/localStore";

const LanguageSelector = () => {
  // Pega o estado e a função de alterar direto da store
  const { selectedLocale, setSelectedLocale } = useLocaleStore();

  return (
    <select
      value={selectedLocale}
      onChange={(e) => setSelectedLocale(e.target.value as Locale)}
      className="bg-card text-primary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 border border-gray-600 placeholder-gray-400"
    >
      <option value="US">🇺🇸 English</option>
      <option value="BR">🇧🇷 Português</option>
    </select>
  );
};

export default LanguageSelector;
