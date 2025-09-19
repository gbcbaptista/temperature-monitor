"use client";

import React, { useState, useEffect } from "react";
import { useLocaleStore } from "@/store/localStore";
import { API_URL } from "@/constants";
import { TemperatureData } from "@/types/TemperatureData";
import TemperatureMainChart from "./TemperatureMainChart";
import TemperatureStatCards from "./TemperatureStatCards";
import ConectionStatus from "./ConectionStatus";
import { TemperatureDataStore } from "@/store/temperatureStore";

const TemperatureDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentLocale } = useLocaleStore();
  const { temperatureData, setTemperatureData } = TemperatureDataStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const historicalData: TemperatureData[] = await response.json();
        historicalData.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setTemperatureData(historicalData);
      } catch (error) {
        console.error("Error loading historical data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="text-center max-w-7xl mx-auto p-4">
      <ConectionStatus />

      <TemperatureStatCards />

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse flex items-center justify-center">
            <div className="text-lg text-gray-600">
              {currentLocale.labels.loading}
            </div>
          </div>
        </div>
      ) : temperatureData.length > 0 ? (
        <TemperatureMainChart />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600">{currentLocale.labels.noData}</p>
        </div>
      )}
    </div>
  );
};

export default TemperatureDashboard;
