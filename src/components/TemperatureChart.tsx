"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import useWebSocket, { ReadyState } from "react-use-websocket";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL =
  "https://bx85msyxwb.execute-api.sa-east-1.amazonaws.com/dev/temperatures";
const WEBSOCKET_URL =
  "wss://eu2xrp83l0.execute-api.sa-east-1.amazonaws.com/dev/";
const ACCENT_COLOR = "#38bdf8";

const LOCALES = {
  US: {
    code: "en-US",
    timezone: "America/New_York",
    labels: {
      title: "Real-Time Temperature Dashboard",
      connectionStatus: "Connection Status",
      loading: "Loading data from the last 24 hours...",
      noData: "No data found. Waiting for sensor readings...",
      lastReading: "Last Reading",
      temperature: "Temperature (°C)",
      connecting: "Connecting...",
      connected: "Connected",
      disconnecting: "Disconnecting...",
      disconnected: "Disconnected",
      uninstantiated: "Uninstantiated",
      currentTemp: "Current Temperature",
      maxTemp24h: "Max Temperature (24h)",
      minTemp24h: "Min Temperature (24h)",
      avgTemp24h: "Average Temperature (24h)",
    },
  },
  BR: {
    code: "pt-BR",
    timezone: "America/Sao_Paulo",
    labels: {
      title: "Dashboard de Temperatura em Tempo Real",
      connectionStatus: "Status da Conexão",
      loading: "Carregando dados das últimas 24 horas...",
      noData: "Nenhum dado encontrado. Aguardando leituras do sensor...",
      lastReading: "Última Leitura",
      temperature: "Temperatura (°C)",
      connecting: "Conectando...",
      connected: "Conectado",
      disconnecting: "Desconectando...",
      disconnected: "Desconectado",
      uninstantiated: "Não instanciado",
      currentTemp: "Temperatura Atual",
      maxTemp24h: "Temperatura Máxima (24h)",
      minTemp24h: "Temperatura Mínima (24h)",
      avgTemp24h: "Temperatura Média (24h)",
    },
  },
};

interface TemperatureData {
  timestamp: string;
  temperature: number;
}

interface TemperatureStats {
  current: number | null;
  max: number | null;
  min: number | null;
  average: number | null;
}

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedLocale } = useLocaleStore();

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

  const { lastJsonMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      setTemperatureData((prevData) =>
        [...prevData, lastJsonMessage as TemperatureData].slice(-1000)
      );
    }
  }, [lastJsonMessage]);

  const currentLocale = LOCALES[selectedLocale];

  const formatTimeForLocale = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(currentLocale.code, {
      timeZone: currentLocale.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Calcular estatísticas de temperatura
  const calculateTemperatureStats = (): TemperatureStats => {
    if (temperatureData.length === 0) {
      return { current: null, max: null, min: null, average: null };
    }

    const temperatures = temperatureData.map((data) => data.temperature);
    const current = temperatures[temperatures.length - 1];
    const max = Math.max(...temperatures);
    const min = Math.min(...temperatures);
    const average =
      temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    return { current, max, min, average };
  };

  const stats = calculateTemperatureStats();

  const chartData = {
    labels: temperatureData.map((data) => formatTimeForLocale(data.timestamp)),
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

  const chartOptions: ChartOptions<"line"> = {
    scales: { y: { beginAtZero: false, suggestedMin: 20, suggestedMax: 30 } },
    animation: { duration: 200 },
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: currentLocale.labels.connecting,
    [ReadyState.OPEN]: currentLocale.labels.connected,
    [ReadyState.CLOSING]: currentLocale.labels.disconnecting,
    [ReadyState.CLOSED]: currentLocale.labels.disconnected,
    [ReadyState.UNINSTANTIATED]: currentLocale.labels.uninstantiated,
  }[readyState];

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string;
    icon: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-sky-400 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="w-full h-full">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-4xl text-sky-400">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="text-center max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-primary mb-2">
        {currentLocale.labels.title}
      </h2>
      <p className="text-secondary mb-8">
        {currentLocale.labels.connectionStatus}:{" "}
        <strong
          className={`px-2 py-1 rounded-full text-sm ${
            readyState === ReadyState.OPEN
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connectionStatus}
        </strong>
      </p>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={currentLocale.labels.currentTemp}
          value={
            stats.current !== null ? `${stats.current.toFixed(1)}°C` : "N/A"
          }
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
          value={
            stats.average !== null ? `${stats.average.toFixed(1)}°C` : "N/A"
          }
          icon="📊"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-pulse flex items-center justify-center">
            <div className="text-lg text-gray-600">
              {currentLocale.labels.loading}
            </div>
          </div>
        </div>
      ) : temperatureData.length > 0 ? (
        <div className="rounded-lg shadow-lg bg-white min-h-[160px] md:p-6">
          <Line data={chartData} options={chartOptions} className="" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600">{currentLocale.labels.noData}</p>
        </div>
      )}
    </div>
  );
};

export default TemperatureChart;
