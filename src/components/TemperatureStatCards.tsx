"use client";

import React from "react";
import { useLocaleStore } from "@/store/localStore";
import { StatCard } from "./StatCard";
import { TemperatureDataStore } from "@/store/temperatureStore";

const TemperatureStatCards = () => {
  const { currentLocale } = useLocaleStore();
  const { stats } = TemperatureDataStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title={currentLocale.labels.currentTemp}
        value={stats.current !== null ? `${stats.current.toFixed(1)}°C` : "N/A"}
        icon="🌡️"
      />
      <StatCard
        title={currentLocale.labels.maxTemp24h}
        value={stats.max !== null ? `${stats.max.toFixed(1)}°C` : "N/A"}
        icon="🔥"
      />
      <StatCard
        title={currentLocale.labels.minTemp24h}
        value={stats.min !== null ? `${stats.min.toFixed(1)}°C` : "N/A"}
        icon="❄️"
      />
      <StatCard
        title={currentLocale.labels.avgTemp24h}
        value={stats.average !== null ? `${stats.average.toFixed(1)}°C` : "N/A"}
        icon="📊"
      />
    </div>
  );
};

export default TemperatureStatCards;
