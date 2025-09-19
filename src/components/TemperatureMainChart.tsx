"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useLocaleStore } from "@/store/localStore";
import { ACCENT_COLOR } from "@/constants";
import { formatTimeForLocale } from "@/utils/formatTimeForLocale";
import { TemperatureDataStore } from "@/store/temperatureStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureMainChart = () => {
  const { currentLocale } = useLocaleStore();
  const { temperatureData, stats } = TemperatureDataStore();

  // ----------------------------------------- VERIFICAR
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // ----------------------------------------- VERIFICAR

  const chartData = {
    labels: temperatureData.map((data) =>
      formatTimeForLocale(data.timestamp, currentLocale)
    ),
    datasets: [
      {
        label: currentLocale.labels.temperature,
        data: temperatureData.map((data) => data.temperature),
        borderColor: ACCENT_COLOR,
        backgroundColor: `${ACCENT_COLOR}33`,
        tension: 0.2,
        pointRadius: 1,
        pointHoverRadius: 7,
      },
    ],
  };

  const suggestedMin = stats.average != null ? stats.average / 2 : 20;
  const suggestedMax = stats.average != null ? stats.average * 1.5 : 20;

  const chartOptions: ChartOptions<"line"> = {
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: suggestedMin,
        suggestedMax: suggestedMax,
      },
      x: {
        ticks: {
          maxTicksLimit: window.innerWidth < 768 ? 4 : 10,
          maxRotation: window.innerWidth < 768 ? 0 : undefined,
          minRotation: window.innerWidth < 768 ? 0 : undefined,
        },
      },
    },
    animation: { duration: 200 },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="rounded-lg shadow-lg bg-white md:p-6 h-[160px] md:h-[400px]">
      <Line data={chartData} options={chartOptions} className="" />
    </div>
  );
};

export default TemperatureMainChart;
