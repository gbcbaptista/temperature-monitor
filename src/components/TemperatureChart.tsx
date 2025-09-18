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
    },
  },
};

interface TemperatureData {
  timestamp: string;
  temperature: number;
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

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-primary mb-2">
        {currentLocale.labels.title}
      </h2>
      <p className="text-secondary mb-6">
        {currentLocale.labels.connectionStatus}:{" "}
        <strong>{connectionStatus}</strong>
      </p>

      {isLoading ? (
        <p>{currentLocale.labels.loading}</p>
      ) : temperatureData.length > 0 ? (
        <div className="bg-card p-4 rounded-lg shadow-xl">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>{currentLocale.labels.noData}</p>
      )}

      <p className="mt-6 text-lg">
        {currentLocale.labels.lastReading}:{" "}
        <strong>
          {temperatureData.length > 0
            ? `${temperatureData[
                temperatureData.length - 1
              ].temperature.toFixed(2)}°C`
            : "N/A"}
        </strong>
      </p>
    </div>
  );
};

export default TemperatureChart;
