import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "chart.js/auto";

const API_URL =
  "https://bx85msyxwb.execute-api.sa-east-1.amazonaws.com/dev/temperatures";

const WEBSOCKET_URL =
  "wss://eu2xrp83l0.execute-api.sa-east-1.amazonaws.com/dev/";

const ACCENT_COLOR = "#38bdf8";

// Localization configurations
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

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState("US");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch data from API");
        }
        const historicalData = await response.json();

        historicalData.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
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
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setTemperatureData((prevData) => {
        const newData = [...prevData, lastJsonMessage];
        return newData.slice(-1000);
      });
    }
  }, [lastJsonMessage]);

  const currentLocale = LOCALES[selectedLocale];

  const formatTimeForLocale = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(currentLocale.code, {
      timeZone: currentLocale.timezone,
      hour12: selectedLocale === "US",
    });
  };

  const chartData = {
    labels: temperatureData.map((data) => formatTimeForLocale(data.timestamp)),
    datasets: [
      {
        label: currentLocale.labels.temperature,
        data: temperatureData.map((data) => data.temperature),
        borderColor: ACCENT_COLOR,
        backgroundColor: `${ACCENT_COLOR}80`, // Adds 50% opacity
        tension: 0.2,
        pointRadius: temperatureData.map((_, index) =>
          index === temperatureData.length - 1 ? 5 : 1
        ),
        pointBackgroundColor: ACCENT_COLOR,
        pointBorderColor: temperatureData.map((_, index) =>
          index === temperatureData.length - 1 ? ACCENT_COLOR : "transparent"
        ),
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 20,
        suggestedMax: 30,
      },
    },
    animation: {
      duration: 100,
    },
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: currentLocale.labels.connecting,
    [ReadyState.OPEN]: currentLocale.labels.connected,
    [ReadyState.CLOSING]: currentLocale.labels.disconnecting,
    [ReadyState.CLOSED]: currentLocale.labels.disconnected,
    [ReadyState.UNINSTANTIATED]: currentLocale.labels.uninstantiated,
  }[readyState];

  return (
    <div className="container text-center">
      <div className="mb-4">
        <select
          value={selectedLocale}
          onChange={(e) => setSelectedLocale(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="US">🇺🇸 United States (EST)</option>
          <option value="BR">🇧🇷 Brazil (BRT)</option>
        </select>
      </div>

      <h1>{currentLocale.labels.title}</h1>
      <p>
        {currentLocale.labels.connectionStatus}:{" "}
        <strong>{connectionStatus}</strong>
      </p>
      {isLoading ? (
        <p>{currentLocale.labels.loading}</p>
      ) : temperatureData.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>{currentLocale.labels.noData}</p>
      )}
      <p className="mt-20 fs-small">
        {currentLocale.labels.lastReading}:{" "}
        <strong>
          {temperatureData.length > 0
            ? `${temperatureData[temperatureData.length - 1].temperature}°C`
            : "N/A"}
        </strong>
      </p>
    </div>
  );
}

export default App;
